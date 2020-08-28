import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage {

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    centeredSlides: true,
    speed: 400,
    shadow: true,
    slideShadows: true,
    rotate: 50
  }

  slides = [ 
    {
      imgSrc: 'assets/img/logo-inegi.png',
      imgAlt: 'INEGI Logo',
      title: 'Bienvenido',
      // subTitle: 'En cualquier lugar',
      description: 'Esta es la app para la selección de viviendas.',
      icon: 'play'
    },
    {
      imgSrc: 'assets/img/logo-inegi.png',
      imgAlt: 'INEGI Logo',
      title: 'Selecciona la entidad',
      // subTitle: 'De videos increibles',
      description: 'Al seleccionar tu entidad podrás recorrer las viviendas existentes en esa entidad.',
      icon: 'videocam'
    },
  ];

  constructor(
    private router: Router,
    private storage: Storage
  ) { }

  closeIntro(){
    this.storage.set('isIntroLivingPlaceShowed', true);
    this.router.navigateByUrl('/login');
  }

}
