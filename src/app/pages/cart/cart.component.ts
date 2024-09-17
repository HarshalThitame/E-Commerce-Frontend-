import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {CartService} from "../../services/cart.service";
import Swal from 'sweetalert2';
import {NgxUiLoaderService} from "ngx-ui-loader";

interface Product {
  id: number;
  name: string;
  price: number;
  stockQuantity:number;
  imageUrl: string;
}

interface CartItem {
  id:number;
  product: Product;
  quantity: number;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  id:any;
  user:any;
cartItems:any;
  constructor(private router:Router,
              private _loginService:LoginService,
              private route:ActivatedRoute,
              private _cartService:CartService,
              private ngxLoader: NgxUiLoaderService)  {
  }

    ngOnInit(): void {
      this.id = this.route.snapshot.paramMap.get('id');

      this._loginService.getCurrentUser().subscribe((data) => {
        this.user = data;
        if(data.userRole == "USER") {

        }
        else {
          this._loginService.logout();
        }
      })

    this._cartService.getCartItems(this.id).subscribe((data)=>{
      console.log(data);
      if(data == null) {
        this.cartItems = null
      }
      else
      {
        this.cartItems = data
      }
      this.cartItems= data;
    },(error=>{
      console.log(error);
    }))
    }


  getTotalPrice(): number {
    return this.cartItems.reduce((total: number, item: { product: { price: number; }; quantity: number; }) => total + (item.product.price * item.quantity), 0);
  }
  getTotalDiscount(): number {
    return this.cartItems.reduce((total: number, item: { product: { price: any; discount: number; }; quantity: number; }) => {
      const originalPrice = item.product.price;
      const discountedPrice = originalPrice - (originalPrice * (item.product.discount / 100));
      const discountPerItem = originalPrice - discountedPrice;
      return total + (discountPerItem * item.quantity);
    }, 0);
  }


  increaseQuantity(item: any): void {

    const inStock = item.product.stockQuantity
    console.log(inStock)
    console.log(item.quantity)

    if(inStock >= item.quantity+2) {
    this._cartService.increaseQuantity(item.id).subscribe((response) => {
      if (response.stockQuantity >= item.quantity + 1) {
        item.quantity++;
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

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this._cartService.decreaseQuantity(item.id).subscribe(() => {
        item.quantity--;
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

  checkout(): void {
    this._cartService.checkout(this.cartItems).subscribe(() => {

        this.router.navigate(['/user/order/order-details/','s'+this.user.id])

    });
  }

}
