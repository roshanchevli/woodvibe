import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private api = 'http://localhost:3000/api/category';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.api).pipe(
      retry(2),        // retry if backend slow
      shareReplay(1)   // cache response
    );
  }
}