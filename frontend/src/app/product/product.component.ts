import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

declare var AOS: any;


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
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
      this.category = params['category'] || '';
      this.loadData();
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
        
        // Use the category from the route if it exists, otherwise default to "All"
        if (this.category) {
          this.selectedCategory = this.category;
        } else {
          this.selectedCategory = 'All';
        }
        
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

    // Scroll to the product category navbar instead of the very top
    const productList = document.getElementById('product-list');
    if (productList) {
      const headerOffset = 100; // Adjust based on your sticky header height
      const elementPosition = productList.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
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