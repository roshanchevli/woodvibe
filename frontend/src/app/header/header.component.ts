import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  categories:any[] = [];
  products:any[] = [];

  constructor(
    public auth: AuthService,
    private router: Router,
    private api: ApiService
  ){}

  ngOnInit(){

    this.api.getCategories().subscribe(data=>{
      this.categories = data;
    });

    this.api.getProducts().subscribe(data=>{
      this.products = data;
    });

  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/']);
    alert("Logged out successfully");
  }

  getProductsByCategory(cat:string){
    return this.products.filter(p => p.category === cat);
  }

  openProduct(id:string){
    this.router.navigate(['/productdetails', id]);
  }

  closeMenu() {
    const megaMenuContainer = document.querySelector('.mega-menu') as HTMLElement;
    if (megaMenuContainer) {
      // Apply a class that forces the menu closed regardless of hover state
      megaMenuContainer.classList.add('force-closed');

      // Remove the class after a short delay so the menu can be opened again on next hover
      setTimeout(() => {
        megaMenuContainer.classList.remove('force-closed');
      }, 500);
    }
  }

}