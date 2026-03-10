import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';

import { AddCategoryComponent } from './category/add-category/add-category.component';
import { ViewCategoryComponent } from './category/view-category/view-category.component';

import { AddProductComponent } from './product/add-product/add-product.component';
import { ViewProductComponent } from './product/view-product/view-product.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [

  // Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth routes (NO GUARD)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 🔐 Protected Routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'category/add', component: AddCategoryComponent, canActivate: [authGuard] },
  { path: 'category/view', component: ViewCategoryComponent, canActivate: [authGuard] },
  { path: 'product/add', component: AddProductComponent, canActivate: [authGuard] },
  { path: 'product/view', component: ViewProductComponent, canActivate: [authGuard] },
  { path: 'user', component: UserComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },

  // Optional wildcard
  { path: '**', redirectTo: 'login' }

];