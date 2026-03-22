import { Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
selector:'app-cart',
standalone:true,
imports:[CommonModule,RouterLink, FormsModule],
templateUrl:'./cart.component.html',
styleUrls:['./cart.component.css']
})

export class CartComponent implements OnInit{

cart:any[]=[];
subtotal:number=0;
shipping:number=50;
total:number = 0;

constructor(private api:ApiService, private cdr: ChangeDetectorRef){}

ngOnInit(){

const user = JSON.parse(localStorage.getItem("user") || "{}");

this.api.getCart(user.id).subscribe(data=>{
this.cart = data;
this.calculateTotal();
this.cdr.detectChanges();
});

}

calculateTotal(){
this.subtotal = 0;
this.cart.forEach(c=>{
this.subtotal += Number(c.price) * Number(c.qty);
});
this.total = this.subtotal + this.shipping;
}

increaseQty(item:any){
item.qty++;
this.api.updateCart(item._id,item.qty).subscribe(()=>{
this.calculateTotal();
this.cdr.detectChanges();
});
}

decreaseQty(item:any){
if(item.qty>1){
item.qty--;
this.api.updateCart(item._id,item.qty).subscribe(()=>{
this.calculateTotal();
this.cdr.detectChanges();
});
}
}

remove(id:string){
Swal.fire({
  title: 'Remove item?',
  text: 'This will be removed from your cart',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#e74c3c',
  cancelButtonColor: '#a3947c',
  confirmButtonText: 'Yes, remove it'
}).then((result) => {
  if (result.isConfirmed) {
    this.api.removeCart(id).subscribe(()=>{
      this.cart = this.cart.filter(c=>c._id !== id);
      this.calculateTotal();
      this.cdr.detectChanges();
    });
  }
});
}

}