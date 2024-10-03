import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ImagenBannerService } from '../../../services/imagen-banner.service';
import { Observable, map } from 'rxjs';
import { Swiper, SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';



@Component({
  selector: 'app-slider',

  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {

  // swiperElement = signal<SwiperContainer | null>(null);

  imagenes: string[] = [];
  constructor(private imagenBannerService: ImagenBannerService) {

  }


  ngAfterViewInit() {

    const swiperElementConstructor = document.querySelector('swiper-container') as SwiperContainer;
    const swiperOptions: SwiperOptions = {


      effect: "coverflow",

      grabCursor: true,
      centeredSlides: true,
      initialSlide: 3,
      // loop: true,



      speed: 600,
      preventClicks: true,


      slidesPerView: "auto",
      coverflowEffect: {
        rotate: 0,
        stretch: 20,
        depth: 100,
        modifier: 2.5,
        slideShadows: true,

      },
      // loop: true,
      spaceBetween: 10,
      // effect: 'fade',
      pagination: { clickable: true },

      navigation: true,

      // autoplay: {
      //   delay: 3000,
      // },

      autoplay: {

        delay: 3000,
        disableOnInteraction: false,// No desactivar autoplay en interacción

      }
    };


    Object.assign(swiperElementConstructor, swiperOptions);
    // this.swiperElement.set(swiperElementConstructor as SwiperContainer)
    swiperElementConstructor!.initialize();
  }




  ngOnInit(): void {



    this.slider();
  }

  slider() {
    this.imagenBannerService.getAllImagenes().subscribe(
      response => {
        this.imagenes = response.map((img: any) => img.url)
        console.log("this.imagenes", this.imagenes);
      },
      error => {
        console.error('Error al obtener las imagenes ', error);
      }
    )
  }


  /*



  ngOnInit(): void {
      const swiperElementConstructor = document.querySelector('swiper-container');
      const swiperOptions: SwiperOptions = {
        slidesPerView: 1,
        spaceBetween: 10,
        effect: 'fade',
        pagination: { clickable: true },
        navigation: true,
        autoplay: {
          delay: 3000,
        },
        // loop: true,
      };


      Object.assign(swiperElementConstructor!, swiperOptions);
      this.swiperElement.set(swiperElementConstructor as SwiperContainer)
      this.swiperElement()?.initialize();

      this.slider();
    }

    slider() {
      this.imagenBannerService.getAllImagenes().subscribe(
        response => {
          this.imagenes = response.map((img: any) => img.url)
          console.log("this.imagenes", this.imagenes);
        },
        error => {
          console.error('Error al obtener las imagenes ', error);
        }
      )
    }
  */

}
