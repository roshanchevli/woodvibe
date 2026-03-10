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

        // Custom scroll behavior for product categories
        if (currentUrl.includes('/products/')) {
          setTimeout(() => {
            const productList = document.getElementById('product-list');
            if (productList) {
              const headerOffset = 100;
              const elementPosition = productList.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
          }, 100);
        } else {
          // Default scroll to top for other pages
          window.scrollTo(0, 0);
        }

        // Hide header & footer on login page
        this.showLayout = !currentUrl.includes('/login');

      });

  }
}