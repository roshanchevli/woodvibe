import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
selector:'app-wishlist',
standalone:true,
imports:[CommonModule, RouterLink],
templateUrl:'./wishlist.component.html',
styleUrls:['./wishlist.component.css']
})

export class WishlistComponent implements OnInit{

wishlist:any[]=[];

constructor(private api:ApiService, private cdr: ChangeDetectorRef){}

ngOnInit(){

const user = JSON.parse(localStorage.getItem("user") || "{}");

if(!user.id){
alert("Please login");
return;
}


this.api.getWishlist(user.id).subscribe(data=>{
this.wishlist = data;
this.cdr.detectChanges();

});

}

remove(id:string){

this.api.removeWishlist(id).subscribe(()=>{
this.wishlist = this.wishlist.filter(w=>w._id !== id);
});

}

addToCart(item:any){

const user = JSON.parse(localStorage.getItem("user") || "{}");

const data = {
uid:user.id,
pid:item.pid,
pname:item.pname,
price:item.price,
photo:item.photo
};

this.api.addToCart(data).subscribe((res:any)=>{

// product already exists
if(res.status === "exists"){

Swal.fire({
title:"Already in cart",
text:"This item is already in your cart. Increase quantity?",
icon:"question",
showCancelButton:true,
confirmButtonText:"Yes Increase",
cancelButtonText:"No"
}).then(result=>{

if(result.isConfirmed){

this.api.increaseCart(item.pid,user.id).subscribe(()=>{

Swal.fire(
"Increased!",
"Product quantity increased in cart",
"success"
);

});

}

});

}

// product added normally
else{

Swal.fire(
"Added!",
"Product added to cart successfully",
"success"
);

}

});

}

}