import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-orderdetails',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css']
})
export class OrderdetailsComponent implements OnInit {

  order: any = null;
  user: any = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    const orderId = this.route.snapshot.paramMap.get('id');

    if (orderId) {
      this.api.getOrderById(orderId).subscribe((res: any) => {
        this.order = res;
        this.cdr.detectChanges();
        
        // Refresh AOS
        setTimeout(() => {
          if (typeof (window as any).AOS !== 'undefined') {
            (window as any).AOS.refresh();
          }
        }, 100);
      });
    }
  }

  printInvoice() {
    window.print();
  }
}
