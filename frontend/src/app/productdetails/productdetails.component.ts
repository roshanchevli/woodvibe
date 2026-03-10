import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {

  product: any = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log("Current Route Product ID:", id);

      if (id) {
        this.api.getProductById(id).subscribe({
          next: (data) => {
            if (data) {
              console.log("Product data successfully loaded:", data);
              this.product = data;
              
              // Force Angular to check for changes
              this.cdr.detectChanges();
              
              // Refresh AOS animations since new elements are added to DOM
              setTimeout(() => {
                if (typeof (window as any).AOS !== 'undefined') {
                  (window as any).AOS.refresh();
                }
              }, 100);
            } else {
              console.warn("API returned empty data for ID:", id);
            }
          },
          error: (err) => {
            console.error("Critical error while fetching product:", err);
          }
        });
      }
    });
  }

}