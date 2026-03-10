import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getAuth, signOut } from 'firebase/auth';
import { Router, RouterLink, RouterOutlet, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  template: `
    <div *ngIf="showLayout" class="dashboard">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <img src='images/woodnew.png' height=130px width=130px class='rounded-circle'>
        </div>

        <nav>
          <!-- DASHBOARD -->
          <a routerLink="/dashboard" routerLinkActive="active-link"> 🏠 Dashboard </a>

          <!-- CATEGORY -->
          <div class="menu-group">
            <div class="menu-title" (click)="toggleCategory()">
              📂 Category
              <span>{{ showCategory ? '▲' : '▼' }}</span>
            </div>

            <div class="submenu-container" [class.open]="showCategory">
              <a routerLink="/category/add" routerLinkActive="active-link" class="submenu">
                ➕ Add Category
              </a>
              <a routerLink="/category/view" routerLinkActive="active-link" class="submenu">
                📄 View Category
              </a>
            </div>
          </div>

          <!-- PRODUCT -->
          <div class="menu-group">
            <div class="menu-title" (click)="toggleProduct()">
              📦 Product
              <span>{{ showProduct ? '▲' : '▼' }}</span>
            </div>

            <div class="submenu-container" [class.open]="showProduct">
              <a routerLink="/product/add" routerLinkActive="active-link" class="submenu">
                ➕ Add Product
              </a>
              <a routerLink="/product/view" routerLinkActive="active-link" class="submenu">
                📄 View Product
              </a>
            </div>
          </div>

          <!-- USER -->
          <a routerLink="/user" routerLinkActive="active-link"> 👤 User </a>

          <!-- ORDERS -->
          <a routerLink="/orders" routerLinkActive="active-link"> 🛒 Orders </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="topbar">
          <h1>Dashboard</h1>

          <div style="display:flex; gap:10px; align-items:center;">
            <button class="logout-btn" (click)="logout()">Logout</button>
          </div>
        </header>

        <section class="content">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
    <div *ngIf="!showLayout">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      /* YOUR SAME CSS — NO CHANGES */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .dashboard {
        display: flex;
        height: 100vh;
        font-family: 'Segoe UI', sans-serif;
      }
      .sidebar {
        width: 260px;
        background: linear-gradient(180deg, #111827, #1e293b);
        color: white;
        padding: 25px 15px;
        display: flex;
        flex-direction: column;
        box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
      }
      .logo {
        text-align: center;
        margin-bottom: 30px;
        font-size: 1.3rem;
        font-weight: bold;
        letter-spacing: 1px;
      }
      nav a {
        display: block;
        padding: 12px 15px;
        margin-bottom: 8px;
        color: #cbd5e1;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        font-size: 0.95rem;
        position: relative;
      }
      nav a:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        transform: translateX(5px);
      }
      .active-link {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff !important;
        font-weight: 600;
        border-left: 4px solid #ffffff;
      }
      .menu-group {
        margin-top: 15px;
      }
      .menu-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 12px 15px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        font-weight: 600;
        transition: 0.3s;
      }
      .menu-title:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      .submenu-container {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s ease;
      }
      .submenu-container.open {
        max-height: 200px;
      }
      .submenu {
        padding-left: 35px !important;
        font-size: 0.9rem;
      }
      .main-content {
        flex: 1;
        background: #ffffff;
        display: flex;
        flex-direction: column;
      }
      .topbar {
        background: linear-gradient(180deg, #111827, #1e293b);
        padding: 18px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
      }
      .topbar h1 {
        font-size: 1.4rem;
        font-weight: 600;
        color: #ffffff;
      }
      .user-badge {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.85rem;
      }
      .content {
        padding: 25px;
        flex: 1;
        overflow-y: auto;
        background: #ffffff;
        color: #1e293b;
      }
      .logout-btn {
        background: #ef4444; /* Red */
        border: none;
        padding: 8px 16px;
        color: #ffffff;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .logout-btn:hover {
        background: #dc2626; /* Darker red */
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      }

      .logout-btn:active {
        transform: scale(0.95);
      }

      .logout-btn:focus {
        outline: none;
      }
    `,
  ],
})
export class App {
    showLayout = true;

  constructor(private router: Router) {

  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {

      const currentUrl = event.urlAfterRedirects;

      if (currentUrl.startsWith('/login') || 
          currentUrl.startsWith('/register')) {

        this.showLayout = false;

      } else {

        this.showLayout = true;

      }

    });

}
  showCategory = false;
  showProduct = false;

  toggleCategory() {
    this.showCategory = !this.showCategory;
    this.showProduct = false;
  }

  toggleProduct() {
    this.showProduct = !this.showProduct;
    this.showCategory = false;
  }
  logout() {
    signOut(getAuth()).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
