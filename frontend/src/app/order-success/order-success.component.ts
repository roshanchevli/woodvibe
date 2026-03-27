import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent implements OnInit, OnDestroy {
  orderId: string = '';
  countdown: number = 10;
  timer: any;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.countdown--;
      this.cdr.detectChanges(); // Force update if zone isn't capturing
      if (this.countdown === 0) {
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
