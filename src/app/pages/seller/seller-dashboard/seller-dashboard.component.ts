import {Component, AfterViewInit, OnInit} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {SellerService} from "../../../services/seller.service";

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements AfterViewInit, OnInit {
  user: any;
  orderItems: any;
  private salesChart: Chart | null = null;
  totalSale:number = 0;
  pendingShipment: number = 0;
  // Properties to hold sales data
  janSale: number = 0;
  febSale: number = 0;
  marSale: number = 0;
  aprSale: number = 0;
  maySale: number = 0;
  junSale: number = 0;
  julSale: number = 0;
  augSale: number = 0;
  sepSale: number = 0;
  octSale: number = 0;
  novSale: number = 0;
  decSale: number = 0;

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _orderService: OrderService,
              private _sellerService: SellerService,
  ) {
    // Register all necessary components, including scales
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this._loginService.getCurrentUser().subscribe((data: any) => {
        this.user = data;
        this.loadAllOrderItem(this.user.id);
      },
      error => {
        console.log(error);
        this._loginService.logout()
      })


  }

  ngAfterViewInit(): void {
    this.initializeSalesChart();
  }

  loadAllOrderItem(id: any) {
    this._sellerService.getAllOrderBySeller(id).subscribe((data: any) => {
      console.log(data);
      this.orderItems = data;


      const salesMap = new Map<string, number>([
        ['January', 0], ['February', 0], ['March', 0], ['April', 0],
        ['May', 0], ['June', 0], ['July', 0], ['August', 0],
        ['September', 0], ['October', 0], ['November', 0], ['December', 0]
      ]);

      this.orderItems.forEach((item: any) => {
        if (item.order.status !== 'CANCELLED') {
          this.totalSale = this.totalSale + item.order.totalAmount;
          const date = new Date(item.createdAt);
          const options: Intl.DateTimeFormatOptions = {month: 'long'};
          const monthName = date.toLocaleDateString('en-US', options);

          if (salesMap.has(monthName)) {
            salesMap.set(monthName, salesMap.get(monthName)! + item.order.totalAmount);
          }
        }

        if(item.order.status == 'PENDING')
        {
          this.pendingShipment++;
        }
      });

      this.janSale = salesMap.get('January') || 0;
      this.febSale = salesMap.get('February') || 0;
      this.marSale = salesMap.get('March') || 0;
      this.aprSale = salesMap.get('April') || 0;
      this.maySale = salesMap.get('May') || 0;
      this.junSale = salesMap.get('June') || 0;
      this.julSale = salesMap.get('July') || 0;
      this.augSale = salesMap.get('August') || 0;
      this.sepSale = salesMap.get('September') || 0;
      this.octSale = salesMap.get('October') || 0;
      this.novSale = salesMap.get('November') || 0;
      this.decSale = salesMap.get('December') || 0;

      // Initialize or update chart
      this.initializeSalesChart();
    });
  }

  initializeSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;

    // Destroy existing chart if it exists
    if (this.salesChart) {
      this.salesChart.destroy();
    }

    const salesData = [
      this.janSale,
      this.febSale,
      this.marSale,
      this.aprSale,
      this.maySale,
      this.junSale,
      this.julSale,
      this.augSale,
      this.sepSale,
      this.octSale,
      this.novSale,
      this.decSale
    ];

    this.salesChart = new Chart(ctx, {
      type: 'line', // You can change this to 'bar', 'pie', etc.
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Sales',
          data: salesData, // Use the sales data from class properties
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category', // Category scale for the x-axis
          },
          y: {
            beginAtZero: true // Linear scale for the y-axis with beginAtZero
          }
        }
      }
    });
  }
}
