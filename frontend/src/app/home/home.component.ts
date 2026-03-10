import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { CategoryComponent } from '../category/category.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, CategoryComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl:'./home.component.css',
  
})
export class HomeComponent {}