import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = "http://localhost:3000/api";

  public cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  public wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.updateCounts();
  }

  updateCounts() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      this.http.get<any>(`${this.baseUrl}/cart/count/${user.id}`).subscribe({
        next: (res) => this.cartCountSubject.next(res.count || 0),
        error: () => {}
      });
      this.http.get<any>(`${this.baseUrl}/wishlist-count/${user.id}`).subscribe({
        next: (res) => this.wishlistCountSubject.next(res.count || 0),
        error: () => {}
      });
    } else {
      this.cartCountSubject.next(0);
      this.wishlistCountSubject.next(0);
    }
  }

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
    return this.http.post(`${this.baseUrl}/wishlist`, data).pipe(tap(() => this.updateCounts()));
  }

  // GET USER WISHLIST
  getWishlist(uid: string) {
    return this.http.get<any[]>(`${this.baseUrl}/wishlist/${uid}`);
  }

  // REMOVE WISHLIST
  removeWishlist(id: string) {
    return this.http.delete(`${this.baseUrl}/wishlist/${id}`).pipe(tap(() => this.updateCounts()));
  }

  // COUNT WISHLIST
  getWishlistCount(uid: string) {
    return this.http.get<any>(`${this.baseUrl}/wishlist-count/${uid}`);
  }

  // ADD TO CART
  addToCart(data: any) {
    return this.http.post(`${this.baseUrl}/cart`, data).pipe(tap(() => this.updateCounts()));
  }

  increaseCart(pid: string, uid: string) {
    return this.http.put(`${this.baseUrl}/cart/increase/${pid}/${uid}`, {}).pipe(tap(() => this.updateCounts()));
  }

  // GET USER CART
  getCart(uid: string) {
    return this.http.get<any[]>(`${this.baseUrl}/cart/${uid}`);
  }

  // REMOVE FROM THE CART
  removeCart(id: string) {
    return this.http.delete(`${this.baseUrl}/cart/${id}`).pipe(tap(() => this.updateCounts()));
  }

  // UPDATE CART
  updateCart(id: string, qty: number) {
    return this.http.put(`${this.baseUrl}/cart/${id}`, { qty }).pipe(tap(() => this.updateCounts()));
  }

  // COUNT CART
  getCartCount(uid: string) {
    return this.http.get<any>(`${this.baseUrl}/cart/count/${uid}`);
  }

  // PLACE ORDER
  placeOrder(data: any) {
    return this.http.post(`${this.baseUrl}/place-order`, data).pipe(tap(() => this.updateCounts()));
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