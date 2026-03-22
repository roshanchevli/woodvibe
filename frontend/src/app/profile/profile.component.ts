import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router) {}

  user:any = {};

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  logout(){
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

}