import { Component, AfterViewInit } from '@angular/core';

declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('.one-slider').slick({
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        arrows: false,
        infinite: true,
        fade: true,
        speed: 800
      });

      AOS.init();
    }, 300);
  }

}