import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

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
  wishlistCount:number = 0;
  cartCount:number = 0;

  constructor(
    public auth: AuthService,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(){

    this.api.getCategories().subscribe(data=>{
      this.cdr.detectChanges();
      this.categories = data;
    });

    this.api.getProducts().subscribe(data=>{
      this.products = data;
      this.cdr.detectChanges();
    });

    // this.loadWishlistCount();

    // this.loadCartCount();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

if(user.id){
this.api.getCartCount(user.id).subscribe(res=>{
this.cartCount = res.count;
});
}

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

  openWishlist(){

if(!this.auth.isLoggedIn()){

Swal.fire({
title:"Login Required",
text:"Please login to access your wishlist ❤️",
icon:"info",
confirmButtonText:"Login Now"
}).then(result=>{
if(result.isConfirmed){
this.router.navigate(['/login']);
}
});

return;
}

this.router.navigate(['/wishlist']);

}

loadWishlistCount(){

const user = JSON.parse(localStorage.getItem("user") || "{}");

if(!user.id){
this.wishlistCount = 0;
return;
}

this.api.getWishlistCount(user.id).subscribe((data:any)=>{
this.wishlistCount = data.count;
});

}

loadCartCount(){

const user = JSON.parse(localStorage.getItem("user") || "{}");

if(!user.id){
this.cartCount = 0;
return;
}

this.api.getCartCount(user.id).subscribe((data:any)=>{
this.cartCount = data.count;
});

}
}