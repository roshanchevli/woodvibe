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
    return this.http.get<any>('http://localhost:3000/products/category/' + category);
  }

  getProductById(id: string) {
    return this.http.get<any>('http://localhost:3000/products/' + id);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + "/users");
  }

  updateUserStatus(id: string, status: string): Observable<any> {
    return this.http.put(this.baseUrl + "/users/" + id + "/status", { status });
  }

}
