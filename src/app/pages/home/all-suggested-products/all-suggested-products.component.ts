import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../services/product.service";
import {Router} from "@angular/router";
import {LoginService} from "../../../services/login.service";
import {Product} from "../../../model/products.model";
import Swal from "sweetalert2";
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'app-all-suggested-products',
  templateUrl: './all-suggested-products.component.html',
  styleUrl: './all-suggested-products.component.css'
})
export class AllSuggestedProductsComponent implements OnInit {
    user: any;
  products: any;
  CartDetail: any;
  cart: any;

  constructor(private _productService: ProductService,
              private _router: Router,
              private loginService: LoginService,
              private _cartService: CartService,) {
  }
    ngOnInit(): void {

    this.loginService.getCurrentUser().subscribe((data: any) => {
      this.user = data;
      this.loadAllProducts();
    },
      error => {
      this.loginService.logout()
      })
    }

  private loadAllProducts() {
    this._productService.getAllProducts().subscribe(data => {
      this.products = data;
    })
  }

  addToCart(product: Product) {
    let isAvailable: any = {
      itemId: 0,
      exists: false,
    };

    // Check if the product is already in the cart
    this._cartService.checkProductAvailability(product.id.toString()).subscribe(
      (data) => {
        isAvailable = data;
        console.log(isAvailable);

        if (isAvailable.exists) {
          // If the product already exists in the cart
          Swal.fire({
            icon: 'info',
            title: 'Already in Cart',
            text: `${product.name} is already in your cart.`,
            confirmButtonText: 'Go to Cart'
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/user/',this.user.id]); // Navigate to the cart page
            }
          });
        } else {
          // If the product does not exist in the cart, proceed with adding it
          this.CartDetail.cart = this.cart;
          this.CartDetail.product = product;
          this.CartDetail.quantity = 1;

          this._cartService.addToCart(this.CartDetail).subscribe(
            (data: any) => {
              console.log(data);
              Swal.fire({
                icon: 'success',
                title: 'Added to Cart',
                text: `${this.CartDetail.product.name} has been added to your cart.`,
                confirmButtonText: 'Continue Shopping'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Optionally, navigate to another page or keep the user on the current page
                }
              });
            },
            (error: any) => {
              console.log(error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error adding the product to your cart.',
                confirmButtonText: 'Try Again'
              });
            }
          );
        }
      },
      (error: any) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error checking product availability.',
          confirmButtonText: 'Try Again'
        });
      }
    );
  }
}

