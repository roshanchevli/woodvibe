import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {

  product: any = null;
  isWishlisted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log("Current Route Product ID:", id);

      if (id) {
        this.api.getProductById(id).subscribe({
          next: (data) => {
            if (data) {
              console.log("Product data successfully loaded:", data);
              this.product = data;
              this.checkWishlistStatus();

              // Force Angular to check for changes
              this.cdr.detectChanges();

              // Refresh AOS animations since new elements are added to DOM
              setTimeout(() => {
                if (typeof (window as any).AOS !== 'undefined') {
                  (window as any).AOS.refresh();
                }
              }, 100);
            } else {
              console.warn("API returned empty data for ID:", id);
            }
          },
          error: (err) => {
            console.error("Critical error while fetching product:", err);
          }
        });
      }
    });
  }

  checkWishlistStatus() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id || !this.product) return;

    this.api.getWishlist(user.id).subscribe((wishlist: any[]) => {
      this.isWishlisted = wishlist.some(item => item.pid === this.product._id);
      this.cdr.detectChanges();
    });
  }

  addWishlist(p: any) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      alert("Please login first");
      return;
    }

    const data = {
      uid: user.id,
      pid: p._id,
      pname: p.pname,
      price: p.price,
      photo: p.photo
    };

    this.api.addToWishlist(data).subscribe((res: any) => {
      this.isWishlisted = true;
      this.cdr.detectChanges();
      alert("Added to wishlist");
    });
  }

  addToCart(product: any) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      alert("Please login first");
      return;
    }

    const data = {
      uid: user.id,
      pid: product._id,
      pname: product.pname,
      price: product.price,
      photo: product.photo
    };

    this.api.addToCart(data).subscribe(() => {
      alert("Added to cart");
    });
  }

}