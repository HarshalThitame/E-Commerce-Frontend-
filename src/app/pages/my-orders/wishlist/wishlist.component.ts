import {Component, OnInit} from '@angular/core';
import {Product} from "../../../model/products.model";
import Swal from "sweetalert2";
import {ProductService} from "../../../services/product.service";
import {Router} from "@angular/router";
import {CartService} from "../../../services/cart.service";
import {LoginService} from "../../../services/login.service";
import {WishlistService} from "../../../services/wishlist.service";
import {forkJoin, map, Observable} from "rxjs";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  p: number = 1;
  user: any;
  CartDetail:any={}
  cart: any;
  wishlistItems: any;

  constructor(private _productService: ProductService,
              private _router: Router,
              private _cartService: CartService,
              private _loginService: LoginService,
              private _wishlistService: WishlistService,) {
  }

  ngOnInit(): void {
    this._loginService.getCurrentUser().subscribe((data: any) => {
        this.user = data;
        this.loadWishlist(this.user.id);
        this._cartService.getCartByUser(this.user.id).subscribe((c: any) => {
          this.cart = c;

        })
      },
      error => {
        console.log(error);
        this._loginService.logout();
      })
  }

  // Your method to load wishlist items
  loadWishlist(id: any) {
    this._wishlistService.getWishlistByUser(id).subscribe((data: any) => {
        this.wishlistItems = data;
        console.log(this.wishlistItems);

        // Create an array of observables for fetching product images
        const imageRequests = this.wishlistItems.items.map((item: any) =>
          this.loadProductImages(item.product.id).pipe(
            map(images => ({ productId: item.product.id, images }))
          )
        );

        // Use forkJoin to wait for all image requests to complete
        forkJoin(imageRequests).subscribe((results:any) => {
            // Map results to wishlistItems
            results.forEach((result: any) => {
              const item = this.wishlistItems.items.find((i: any) => i.product.id === result.productId);
              if (item) {
                item.product.images = result.images; // Set images to the respective product
              }
            });

            console.log(this.wishlistItems);
          },
          error => {
            console.log(error);
          });
      },
      error => {
        console.log(error);
      });
  }

  loadProductImages(id: any): Observable<any> {
    return this._productService.getIamgesByProductID(id);
  }





  addToCart(item:any) {
   let product = item.product;
    let isAvailable: any = {
      itemId: 0,
      exists: false,
    };

    // Check if the product is already in the cart
    this._cartService.checkProductAvailability(product.id.toString()).subscribe((data) => {
        isAvailable = data;

        if (isAvailable.exists) {
          // If the product already exists in the cart
          Swal.fire({
            icon: 'info',
            title: 'Already in Cart',
            text: `${product.name} is already in your cart.`,
            confirmButtonText: 'Go to Cart'
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/user/', this.user.id]); // Navigate to the cart page
            }
          });
        } else {

          console.log(this.cart)
          // If the product does not exist in the cart, proceed with adding it
          this.CartDetail.cart = this.cart;
          this.CartDetail.product = product;
          this.CartDetail.quantity = 1;

          console.log(this.CartDetail.cart)

          this._cartService.addToCart(this.CartDetail).subscribe(
            (data) => {
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
            (error) => {
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
      (error) => {
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

  removeFromWishlist(item: any) {
  this._wishlistService.removeFromWishlist(item.id).subscribe(data=>{
    console.log(data)
    this.ngOnInit()
  },
    error => {
    console.log(error)
    })
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
