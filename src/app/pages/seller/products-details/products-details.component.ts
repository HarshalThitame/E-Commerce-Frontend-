import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ProductService } from "../../../services/product.service";
import { LoginService } from "../../../services/login.service";
import { Product } from "../../../model/products.model";
import { SellerService } from "../../../services/seller.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.css']
})
export class ProductsDetailsComponent implements OnInit {
  products: any;
  filteredProducts: any;
  private id: any;
  user: any;
  p: number = 1;
  itemPerPage: number = 16;
  isPublishable: boolean = false;
  searchControl = new FormControl(''); // Reactive form control for search
  searchTerm: any;
  filterNoImage: boolean = false; // New filter property

  categories: any = [];
  subCategories: any = [];
  subSubCategories: any = [];

  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private sellerService: SellerService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleKeyboardEvents.bind(this));

    this.loginService.getCurrentUser().subscribe(
      (data: any) => {
        if (data.userRole === "SELLER") {
          this.user = data;
          this.id = this.user.id;
          this.loadProducts(this.id);
          this.setupSearch();
          this.checkQueryParams(); // Check query parameters
        } else {
          this.loginService.logout();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  loadProducts(id: any): void {
    this.productService.getProductBySeller(id).subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
      this.applyFilters(); // Apply filters initially
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Wait for 300ms pause in events
      switchMap(searchTerm => {
        this.searchTerm = searchTerm;
        this.applyFilters();
        return [];
      })
    ).subscribe();
  }

  onSwitchChange(event: any): void {
    const isChecked = event.target.checked;
    this.isPublishable = isChecked;
    this.applyFilters();

    this.snackBar.open(
      isChecked ? 'Showing only published products' : 'Showing all products',
      'Close',
      { duration: 3000 }
    );
  }

  togglePublish(product: Product): void {
    if(product.published)
    {
      product.published = false
    }else if (!product.published)
    {
      product.published = true;
    }
    console.log(product);
    this.sellerService.updateProductisPublish(product.id, product).subscribe(
      () => {
        const index = this.products.findIndex((p: { id: number; }) => p.id === product.id);
        if (index > -1) {
          this.products[index] = product;
          this.applyFilters();
        }
        this.showSnackbar(product.published ? "Product is published now." : "Product is unpublished now.", "Close", 5000);
      },
      (error: any) => {
        console.error('Error updating product', error,{
          duration: 3000,
        },);
        this.snackBar.open('Error updating product', "close",{
          duration:3000
        });
      }
    );
  }

  deleteProduct(productId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.sellerService.deleteProductById(productId).subscribe(
          (data: any) => {
            console.log(data);
            this.snackBar.open('Product deleted successfully', 'Close');
            this.loadProducts(this.id); // Reload products after deletion
          },
          (error: any) => {
            console.log(error);
            this.snackBar.open('Error deleting product', 'Close');
          }
        );
      }
    });
  }

  viewProductDetails(productId: number): void {
    // Navigate to the product details page
  }

  applyFilters(): void {
    let filtered = this.products;

    if (this.isPublishable) {
      filtered = filtered.filter((product: { published: any; }) => product.published);
    }

    if (this.searchTerm) {
      filtered = filtered.filter((product: { name: string; }) => product.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    if (this.filterNoImage) {
      console.log("filtering image")
      filtered = filtered.filter((product: { images: any[]; }) => product.images.length === 0);
    }

    this.filteredProducts = filtered;
    console.log(this.filteredProducts);

    for (let i = 0; i < this.filteredProducts.length; i++) {
      this.productService.getProductRatingsAndReviews(this.filteredProducts[i].id).subscribe(ratingandReviewData => {
        this.filteredProducts[i].reviewsAndRatings = ratingandReviewData;
        let sum = 0;
        if (this.filteredProducts[i].reviewsAndRatings.length > 0) {
          for (let j = 0; j < this.filteredProducts[i].reviewsAndRatings.length; j++) {
            sum = sum + this.filteredProducts[i].reviewsAndRatings[j].rating;
          }
          this.filteredProducts[i].avgRating =
            this.roundToHalfOrFull(sum / this.filteredProducts[i].reviewsAndRatings.length);
        } else {
          this.filteredProducts[i].avgRating = 0;
        }
      });
    }
  }

  showSnackbar(content: any, action: any, duration: any): void {
    const sb = this.snackBar.open(content, action, {
      duration: duration,
      panelClass: ["custom-style"]
    });
    sb.onAction().subscribe(() => {
      sb.dismiss();
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(1);
  }

  getHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5; // Check if there is a half star
  }

  roundToHalfOrFull(value: number): number {
    return Math.round(value * 2) / 2;
  }

  checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.filterNoImage = params['NO-IMAGE'] === 'true';
      this.applyFilters(); // Apply filters based on query params
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

  // Method to handle keyboard events
  handleKeyboardEvents(event: KeyboardEvent): void {
    const key = event.key;

    // Check if the pressed key is a number between '1' and '9'
    if (key >= '1' && key <= '9') {
      const pageNumber = parseInt(key);
      if (pageNumber <= Math.ceil(this.filteredProducts.length / 16)) {
        this.onPageChange(pageNumber);
      }
    }
  }
}
