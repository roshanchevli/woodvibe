import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { ApiService } from '../services/api.service';
// import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
selector:'app-checkout',
standalone:true,
imports:[CommonModule,FormsModule,RouterLink],
templateUrl:'./checkout.component.html',
styleUrls:['./checkout.component.css']
})

export class CheckoutComponent implements OnInit{

cart:any[]=[];
subtotal:number=0;
shipping:number=50;
total:number=0;

email="";
fname="";
lname="";
address="";
city="";
state="Gujarat";
pincode="";
phone="";

constructor(private api:ApiService, private router:Router,private cdr: ChangeDetectorRef){}

ngOnInit(){

const user = JSON.parse(localStorage.getItem("user") || "{}");

this.api.getCart(user.id).subscribe((data:any)=>{

this.cart = data;

this.subtotal = 0;
this.cart.forEach((c:any)=>{
this.subtotal += Number(c.price) * Number(c.qty);
});

this.total = this.subtotal + this.shipping;

this.cdr.detectChanges();

});

}

placeOrder(){

if(!this.email || !this.fname || !this.lname || !this.address || !this.city || !this.pincode || !this.phone){

      alert('Please fill all required fields');
      return;

}

const user = JSON.parse(localStorage.getItem("user") || "{}");

const data={
uid:user.id,
address:this.address,
city:this.city,
pincode:this.pincode,
mobile:this.phone
};

    this.api.placeOrder(data).subscribe(() => {
      this.router.navigate(['/order-success']);
    });

}

}