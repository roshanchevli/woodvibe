import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: `./add-category.component.html`,
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent {
  categoryId = '';
  categoryName = '';
  photo!: File;
  message = '';
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    this.photo = event.target.files[0];
  }

  addCategory(form: NgForm) {
    const formData = new FormData();
    formData.append('categoryId', this.categoryId);
    formData.append('categoryName', this.categoryName);
    formData.append('photo', this.photo);

    this.http.post('http://localhost:3000/api/category', formData).subscribe(() => {
      alert('Category Added Successfully');

      // Reset entire form properly
      form.resetForm();

      // Clear file input
      this.fileInput.nativeElement.value = '';

      this.photo = undefined as any;
    });
  }
}
