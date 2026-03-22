import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductComponent } from './product/product.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import {  ProfileComponent } from './profile/profile.component';
import {  ProductdetailsComponent } from './productdetails/productdetails.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'product', component: ProductComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'productdetails/:id', component: ProductdetailsComponent},
  { path: 'products/:category', component: ProductComponent},
  { path:'wishlist', component: WishlistComponent},
  { path:'cart', component: CartComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'editprofile', 
    loadComponent: () => import('./editprofile/editprofile.component')
    .then(m => m.EditProfileComponent)
  },
  { path: 'changepassword',
    loadComponent: () => import('./changepassword/changepassword.component')
    .then(m => m.ChangePasswordComponent)
  },
  { path:'myorders',
    loadComponent:()=>import('./myorders/myorders.component')
    .then(m=>m.MyOrdersComponent)
  },
  { path: 'orderdetails/:id',
    loadComponent: () => import('./orderdetails/orderdetails.component')
    .then(m => m.OrderdetailsComponent)
  }
  
];  
