import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../services/login.service";
import {SellerService} from "../../../services/seller.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-seller-order',
  templateUrl: './seller-order.component.html',
  styleUrl: './seller-order.component.css'
})
export class SellerOrderComponent implements OnInit{
  orders: any[] = [];
  filteredOrders: any[] = [];
  user: any;
  statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  selectedStatus: string = '';
  p: any = 1;

  constructor(private _loginService: LoginService,
              private _sellerService: SellerService,
              private _route: ActivatedRoute,) { }

  ngOnInit(): void {
    this._loginService.getCurrentUser().subscribe((userdata) => {
      this.user = userdata;
      if (this.user.userRole !== 'SELLER') {
        this._loginService.logout();
        return;
      }

      // Get query parameter 'status'
      this._route.queryParams.subscribe(params => {
        this.selectedStatus = params['status'] || '';
        this.filterOrders();  // Apply filter based on the selected status
      });

      this._sellerService.getAllOrderBySeller(this.user.id).subscribe((ordersData: any) => {
        console.log(ordersData);
        this.orders = ordersData;
        this.filteredOrders = ordersData;  // Initialize filteredOrders with all orders

        // Apply filter after orders are loaded
        if (this.selectedStatus) {
          this.filterOrders();
        }
      });
    });

  }

  filterOrders(): void {
    // Filter orders based on selected status
    if (this.selectedStatus) {
      this.filteredOrders = this.orders.filter(order => order.order.status === this.selectedStatus);
    } else {
      this.filteredOrders = this.orders;  // Show all orders if no status is selected
    }

    // Ensure `createdAt` field is in a proper format and sort
    this.filteredOrders.sort((a, b) => {
      const dateA = new Date(a.order.createdAt).getTime();
      const dateB = new Date(b.order.createdAt).getTime();
      return dateB - dateA; // Recent first
    });
  }


  onPageChange(pageNumber: number): void {
    this.p = pageNumber;
    this.scrollToTop();
  }
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}


