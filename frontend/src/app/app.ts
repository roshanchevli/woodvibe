import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgIf } from '@angular/common';

declare var AOS: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  showLayout = true;

  ngOnInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
      });
    }
  }

  constructor(private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        const currentUrl = event.urlAfterRedirects;

        // Hide header & footer on login page
        this.showLayout = !currentUrl.includes('/login');

      });

  }
}