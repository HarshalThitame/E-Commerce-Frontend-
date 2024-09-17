import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

import {ProductService} from '../../services/product.service';
import {LoginService} from '../../services/login.service';
import {CartService} from '../../services/cart.service';
import {Cart} from '../../model/cart.model';
import {CartItem} from '../../model/cart-item.model';
import {WishlistService} from "../../services/wishlist.service";
import {Product} from "../../model/products.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ImageDialogComponent} from "./image-dialog/image-dialog.component";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  user: any = {id: undefined};
  id: any;
  product: any;
  cart: {} = {};
  isProductAvailable: any = {exists: false};
  CartDetail: any = {};
  selectedImageUrl: string | undefined;
  productImages: any[] = [];
  stars: any = 5;
  reviewForm: FormGroup | any;
  ratingAndReview: any = {};
  hasSubmittedReview: boolean = false;
  userRatingAndReview: any;
  selectedRating: number = 0;
  isEditing: boolean = false; // To track if editing mode is active
  reviewToEdit: any = null; // To store the review being edited
  wishlistId: any;
  private wishlist: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private loginService: LoginService,
    private cartService: CartService,
    private fb: FormBuilder,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.reviewForm = this.fb.group({
      review: ['', Validators.required],
      rating: [0, Validators.required],
    });

    this.loginService.getCurrentUser().subscribe(userdata => {
      this.user = userdata;
      this.loadWishlistByUser(this.user.id)
      this.loadUserRatingAndReviews(this.user.id);
      if (userdata.userRole === 'USER') {
        this.cartService.getCartByUser(userdata.id).subscribe((c: any) => {
          this.cart = c;
        });
      } else if (userdata.userRole === 'SELLER') {
        this.cartService.getCartByUser(userdata.id).subscribe((c: any) => {
          this.cart = c;
        });
      } else {
        this.loginService.logout();
      }
    });

    this.productService.getProductById(this.id).subscribe(productData => {
      this.product = productData;
      this.productImages = this.product.images;

      if (this.productImages.length === 0) {
        this.selectedImageUrl = 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg';
      } else {
        this.selectedImageUrl = 'https://harshal-ecom.s3.eu-north-1.amazonaws.com/images/' + this.productImages[0].url;
      }

      this.cartService.checkProductAvailability(this.product.id).subscribe(isAvailable => {
        this.isProductAvailable = isAvailable;
      });
      this.wishlistService.isProductInWishlistCheck(this.wishlistId,this.product.id).subscribe((isInWishlist:any) => {
        this.product.isInWishlist = isInWishlist;
      })
    });

    this.productService.getProductRatingsAndReviews(this.id).subscribe(ratingandReviewData => {
      this.ratingAndReview = ratingandReviewData;
      let sumOfRatings = 0;
      for (let r of this.ratingAndReview) {
        sumOfRatings = sumOfRatings + r.rating;
      }
      this.ratingAndReview.averageRating = sumOfRatings / this.ratingAndReview.length;
      this.hasSubmittedReview = this.ratingAndReview.some((review: any) => review.user.id === this.user.id);
    });
  }

  private loadWishlistByUser(id: any) {
    this.wishlistService.getWishlistByUser(id).subscribe((wishlist: any) => {
      this.wishlistId = wishlist.id;
    })
  }
  loadUserRatingAndReviews(id: any) {
    this.productService.getUserRatingsAndReviews(id).subscribe(ratingandReviewData => {
      this.userRatingAndReview = ratingandReviewData;
      if (this.userRatingAndReview && this.userRatingAndReview.length > 0) {
        const userReview = this.userRatingAndReview.find((review: any) => review.user.id === this.user.id);
        if (userReview) {
          this.reviewForm.patchValue({
            review: userReview.review,
            rating: userReview.rating
          });
          this.selectedRating = userReview.rating;
        }
      }
    });
  }

  editReview(review: any) {
    this.isEditing = true;
    this.reviewToEdit = review;
    this.reviewForm.patchValue({
      review: review.review,
      rating: review.rating
    });
    this.selectedRating = review.rating;
  }

  cancelEdit() {
    this.isEditing = false;
    this.reviewForm.reset();
    this.selectedRating = 0; // Reset to default value
  }

  submitReview() {
    if (this.reviewForm.valid) {
      let newReview = {
        id: this.isEditing ? this.reviewToEdit.id : null,
        user: {id: this.user.id},
        product: {id: this.id},
        rating: this.selectedRating,
        review: this.reviewForm.value.review,
        createdAt: this.isEditing ? this.reviewToEdit.createdAt : null,
      };

      if (this.isEditing) {
        this.productService.updateReview(newReview).subscribe(response => {
          Swal.fire('Success', 'Your review has been updated.', 'success');
          this.cancelEdit(); // Exit edit mode
          this.ngOnInit(); // Reload the component to reflect the changes
        }, error => {
          Swal.fire('Error', 'An error occurred while updating your review.', 'error');
        });
      } else {
        this.productService.submitReview(newReview).subscribe(response => {
          Swal.fire('Success', 'Your review has been submitted.', 'success');
          this.ngOnInit(); // Reload the component to reflect the changes
        }, error => {
          Swal.fire('Error', 'An error occurred while submitting your review.', 'error');
        });
      }
    }
  }

  onImageHover(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  addToCart(): void {
    this.CartDetail.cart = this.cart;
    this.CartDetail.product = this.product;
    this.CartDetail.quantity = 1;

    this.cartService.addToCart(this.CartDetail).subscribe(data => {
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart',
        text: `${this.CartDetail.product.name} has been added to your cart.`,
        confirmButtonText: 'Continue Shopping'
      }).then(result => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }, error => {
      console.error(error);
    });
  }

  deleteReview(id: any) {
    this.productService.deleteReview(id).subscribe(response => {
      // this.ratingAndReview = this.ratingAndReview.filter((review: { id: any; }) => review.id !== id);
      this.ngOnInit();
    }, error => {
      console.log(error);
    });
  }

  onStarClick(rating: number): void {
    this.selectedRating = rating;
  }

  getStar() {
    return [1, 2, 3, 4, 5];
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(1);
  }

  getHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5; // Check if there is a half star
  }

  async toggleWishlist(): Promise<void> {
    if(this.product.isInWishlist){
      this.removeFromWishlist(this.product.id);
      this.product.isInWishlist = false;
    }else{
      this.addToWishlist(this.product);
      this.product.isInWishlist = true;
    }
  }

  private addToWishlist(product: Product): void {
    const p = {
      product: {
        id: product.id,
      }
    };
    this.wishlistService.addToWishlist(this.wishlistId, p).subscribe(
      () => {
        this.wishlist.add(product.id);
        this.snackBar.open(`${product.name} added to your wishlist.`, 'Continue Shopping', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
      },
      error => {
        console.error(error);
        this.snackBar.open('There was an error adding the product to your wishlist. Please try again.', 'Try Again', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    );
  }

  private removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlistByProductId(this.wishlistId, productId).subscribe(
      (data) => {
        this.wishlist.delete(productId);
        this.snackBar.open('Product removed from your wishlist.', 'Continue Shopping', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
      },
      error => {
        console.error(error);
        this.snackBar.open('There was an error removing the product from your wishlist. Please try again.', 'Try Again', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    );
  }

  openImageDialog(): void {
    const currentIndex = this.productImages.findIndex(image =>
      'https://harshal-ecom.s3.eu-north-1.amazonaws.com/images/' + image.url === this.selectedImageUrl
    );

    this.dialog.open(ImageDialogComponent, {
      data: {
        images: this.productImages.map(img => 'https://harshal-ecom.s3.eu-north-1.amazonaws.com/images/' + img.url), // Send all image URLs
        currentIndex: currentIndex
      },
      maxWidth: '1800px',
      maxHeight: '900px'
    });
  }

}
