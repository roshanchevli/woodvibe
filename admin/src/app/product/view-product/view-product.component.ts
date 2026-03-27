import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css',
})
export class ViewProductComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  editId: any = null;
  categories: any[] = [];
  selectedProduct: any = null;
  selectedFiles: any[] = [];
  editPreviews: string[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}
  onFile(event: any) {
    const newlySelected = Array.from(event.target.files);
    const existingCount = this.selectedProduct?.photos?.length || (this.selectedProduct?.photo ? 1 : 0);

    if (existingCount + newlySelected.length > 5) {
      alert(`Maximum 5 images allowed. This product already has ${existingCount} images. You can only add ${5 - existingCount} more.`);
      event.target.value = '';
      this.selectedFiles = [];
      this.editPreviews = [];
      return;
    }

    this.selectedFiles = newlySelected;
    this.editPreviews = [];
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editPreviews.push(e.target.result);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });
  }

  // =============================
  // LOAD PRODUCTS
  // =============================
  ngOnInit() {
    // Load products
    this.http.get<any[]>('http://localhost:3000/api/product').subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
      this.cdr.detectChanges();
    });

    // Load categories for dropdown
    this.http.get<any[]>('http://localhost:3000/api/category').subscribe((data) => {
      this.categories = data;
    });
  }

  // =============================
  // SEARCH FUNCTION
  // =============================
  search() {
    this.filteredProducts = this.products.filter((p) =>
      p.pname.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  // =============================
  // EDIT
  // =============================
  edit(product: any) {
    this.editId = product._id;
    this.selectedProduct = product;
  }

  // =============================
  // CANCEL
  // =============================
  cancel() {
    this.editId = null;
    this.ngOnInit(); // reload original data
  }

  // =============================
  // UPDATE
  // =============================
  // update(product: any) {
  //   this.http.put(`http://localhost:3000/api/product/${product._id}`, product).subscribe(() => {
  //     this.editId = null;
  //     this.ngOnInit();
  //   });
  // }
  update(product: any) {
    const fd = new FormData();

    fd.append('category', product.category);
    fd.append('pname', product.pname);
    fd.append('pdesc', product.pdesc || '');
    fd.append('price', product.price);
    fd.append('qty', product.qty);
    fd.append('date', product.date);

    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        fd.append('photos', file);
      });
    }

    this.http.put(`http://localhost:3000/api/product/${product._id}`, fd).subscribe(() => {
      this.editId = null;
      this.selectedFiles = [];
      this.editPreviews = [];
      this.ngOnInit();
    });
  }

  // =============================
  // DELETE
  // =============================
  delete(id: string) {
    if (confirm('Delete this product?')) {
      this.http.delete(`http://localhost:3000/api/product/${id}`).subscribe(() => {
        // Reload like category
        this.ngOnInit();
      });
    }
  }
}
