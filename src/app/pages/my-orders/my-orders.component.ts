import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {OrderService} from "../../services/order.service";
import {Order} from "../../model/Order.model";
import Swal from "sweetalert2";
import {Product} from "../../model/products.model";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent {

  selectedTab: string = 'wishlist';

  showOrders() {
    this.selectedTab = 'orders';
  }

  showWishlist() {
    this.selectedTab = 'wishlist';

  }


}

