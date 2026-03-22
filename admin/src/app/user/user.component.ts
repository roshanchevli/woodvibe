import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: any[] = [];
  loading: boolean = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load users from database
  loadUsers() {
  this.loading = true;

  this.api.getUsers().subscribe({

    next: (userData: any[]) => {
      console.log("Users Data:", userData);   // 👈 check here
      this.users = userData;
              this.cdr.detectChanges();   // 🔥 FORCE VIEW UPDATE

      this.loading = false;

    },

    error: (err: any) => {
      console.error("Error fetching users:", err);
      this.loading = false;
    }

  });

}


  // Toggle active/inactive user
  toggleStatus(user: any) {

    const newStatus = user.status === "active" ? "inactive" : "active";

    this.api.updateUserStatus(user._id, newStatus).subscribe({

      next: () => {
        user.status = newStatus;
      },

      error: (err: any) => {
        console.error("Status update failed:", err);
      }

    });

  }

}