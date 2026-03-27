import { Component, OnInit } from '@angular/core';

declare var AOS: any;
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  isLogin = true;

  constructor(private router: Router, private http: HttpClient, private api: ApiService) {}

  ngOnInit() {
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 100);
  }

  switchForm(type: string) {
    this.isLogin = type === 'login';
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 50);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  // ===== REGISTER =====
  registerUser(form: any) {

    if (form.invalid) return;

    const data = form.value;

    this.http.post('http://localhost:3000/api/register', data)
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          this.isLogin = true;
          form.resetForm();
        },
        error: (err) => {
          alert(err.error?.message || "Registration failed");
        }
      });
  }

  // ===== LOGIN =====
  loginUser(form: any) {

    if (form.invalid) return;

    const data = form.value;

    this.http.post('http://localhost:3000/api/login', data)
      .subscribe({
        next: (res: any) => {

          // Save user
          localStorage.setItem('user', JSON.stringify(res.user));

          // Reload cart and wishlist counts
          this.api.updateCounts();

          alert(res.message);

          // Redirect to home
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert(err.error?.message || "Login failed");
        }
      });
  }

}