package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.Usuario;


import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.opencv.core.*;
import org.opencv.features2d.BFMatcher;
import org.opencv.features2d.DescriptorMatcher;
import org.opencv.features2d.ORB;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FaceRecognitionService {

  static {
    System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
  }

  @Autowired
  UsuarioServiceImpl usuarioService;
  private CascadeClassifier faceCascade;

  public FaceRecognitionService() {
    try {
      ClassPathResource resource = new ClassPathResource("haarcascade_frontalface_default.xml");
      File tempFile = File.createTempFile("haarcascade_frontalface_default", ".xml");
      try (InputStream inputStream = resource.getInputStream();
           OutputStream outputStream = new FileOutputStream(tempFile)) {
        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
          outputStream.write(buffer, 0, bytesRead);
        }
      }
      faceCascade = new CascadeClassifier(tempFile.getAbsolutePath());
      // Eliminar el archivo temporal después de cargar el clasificador
      tempFile.deleteOnExit();
    } catch (IOException e) {
      throw new RuntimeException("No se pudo cargar el clasificador en cascada", e);
    }
  }


  public Optional<Usuario> authenticate(MultipartFile imageFile) throws IOException {
    Mat image = Imgcodecs.imdecode(new MatOfByte(imageFile.getBytes()), Imgcodecs.IMREAD_COLOR);
    if (image.empty()) {
      throw new IOException("No se pudo leer la imagen.");
    }

    MatOfRect faceDetections = new MatOfRect();
    faceCascade.detectMultiScale(image, faceDetections);

    // Suponiendo que solo se detecta un rostro
    for (Rect rect : faceDetections.toArray()) {
      Mat faceCptured = new Mat(image, rect);
      List<Usuario> usuarios = usuarioService.listarTodo();
      System.out.println("Usuarios: " + usuarios.stream().count());
      for (Usuario usuario : usuarios) {
        System.out.println("usuariosssssssssssssss" + usuario.getUrlImagen());
        System.out.println("faceCptureddddddddddd" + faceCptured);
        Mat storadedFace = loadUserFaceImage(usuario.getUrlImagen());
        System.out.println("storadedFace " + storadedFace);
        if (storadedFace != null) {
          // Comparar la cara capturada con la almacenada
          if (compareFaces(faceCptured, storadedFace)) {
            System.out.println("Coincidencia encontrada");
            return Optional.of(usuario);// Coincidencia encontrada
          }
        }
      }
    }
    System.out.println("Coincidencia NO encontrada");
    return Optional.empty();// Ninguna coincidencia encontrada
  }

  private Mat loadUserFaceImage(String imagePath) {
    Mat image = new Mat();
    try {
      if (imagePath.startsWith("http")) {
        // Si la ruta es una URL, descargar la imagen
        URL url = new URL(imagePath);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        int responseCode = connection.getResponseCode();

        if(responseCode == HttpURLConnection.HTTP_OK){


        try (InputStream inputStream = connection.getInputStream()) {
          BufferedImage bufferedImage = ImageIO.read(inputStream);
          if (bufferedImage != null) {
            image = bufferedImageToMat(bufferedImage);
            System.out.println("ImageXXXXXXXXXX" + image);
          } else {
            System.out.println("imagen descargada esta vacia");
          }
        }
        } else {
            System.out.println("Error HTTP al cargar la imagen: " + responseCode);
            // Puedes establecer una imagen por defecto aquí si es necesario
          }
      } else {
        // Si la ruta es un archivo local
        image = Imgcodecs.imread(imagePath);
      }
      if (image.empty()) {
        System.out.println("No se pudo cargar la imagen: " + imagePath);
      }
    } catch (IOException e) {
      System.out.println("Error al cargar la imagen: " + imagePath);
      e.printStackTrace();
    }
    return image;
  }

  private Mat bufferedImageToMat(BufferedImage bufferedImage) {
    // Convertir BufferedImage a Mat
    int width = bufferedImage.getWidth();
    int height = bufferedImage.getHeight();
    Mat mat = new Mat(height, width, CvType.CV_8UC3);
    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        int rgb = bufferedImage.getRGB(x, y);
        byte blue = (byte) (rgb & 0xFF);
        byte green = (byte) ((rgb >> 8) & 0xFF);
        byte red = (byte) ((rgb >> 16) & 0xFF);
        mat.put(y, x, new byte[]{blue, green, red});
      }
    }
    return mat;
  }

  private static final int LBP_RADIUS = 1;
  private static final int LBP_NEIGHBORS = 8;

  private boolean compareFaces(Mat faceCaptured, Mat storedFace) {
    // Convertir las imágenes a escala de grises
    Mat grayFaceCaptured = new Mat();
    Mat grayStoredFace = new Mat();
    if (faceCaptured.channels() == 3) {
      Imgproc.cvtColor(faceCaptured, grayFaceCaptured, Imgproc.COLOR_BGR2GRAY);
    } else {
      grayFaceCaptured = faceCaptured.clone();
    }
    if (storedFace.channels() == 3) {
      Imgproc.cvtColor(storedFace, grayStoredFace, Imgproc.COLOR_BGR2GRAY);
    } else {
      grayStoredFace = storedFace.clone();
    }

    // Redimensionar las imágenes
    Size size = new Size(200, 200);
    Mat resizedFaceCaptured = new Mat();
    Mat resizedStoredFace = new Mat();
    Imgproc.resize(grayFaceCaptured, resizedFaceCaptured, size);
    Imgproc.resize(grayStoredFace, resizedStoredFace, size);

    // Crear ORB detector y descriptores
    ORB orb = ORB.create();
    Mat descriptorsFaceCaptured = new Mat();
    Mat descriptorsStoredFace = new Mat();
    MatOfKeyPoint keyPointsFaceCaptured = new MatOfKeyPoint();
    MatOfKeyPoint keyPointsStoredFace = new MatOfKeyPoint();
    orb.detectAndCompute(resizedFaceCaptured, new Mat(), keyPointsFaceCaptured, descriptorsFaceCaptured);
    orb.detectAndCompute(resizedStoredFace, new Mat(), keyPointsStoredFace, descriptorsStoredFace);

    // Crear matcher y encontrar coincidencias
    BFMatcher matcher = new BFMatcher(DescriptorMatcher.BRUTEFORCE_HAMMING, true);
    MatOfDMatch matches = new MatOfDMatch();
    matcher.match(descriptorsFaceCaptured, descriptorsStoredFace, matches);

    // Obtener la lista de matches
    List<DMatch> matchList = matches.toList();

    // Encontrar el valor máximo y mínimo de distancia
    double maxDist = 0;
    double minDist = Double.MAX_VALUE;

    for (DMatch match : matchList) {
      double dist = match.distance;
      if (dist < minDist) minDist = dist;
      if (dist > maxDist) maxDist = dist;
    }

    // Filtrar buenos matches
    List<DMatch> goodMatches = new ArrayList<>();
    for (DMatch match : matchList) {
      if (match.distance <= 3 * minDist) {
        goodMatches.add(match);
      }
    }

    // Calcular la tasa de coincidencias
    double similarity = (double) goodMatches.size() / (double) keyPointsFaceCaptured.toList().size();

    // Ajustar umbral según el caso de uso
    return similarity > 0.5; // Ajustar el umbral según sea necesario
  }
}