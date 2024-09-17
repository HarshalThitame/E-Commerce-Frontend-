import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../model/products.model";
import Swal from "sweetalert2";
import {CartService} from "../../../services/cart.service";
import {LoginService} from "../../../services/login.service";

interface CartItem {
  id:number;
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit {
  @Input() orderData!: any;
  public cartItems: CartItem | any;
  user: any;

  constructor(private _cartService:CartService,
              private _loginService:LoginService,) {
  }

  ngOnInit(): void {
    this._loginService.getCurrentUser().subscribe((data:any)=>{
      this.user = data;
    })
    this.cartItems = this.orderData;
    console.log(this.cartItems)

  }



  increaseQuantity(item: any): void {

    const inStock = item.product.stockQuantity
    console.log(inStock)
    console.log(item.quantity)

    if(inStock >= item.quantity+2) {
      this._cartService.increaseQuantity(item.id).subscribe((response) => {
        if (response.stockQuantity >= item.quantity + 1) {
          item.quantity++;
          this.ngOnInit()
        }
      });}
    else {
      Swal.fire({
        icon: 'warning',
        title: 'Stock Limit Exceeded',
        text: 'The requested quantity exceeds available stock.',
        confirmButtonText: 'Okay'
      });
    }
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this._cartService.decreaseQuantity(item.id).subscribe(() => {
        item.quantity--;
        this.ngOnInit()
      });
    }
  }

  removeItem(item: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this item from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this._cartService.removeItem(item.id).subscribe(() => {
          this.cartItems = this.cartItems.filter((i: any) => i !== item);
          Swal.fire(
            'Removed!',
            'The item has been removed from your cart.',
            'success'
          );
        }, error => {
          Swal.fire(
            'Error!',
            'There was an issue removing the item.',
            'error'
          );
        });
      }
    });
  }

}
