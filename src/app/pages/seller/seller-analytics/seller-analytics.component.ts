import {AfterViewInit, Component, OnInit} from '@angular/core';
import {
  Chart,
  PieController,
  ArcElement,
  Legend,
  Tooltip,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {SellerService} from "../../../services/seller.service";
import {CategoryService} from "../../../services/category.service";

@Component({
  selector: 'app-seller-analytics',
  templateUrl: './seller-analytics.component.html',
  styleUrls: ['./seller-analytics.component.css']
})
export class SellerAnalyticsComponent implements OnInit, AfterViewInit {
  user: any;
  orderItems: any;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _orderService: OrderService,
    private _sellerService: SellerService,
    private _categoryService: CategoryService,
  ) {
  }

  ngOnInit(): void {
    this._loginService.getCurrentUser().subscribe((data: any) => {
      this.user = data;
      this.loadAllOrderItems();
    });
  }

  async loadAllOrderItems() {
    this._sellerService.getAllOrderBySeller(this.user.id).subscribe((data: any) => {
      this.orderItems = data;

      for (let i = 0; i < this.orderItems.length; i++) {
        if (typeof this.orderItems[i].product.categories[0] == 'number') {
          const id: number = this.orderItems[i].product.categories[0];
          this._categoryService.getCategoryById(id).subscribe((cat: any) => {
            this.orderItems[i].product.categories = {};
            this.orderItems[i].product.categories = cat;
          })
        }
      }

      this.ngAfterViewInit(); // Call to initialize charts after data is loaded
    });
  }

  ngAfterViewInit(): void {
    // Register chart types
    Chart.register(PieController, ArcElement, Legend, Tooltip, BarController, CategoryScale, LinearScale, BarElement);

    this.renderCategorySalesChart();
    this.renderOrderStatusChart();
    this.renderSalesReturnsChart();
    this.renderTopSellingProductsChart();
  }

  extractCategorySalesData() {
    const categorySales = this.orderItems.reduce((acc: any, item: any) => {
      const category = item.product.categories[0];
      if (category && category.name) {
        const categoryName = category.name; // Safely access category name
        acc[categoryName] = (acc[categoryName] || 0) + item.price * item.quantity;
      }
      return acc;
    }, {});

    // Filter out categories with zero sales
    const filteredCategorySales = Object.keys(categorySales)
      .filter((key) => categorySales[key] > 0)
      .reduce((obj: any, key: any) => {
        obj[key] = categorySales[key];
        return obj;
      }, {});

    return {
      labels: Object.keys(filteredCategorySales),
      data: Object.values(filteredCategorySales)
    };
  }


  extractOrderStatusData() {
    const statusCounts = this.orderItems.reduce((acc: any, item: any) => {
      const status = item.order.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      data: Object.values(statusCounts)
    };
  }

  extractSalesReturnsData() {
    const totalSales = this.orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const totalReturns = this.orderItems.filter((item: any) => item.status === 'RETURNED').reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    return {
      labels: ['Sales', 'Returns'],
      data: [totalSales, totalReturns]
    };
  }

  extractTopSellingProductsData() {
    const productSales = this.orderItems.reduce((acc: any, item: any) => {
      const productName = item.product.name;
      acc[productName] = (acc[productName] || 0) + item.price * item.quantity;
      return acc;
    }, {});

    const sortedProducts = Object.entries(productSales)
      .sort(([, a]:any, [, b]:any) => b - a) // Sort by sales descending
      .slice(0, 5); // Keep only the top 5

    const fullNames = sortedProducts.map(([name]) => name); // Full names for tooltip
    const labels = fullNames.map((name) => this.truncateProductName(name)); // Truncated names for display
    const data = sortedProducts.map(([, sales]) => sales); // Sales data

    return { labels, data, fullNames };
  }
  truncateProductName(name: string): string {
    const words = name.split(' ');
    // Get first 2 or 3 words
    return words.length > 3 ? words.slice(0, 3).join(' ') + '...' : name;
  }


  renderCategorySalesChart() {
    const {labels, data} = this.extractCategorySalesData();
    const ctx = document.getElementById('categorySalesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  renderOrderStatusChart() {
    const {labels, data} = this.extractOrderStatusData();
    const ctx = document.getElementById('orderStatusChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#20c997']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  renderSalesReturnsChart() {
    const {labels, data} = this.extractSalesReturnsData();
    const ctx = document.getElementById('salesReturnsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#4BC0C0', '#FF6384']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  renderTopSellingProductsChart() {
    const { labels, data, fullNames } = this.extractTopSellingProductsData();

    const ctx = document.getElementById('topSellingProductsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // Truncated labels
        datasets: [{
          label: 'Sales',
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => {
                // Show full product name in tooltip
                return fullNames[tooltipItem.dataIndex] + ': ' + tooltipItem.raw;
              }
            }
          }
        }
      }
    });
  }

}
