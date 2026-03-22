import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  totalProducts: number = 0;
  totalCategories: number = 0;
  totalOrders: number = 0;
  totalUsers: number = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  ngAfterViewInit(): void {
    // Initial static chart setup with fallback data
    setTimeout(() => {
      this.initCharts();
    }, 1000);
  }

  ordersData: any[] = [];
  productsData: any[] = [];

  fetchStats(): void {
    this.http.get<any[]>('http://localhost:3000/api/product').subscribe({
      next: (res) => {
        this.totalProducts = res.length;
        this.productsData = res;
        this.updateCategoryChart(res);
        this.cdr.detectChanges();
      },
    });

    this.http.get<any[]>('http://localhost:3000/api/category').subscribe({
      next: (res) => {
        this.totalCategories = res.length;
        this.cdr.detectChanges();
      },
    });

    this.http.get<any[]>('http://localhost:3000/api/admin/orders').subscribe({
      next: (res) => {
        this.totalOrders = res.length;
        this.ordersData = res;
        this.updateSalesChart(res);
        this.cdr.detectChanges();
      },
    });

    this.http.get<any[]>('http://localhost:3000/api/users').subscribe({
      next: (res) => {
        this.totalUsers = res.length;
        this.cdr.detectChanges();
      },
    });
  }

  salesChartInstance: any;
  categoryChartInstance: any;

  initCharts(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (ctx) {
      this.salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Orders',
            data: [12, 19, 3, 5, 2, 3, 7], // Seed data
            fill: true,
            borderColor: '#c29d6d',
            backgroundColor: 'rgba(194, 157, 109, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#c29d6d',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(0,0,0,0.03)' }, border: { display: false } },
            x: { grid: { display: false }, border: { display: false } }
          }
        }
      });
    }

    const ctx2 = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (ctx2) {
      this.categoryChartInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Chairs', 'Tables', 'Beds', 'Others'],
          datasets: [{
            data: [1, 1, 1, 1], // Seed data
            backgroundColor: ['#c29d6d', '#2d2417', '#7a6b57', '#e5e5e5'],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { usePointStyle: true, padding: 20, font: { family: 'Outfit', size: 12 } }
            }
          },
          cutout: '70%'
        }
      });
    }

    // Since initCharts is delayed via setTimeout, check if we already got data from API and apply it!
    if (this.ordersData.length > 0) {
      this.updateSalesChart(this.ordersData);
    }
    if (this.productsData.length > 0) {
      this.updateCategoryChart(this.productsData);
    }
  }

  updateSalesChart(orders: any[]): void {
    if (!this.salesChartInstance) return;
    
    // Array to hold counts for Jan-Dec (12 months)
    const monthlyCounts = new Array(12).fill(0);

    orders.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        const month = date.getMonth(); // 0 is Jan, 11 is Dec
        monthlyCounts[month]++;
      }
    });

    // Update the chart labels and data to represent all 12 months
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.salesChartInstance.data.labels = monthLabels;
    this.salesChartInstance.data.datasets[0].data = monthlyCounts;
    this.salesChartInstance.update();
  }

  updateCategoryChart(products: any[]): void {
    if (!this.categoryChartInstance) return;

    const counts: { [key: string]: number } = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    if (labels.length > 0) {
      this.categoryChartInstance.data.labels = labels;
      this.categoryChartInstance.data.datasets[0].data = data;
      this.categoryChartInstance.update();
    }
  }
}
