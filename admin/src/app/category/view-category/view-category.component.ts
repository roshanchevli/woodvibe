import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-view-category',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './view-category.component.html',
  styleUrl:'./view-category.component.css'
})
export class ViewCategoryComponent implements OnInit {

  categories: any[] = [];
  filteredCategories: any[] = [];
  editId: string | null = null;
  searchText = '';
  selectedFile: any = null;
  onFile(event: any) {
  this.selectedFile = event.target.files[0];
}

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<any[]>('http://localhost:3000/api/category')
      .subscribe(res => {
        this.categories = res;
        this.filteredCategories = res;
        this.cdr.detectChanges();   // 🔥 FORCE VIEW UPDATE
      });
  }

  search() {
    const text = this.searchText.toLowerCase();
    this.filteredCategories = this.categories.filter(c =>
      c.categoryId.toLowerCase().includes(text) ||
      c.categoryName.toLowerCase().includes(text)
    );
  }

  edit(cat: any) {
    this.editId = cat._id;
  }

  cancel() {
    this.editId = null;
    this.load();
  }

  // update(cat: any) {
  //   this.http.put(`http://localhost:3000/api/category/${cat._id}`, {
  //     categoryId: cat.categoryId,
  //     categoryName: cat.categoryName
  //   }).subscribe(() => {
  //     alert('Updated successfully');
  //     this.editId = null;
  //   });
  // }
  update(cat: any) {

  const fd = new FormData();
  fd.append('categoryId', cat.categoryId);
  fd.append('categoryName', cat.categoryName);

  if (this.selectedFile) {
    fd.append('photo', this.selectedFile);
  }

  this.http.put(`http://localhost:3000/api/category/${cat._id}`, fd)
    .subscribe(() => {
      alert('Updated successfully');
      this.editId = null;
      this.selectedFile = null;
      this.load();
    });

}

  delete(id: string) {
    if (confirm('Delete this category?')) {
      this.http.delete(`http://localhost:3000/api/category/${id}`)
        .subscribe(() => this.load());
    }
  }
}