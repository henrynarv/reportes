import { Pipe, PipeTransform } from "@angular/core";
import { Observable } from "rxjs";

@Pipe({
  name: 'imagenPreview'
})

export class ImagenPreviewPipe implements PipeTransform {
  transform(file: File): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        observer.next(result);
        observer.complete();
        console.log('result del pipe: ', result);

      },
        reader.onerror = (error) => {
          observer.error(error);
        };
      reader.readAsDataURL(file);

    });

  }
}
