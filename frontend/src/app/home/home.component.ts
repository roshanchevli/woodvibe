import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { CategoryComponent } from '../category/category.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent,CategoryComponent],
  templateUrl: './home.component.html',
  styleUrl:'./home.component.css',
  
})
export class HomeComponent {}