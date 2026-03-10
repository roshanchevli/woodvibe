import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-product.component.html',
  styleUrl:'./add-product.component.css',
  
})
export class AddProductComponent implements OnInit {

  categories: any[] = [];
  product: any = {
  category: '',
  pname: '',
  pdesc: '',
  price: '',
  qty: '',
  date: ''
};
  file: any;
  @ViewChild('fileInput') fileInput!: ElementRef;
  

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

ngOnInit() {
  this.http.get<any[]>('http://localhost:3000/api/category')
    .subscribe(data => {
      this.categories = data;
       this.cdr.detectChanges();      // 🔥 force UI update
    });
}
  onFile(e: any) {
    this.file = e.target.files[0];
  }

  save(form: NgForm) {

  const fd = new FormData();
  Object.keys(this.product).forEach(k => {
    fd.append(k, this.product[k]);
  });

  if (this.file) {
    fd.append('photo', this.file);
  }

  this.http.post('http://localhost:3000/api/product', fd)
    .subscribe(() => {

      alert('Product Saved Successfully');

      // Reset Angular form
      form.resetForm();

      // Reset object manually
      this.product = {
        category: '',
        pname: '',
        pdesc: '',
        price: '',
        qty: '',
        date: ''
      };

      // Clear file variable
      this.file = null;

      // Clear file input UI
      this.fileInput.nativeElement.value = '';

    });

}
}
