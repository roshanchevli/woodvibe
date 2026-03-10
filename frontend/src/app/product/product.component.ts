import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

declare var AOS: any;

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = 'All';
  searchQuery: string = '';
  category: string = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {

  this.route.params.subscribe(params => {

    const category = params['category'];

    if (category) {

      this.api.getProductsByCategory(category).subscribe(data => {
        this.products = data;
      });

      console.log("Category:", category);

    } else {

      this.loadData();

    }

  });

}

  loadData() {
    // Fetch Categories
    this.api.getCategories().subscribe({
      next: (data: any[]) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.log('Error fetching categories:', err)
    });

    // Fetch Products
    this.api.getProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
        this.filterProducts();
        this.cdr.detectChanges();
        setTimeout(() => {
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        }, 100);
      },
      error: (err: any) => {
        console.log('Error fetching products:', err);
      }
    });
  }

  filterProducts(category: string = this.selectedCategory) {
    this.selectedCategory = category;
    this.filteredProducts = this.products.filter(p => {
      const matchCategory = category === 'All' || p.category === category;
      const matchSearch = p.pname.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
    
    this.cdr.detectChanges();
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 50);
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.filterProducts();
  }

  viewDetails(id: string) {
  console.log("Clicked Product ID:", id);
  this.router.navigate(['/productdetails', id]);
}
}