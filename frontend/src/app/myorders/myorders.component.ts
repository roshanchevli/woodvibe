import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'appmy-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const uid = user.id;

    if (uid) {
      this.api.getUserOrders(uid).subscribe((res: any) => {
        this.orders = res;
        this.cdr.detectChanges();
        
        // Refresh AOS animations since new elements are added to DOM
        setTimeout(() => {
          if (typeof (window as any).AOS !== 'undefined') {
            (window as any).AOS.refresh();
          }
        }, 100);
      });
    }
  }
}