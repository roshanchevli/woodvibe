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

  // NAVBAR HOVER EFFECT CATEGORY
  getProductsByCategory(category: string) {
    return this.http.get<any>('http://localhost:3000/products/category/' + category);
  }

  // NAVBAR HOVER EFFECT PRODUCT
  getProductById(id: string) {
    return this.http.get<any>('http://localhost:3000/products/' + id);
  }

  // GET ALL USERS 
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + "/users");
  }

  // UPDATE USER STATUS 
  updateUserStatus(id: string, status: string): Observable<any> {
    return this.http.put(this.baseUrl + "/users/" + id + "/status", { status });
  }

  // GET ALL ORDERS ADMIN SIDE
  getAllOrders(){
    return this.http.get<any[]>("http://localhost:3000/api/admin/orders");
}

// GET ORDER DETAILS 
getOrderById(id:any){
return this.http.get<any>("http://localhost:3000/api/admin/order/"+id);
}

// UPDATE ORDER STATUS
updateOrderStatus(id: string, status: string): Observable<any> {
return this.http.put("http://localhost:3000/api/admin/order/" + id + "/status", { status });
}

}
