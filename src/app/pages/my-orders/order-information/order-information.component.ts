import { Component, OnInit } from '@angular/core';
import { LoginService } from "../../../services/login.service";
import { OrderService } from "../../../services/order.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-order-information',
  templateUrl: './order-information.component.html',
  styleUrls: ['./order-information.component.css']
})
export class OrderInformationComponent implements OnInit {
  user: any;
  orderDetails: any = {
    product: {
      image: {},
      name: "",
      price: "",
      seller: {
        username: ""
      }
    },
    quantity: "",
    returnable: true,
    returnWindow: '',
    order: {
      id: "",
      status: ""
    },
    createdAt: ''
  }
  id: any;
  paymentDetails: any = {
    paymentMethod: "",
    amount: 0,
    paymentStatus: ""
  }
  shippingAddressDetails: any;
  currentStatus: number = 1; // Default to PENDING
  statusLabels: string[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  constructor(private _loginService: LoginService,
              private _orderService: OrderService,
              private _router: Router,
              private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');

    this._loginService.getCurrentUser().subscribe(userdata => {
      this.user = userdata;
      if (userdata.userRole === "USER") {
        // User-specific logic if needed
      } else {
        this._loginService.logout();
      }
    });

    this._orderService.getOrderItemById(this.id).subscribe(data => {
      this.orderDetails = data;
      this.currentStatus = this.getStatusNumber(this.orderDetails.order.status); // Update status dynamically

      this._orderService.getPaymentByOrderId(this.orderDetails.order.id).subscribe(paymentData => {
        this.paymentDetails = paymentData;
        console.log(this.paymentDetails);
      }, error => {
        console.log(error);
      });

      this._orderService.getShippingAddressByOrderId(this.orderDetails.order.id).subscribe(data => {
        this.shippingAddressDetails = data;
      });

      console.log(this.orderDetails);
    });
  }

  get returnableDate(): Date {
    const returnableDate = new Date(this.orderDetails.createdAt);
    returnableDate.setDate(returnableDate.getDate() + 7);
    return returnableDate;
  }

  getStatusNumber(status: string): number {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'CANCELLED':
        return 5;
      default:
        return 1; // Default to PENDING
    }
  }

  isCancelled(): boolean {
    return this.orderDetails.order.status === 'CANCELLED';
  }
}
