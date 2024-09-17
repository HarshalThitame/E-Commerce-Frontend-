import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../../../services/login.service";
import {OrderService} from "../../../services/order.service";
import {CartService} from "../../../services/cart.service";
import {ProductService} from "../../../services/product.service";
import Swal from "sweetalert2";
import {Product} from "../../../model/products.model";
import {PaginationService} from "../../../services/pagination.service";

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent implements OnInit {
  user: any;
  userId: any;
  orders: any;
  orderItems: any;
  isCancelled: boolean = false;
  private cart: any;
  CartDetail:any={}
  p: string | number = 1;


  constructor(private _router: Router,
              private _loginService: LoginService,
              private _orderService: OrderService,
              private _cartService: CartService,
              private _productService: ProductService,
              protected _paginationService: PaginationService) {
  }

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleKeyboardEvents.bind(this));

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    this._loginService.getCurrentUser().subscribe((userdata) => {
      this.user = userdata;
      this._orderService.getAllOrdersByUser(userdata.id).subscribe((data) => {
        this.orders = data;
        // console.log(this.orders);
      }, error => {
        console.log(error)
      })
      this._orderService.getAllOrdersItemsByUser(userdata.id).subscribe((data) => {
        console.log(data);
        this.orderItems = data;
        this.orderItems.reverse();
        for (let i = 0; i < this.orderItems.length; i++) {
          this._productService.getIamgesByProductID(this.orderItems[i].product.id).subscribe((data) => {
            this.orderItems[i].product.images = data;
          })
        }
        this.p = this._paginationService.getCurrentPage() || 1;
      })
      if (userdata.userRole == "USER") {
      } else {
        this._loginService.logout();
      }
      this._cartService.getCartByUser(this.user.id).subscribe((c: any) => {
        this.cart = c;

      })
    });


  }

  cancelOrder(item: any) {
    console.log(item)
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the cancellation logic
        item.order.status = 'CANCELLED'
        this._orderService.updateOrder(item.order).subscribe(data => {
          item.product.stockQuantity = item.product.stockQuantity + item.quantity;
          this._productService.updateProduct(item.product.id,item.product).subscribe((p) => {
              // console.log(p)
            },
            error => {
              console.log(error)
            })
          console.log(data);
        }, error => {
          console.log(error)
        })
        Swal.fire(
          'Cancelled!',
          'Your order has been cancelled.',
          'success'
        );
      } else {
        Swal.fire(
          'Cancellation Declined',
          'Your order is safe :)',
          'info'
        );
      }
    });
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
  returnableDate(item:any): any {
    const returnableDate = new Date(item.updatedAt);
    returnableDate.setDate(returnableDate.getDate() + 7);
    return returnableDate;
  }

  returnOrder(item: any) {

  }
  onPageChange(pageNumber: number): void {
    this.p = pageNumber;
    this._paginationService.setCurrentPage(this.p); // Save page number
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  // Method to handle keyboard events
  handleKeyboardEvents(event: KeyboardEvent): void {
    const key = event.key;

    // Check if the pressed key is a number between '1' and '9'
    if (key >= '1' && key <= '9') {
      const pageNumber = parseInt(key);
      if (pageNumber <= Math.ceil(this.orderItems.length / 10)) {
        this.onPageChange(pageNumber);
      }
    }
  }
}
