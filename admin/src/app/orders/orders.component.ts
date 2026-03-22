import { Component,OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
selector:'app-orders',
standalone:true,
imports:[CommonModule, RouterLink],
templateUrl:'./orders.component.html',
styleUrls:['./orders.component.css']
})

export class OrdersComponent implements OnInit{

orders:any[]=[];

constructor(private api:ApiService, private router: Router, private cdr: ChangeDetectorRef){}

ngOnInit(){

this.api.getAllOrders().subscribe(data=>{
this.orders = data;
this.cdr.detectChanges();   // 🔥 FORCE VIEW UPDATE

console.log(this.orders); // 🔥 IMPORTANT for debugging
});

}

viewOrder(id:any){
this.router.navigate(['/admin/orderdetails', id]);
}

}