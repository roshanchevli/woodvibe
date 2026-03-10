import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: any[] = [];

constructor(
  private api: ApiService,
  private cdr: ChangeDetectorRef,
  private router: Router
) {}
  ngOnInit(): void {

    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Category error:", err);
      }
    });

  }

  openCategory(category: string) {
  console.log(category);
  this.router.navigate(['/products', category]);
}

}