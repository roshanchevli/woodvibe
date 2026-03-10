import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';
  
  // UI States
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(private router: Router) {}

  login() {
    this.errorMessage = '';
    
    // Basic Validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;

    signInWithEmailAndPassword(getAuth(), this.email, this.password)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        console.error('Login error:', err);
        this.errorMessage = this.formatFirebaseError(err.code);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private formatFirebaseError(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/too-many-requests':
        return 'Account temporarily locked due to too many failed attempts. Try again later.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }
}