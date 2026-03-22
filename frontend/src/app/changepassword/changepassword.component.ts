import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangePasswordComponent implements OnInit {

  userId: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    public router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData && userData.id) {
      this.userId = userData.id;
    } else {
      this.router.navigate(['/login']);
    }
  }

  updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        title: 'Mismatch!',
        text: 'New password and confirm password do not match.',
        icon: 'warning',
        confirmButtonColor: '#8a6d46'
      });
      return;
    }

    if (this.newPassword.length < 6) {
      Swal.fire({
        title: 'Too Short!',
        text: 'Password must be at least 6 characters long.',
        icon: 'warning',
        confirmButtonColor: '#8a6d46'
      });
      return;
    }

    const data = {
      userId: this.userId,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.api.changePassword(data).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          confirmButtonColor: '#8a6d46'
        });
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err.error?.message || 'Failed to change password',
          icon: 'error',
          confirmButtonColor: '#8a6d46'
        });
      }
    });
  }
}
