import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector:'app-orderdetails',
  standalone:true,
  imports:[CommonModule, FormsModule, RouterLink],
  templateUrl:'./orderdetails.component.html',
  styleUrls:['./orderdetails.component.css']
})

export class OrderDetailsComponent implements OnInit {

  order: any;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getOrderById(id).subscribe(data => {
      this.order = data;
      this.cdr.detectChanges();   // 🔥 FORCE VIEW UPDATE
    });
  }

  viewOrder(id: any) {
    this.router.navigate(['/admin/orderdetails', id]);
  }

  updateStatus() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.order && this.order.status) {
      this.api.updateOrderStatus(id, this.order.status).subscribe(() => {
        alert('Order status updated successfully!');
      }, err => {
        alert('Error updating status');
        console.error(err);
      });
    }
  }

}