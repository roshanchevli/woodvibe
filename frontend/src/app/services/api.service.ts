import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = "http://localhost:3000/api";

  constructor(private http: HttpClient) {}

  // CATEGORY
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/category`);
  }

  // PRODUCTS
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/product`);
  }

  getProductsByCategory(category: string) {
    return this.http.get<any>(`http://localhost:3000/products/category/${category}`);
  }

  getProductById(id: string) {
    return this.http.get<any>(`http://localhost:3000/products/${id}`);
  }

  getUsers() {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  updateUserStatus(id: string, status: string) {
    return this.http.put(`${this.baseUrl}/users/${id}/status`, { status });
  }

  getUserOrders(uid: any) {
    return this.http.get(`${this.baseUrl}/userorders/${uid}`);
  }

  // ADD TO WISHLIST
  addToWishlist(data: any) {
    return this.http.post(`${this.baseUrl}/wishlist`, data);
  }

  // GET USER WISHLIST
  getWishlist(uid: string) {
    return this.http.get<any[]>(`${this.baseUrl}/wishlist/${uid}`);
  }

  // REMOVE WISHLIST
  removeWishlist(id: string) {
    return this.http.delete(`${this.baseUrl}/wishlist/${id}`);
  }

  // COUNT WISHLIST
  getWishlistCount(uid: string) {
    return this.http.get<any>(`${this.baseUrl}/wishlist-count/${uid}`);
  }

  // ADD TO CART
  addToCart(data: any) {
    return this.http.post(`${this.baseUrl}/cart`, data);
  }

  increaseCart(pid: string, uid: string) {
    return this.http.put(`${this.baseUrl}/cart/increase/${pid}/${uid}`, {});
  }

  // GET USER CART
  getCart(uid: string) {
    return this.http.get<any[]>(`${this.baseUrl}/cart/${uid}`);
  }

  // REMOVE FROM THE CART
  removeCart(id: string) {
    return this.http.delete(`${this.baseUrl}/cart/${id}`);
  }

  // UPDATE CART
  updateCart(id: string, qty: number) {
    return this.http.put(`${this.baseUrl}/cart/${id}`, { qty });
  }

  // COUNT CART
  getCartCount(uid: string) {
    return this.http.get<any>(`${this.baseUrl}/cart/count/${uid}`);
  }

  // PLACE ORDER
  placeOrder(data: any) {
    return this.http.post(`${this.baseUrl}/place-order`, data);
  }

  // UPDATE USER PROFILE
  updateUser(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/users/${id}`, data);
  }

  // CHANGE PASSWORD
  changePassword(data: any) {
    return this.http.post(`${this.baseUrl}/change-password`, data);
  }

  // GET SINGLE ORDER
  getOrderById(id: string) {
    return this.http.get(`${this.baseUrl}/order/${id}`);
  }

}