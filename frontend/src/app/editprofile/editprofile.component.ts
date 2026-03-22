import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditProfileComponent implements OnInit {
  user: any = {
    fname: '',
    lname: '',
    email: '',
    contact: ''
  };

  constructor(
    public router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData && userData.id) {
      this.user = { ...userData };
    } else {
      this.router.navigate(['/login']);
    }
  }

  saveChanges() {
    // We assume there's an api.updateProfile method or we just simulate it for now
    // Actually, I should check api.service.ts
    this.api.updateUser(this.user.id, this.user).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', JSON.stringify(this.user));
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully',
          icon: 'success',
          confirmButtonColor: '#8a6d46'
        });
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err.error?.message || 'Failed to update profile',
          icon: 'error'
        });
      }
    });
  }
}
