import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { SavedAddressService } from '../../../services/saved-address.service';
import { OrderService } from '../../../services/order.service';
import { OrderItem } from '../../../model/order-item.model';
import { Payment } from '../../../model/payment.model';
import { ShippingAddress } from '../../../model/shipping-address.model';
import Swal from 'sweetalert2';
import { SendOrderinfoEmailComponent } from './send-orderinfo-email/send-orderinfo-email.component';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  @ViewChild(SendOrderinfoEmailComponent) sendOrderinfoEmailComponent!: SendOrderinfoEmailComponent;

  private id: any;
  user: any;
  cartItems: any;
  fetchedData: any;
  selectedAddress: any;
  addressForm = false;
  paymentData: any;
  isAddressSelected = false;
  cartId: any;

  orders: any = {};
  orderItems: OrderItem = {
    price: 0,
    quantity: 0,
    order: {},
    product: {}
  };
  shippingAddress: ShippingAddress = {
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    order: {},
    state: '',
    zipCode: ''
  };
  payment: Payment = {
    amount: 0,
    paymentMethod: '',
    paymentStatus: '',
    order: {}
  };
  receivedOrders: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _loginService: LoginService,
    private _productService: ProductService,
    private _cartService: CartService,
    private _savedAddress: SavedAddressService,
    private _orderService: OrderService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this._loginService.getCurrentUser().subscribe((userdata) => {
      this.user = userdata;
      if (userdata.userRole !== 'USER') {
        this._loginService.logout();
      }
    });

    if (this.id.substr(0, 1) === 's') {
      this._cartService.getCartItems(this.id.substr(1)).subscribe((data) => {
        if (data == null) {
          this.router.navigate(['/error']);
        }
        this.cartItems = data;
        this.cartId = this.cartItems[0].cart.id;
        this.fetchedData = this.cartItems;
      }, (error) => {
        this.router.navigate(['/error']);
        console.log(error);
      });
    }

    this._savedAddress.selectedAddress$.subscribe((address) => {
      this.selectedAddress = address;
      this.shippingAddress = this.selectedAddress;
    });
  }

  ngAfterViewInit() {
    // The ViewChild is available now
  }

  openAddressForm() {
    this.addressForm = true;
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total: number, item: { product: { price: number }; quantity: number }) => total + (item.product.price * item.quantity), 0);
  }

  async handlePaymentData(data: any) {
    this.paymentData = data;
    try {
      for (let i = 0; i < this.cartItems.length; i++) {
        let user = this.user;
        let totalAmount = (this.cartItems[i].product.price - (this.cartItems[i].product.price * (this.cartItems[i].product.discount / 100))) * this.cartItems[i].quantity;
        let status = 'PENDING';

        this.orders = {
          user: user,
          totalAmount: totalAmount,
          status: status
        };

        let receivedOrder: any = await this._orderService.saveOrder(this.orders).toPromise();

        this.shippingAddress.order = receivedOrder;
        await this._orderService.saveShippingAddress(this.shippingAddress).toPromise();

        this.orderItems = {
          order: receivedOrder,
          product: this.fetchedData[i].product,
          price: this.fetchedData[i].product.price - (this.fetchedData[i].product.price * (this.fetchedData[i].product.discount / 100)),
          quantity: this.fetchedData[i].quantity
        };

        this.payment = {
          order: receivedOrder,
          amount: receivedOrder.totalAmount,
          paymentStatus: 'COMPLETED',
          paymentMethod: this.paymentData.method
        };

        await this._orderService.saveOrderItems(this.orderItems).toPromise();
        await this._orderService.savePayment(this.payment).toPromise();
        await this._cartService.deleteCartItem(this.cartId).toPromise();

        this.receivedOrders.push(receivedOrder);
      }
      this.getHtml()

      this._snackBar.open("Order successfully placed.","close",{duration:3000})
      this.router.navigate(['/']);

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'There was an error placing your orders. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  getTotalDiscount(): number {
    return this.cartItems.reduce((total: number, item: { product: { price: number; discount: number }; quantity: number }) => {
      const originalPrice = item.product.price;
      const discountedPrice = originalPrice - (originalPrice * (item.product.discount / 100));
      const discountPerItem = originalPrice - discountedPrice;
      return total + (discountPerItem * item.quantity);
    }, 0);
  }

  getHtml() {
    if (this.sendOrderinfoEmailComponent) {
      this.sendOrderinfoEmailComponent.sendOrderEmail();
    }
  }
}
