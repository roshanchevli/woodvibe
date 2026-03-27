import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  categories: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
}
