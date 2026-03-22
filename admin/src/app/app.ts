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
          <img src='images/woodnew.png' height=100px width=100px class='rounded-circle'>
          <div class="logo-text">WoodVibe Admin</div>
        </div>

        <nav>
          <!-- DASHBOARD -->
          <a routerLink="/dashboard" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
            <i class="ri-dashboard-line"></i> Dashboard
          </a>

          <!-- CATEGORY -->
          <div class="menu-group">
            <div class="menu-title" (click)="toggleCategory()">
              <div><i class="ri-folder-3-line"></i> Category</div>
              <i class="ri-arrow-down-s-line" [class.rotate]="showCategory"></i>
            </div>

            <div class="submenu-container" [class.open]="showCategory">
              <a routerLink="/category/add" routerLinkActive="active-link" class="submenu">
                 Add Category
              </a>
              <a routerLink="/category/view" routerLinkActive="active-link" class="submenu">
                 View Category
              </a>
            </div>
          </div>

          <!-- PRODUCT -->
          <div class="menu-group">
            <div class="menu-title" (click)="toggleProduct()">
              <div><i class="ri-box-3-line"></i> Product</div>
              <i class="ri-arrow-down-s-line" [class.rotate]="showProduct"></i>
            </div>

            <div class="submenu-container" [class.open]="showProduct">
              <a routerLink="/product/add" routerLinkActive="active-link" class="submenu">
                 Add Product
              </a>
              <a routerLink="/product/view" routerLinkActive="active-link" class="submenu">
                 View Product
              </a>
            </div>
          </div>

          <!-- USER -->
          <a routerLink="/user" routerLinkActive="active-link"> 
            <i class="ri-user-settings-line"></i> User
          </a>

          <!-- ORDERS -->
          <a routerLink="/orders" routerLinkActive="active-link"> 
            <i class="ri-shopping-cart-2-line"></i> Orders 
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="topbar">
          <h1>Workspace Console</h1>

          <div style="display:flex; gap:15px; align-items:center;">
            <div class="user-badge"><i class="ri-admin-line"></i> Admin User</div>
            <button class="logout-btn" (click)="logout()"><i class="ri-logout-box-r-line"></i></button>
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
      :host {
        --primary: #c29d6d;
        --sidebar-bg: #161412;
        --sidebar-hover: rgba(255, 255, 255, 0.05);
        --text-main: #f5f0e8;
        --text-light: #b0a596;
        --content-bg: #fdfbf7;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .dashboard {
        display: flex;
        height: 100vh;
        font-family: 'Outfit', sans-serif;
      }
      .sidebar {
        width: 270px;
        background: var(--sidebar-bg);
        color: var(--text-main);
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(255,255,255,0.05);
      }
      .logo {
        text-align: center;
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
      }
      .logo img {
        border-radius: 50%;
        border: 2px solid var(--primary);
        box-shadow: 0 4px 15px rgba(194, 157, 109, 0.2);
        object-fit: cover;
      }
      .logo-text {
        font-family: 'Playfair Display', serif;
        font-size: 1.25rem;
        color: var(--primary);
        letter-spacing: 1px;
      }
      nav a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        margin-bottom: 8px;
        color: var(--text-light);
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.3s ease;
        font-size: 1rem;
        font-weight: 500;
        border: 1px solid transparent;
      }
      nav a i {
        font-size: 1.2rem;
      }
      nav a:hover {
        background: var(--sidebar-hover);
        color: var(--text-main);
        transform: translateX(4px);
      }
      .active-link {
        background: rgba(194, 157, 109, 0.1);
        color: var(--primary) !important;
        border-color: rgba(194, 157, 109, 0.3);
      }
      .menu-group {
        margin-bottom: 8px;
      }
      .menu-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 14px 18px;
        background: transparent;
        color: var(--text-light);
        border-radius: 12px;
        font-weight: 500;
        transition: 0.3s;
        font-size: 1rem;
      }
      .menu-title > div {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .menu-title > div i {
        font-size: 1.2rem;
      }
      .menu-title:hover {
        background: var(--sidebar-hover);
        color: var(--text-main);
      }
      .ri-arrow-down-s-line {
        transition: transform 0.3s;
      }
      .ri-arrow-down-s-line.rotate {
        transform: rotate(180deg);
      }
      .submenu-container {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s ease;
      }
      .submenu-container.open {
        max-height: 200px;
        margin-top: 5px;
      }
      .submenu {
        padding-left: 50px !important;
        font-size: 0.95rem;
        padding-top: 10px;
        padding-bottom: 10px;
      }
      .main-content {
        flex: 1;
        background: var(--content-bg);
        display: flex;
        flex-direction: column;
      }
      .topbar {
        background: #ffffff;
        padding: 20px 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.05);
      }
      .topbar h1 {
        font-family: 'Playfair Display', serif;
        font-size: 1.6rem;
        font-weight: 600;
        color: #1a1a1a;
      }
      .user-badge {
        background: rgba(194, 157, 109, 0.1);
        color: #a8855a;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(194, 157, 109, 0.2);
      }
      .content {
        padding: 35px;
        flex: 1;
        overflow-y: auto;
        color: #2d2417;
      }
      .logout-btn {
        background: transparent;
        border: 1px solid #ef4444;
        color: #ef4444;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease;
      }

      .logout-btn:hover {
        background: #ef4444;
        color: #ffffff;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
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
