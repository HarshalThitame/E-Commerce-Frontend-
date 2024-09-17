import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../services/product.service";
import Swal from "sweetalert2";
import {CartService} from "../../services/cart.service";
import {LoginService} from "../../services/login.service";
import {Product} from "../../model/products.model";
import {CategoryService} from "../../services/category.service";
import {PaginationService} from "../../services/pagination.service";

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit,OnDestroy {
  name: string | any;
  allProducts: any = [];
  CartDetail: any = {};
  cart: any;
  user: any;
  private isProductAvailable: any[] = [];
  combineAllProductAndisAvailable: any;
  filteredProducts: any = []; // Array to hold filtered products
  searchQuery: string = ''; // Search query
  p: number = 1; // Current page number
  sortOption: string = 'newest'; // Default sorting option
  subCategories: any;
  selectedSubcategories: string[] = []; // Array of selected subcategories
  isSidebarOpen = false;



  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _cartService: CartService,
    private _loginService: LoginService,
    private _router: Router,
    private _categotyService:CategoryService,
    private _paginationService:PaginationService
  ) {}

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleKeyboardEvents.bind(this));
    this.name = this.route.snapshot.paramMap.get('name');

    this._loginService.getCurrentUser().subscribe((userdata) => {
      this.user = userdata;
      if (userdata.userRole == "USER") {
        this._cartService.getCartByUser(userdata.id).subscribe((c: any) => {
          this.cart = c;
        });
      } else {
        this._loginService.logout();
      }
    });

    this._productService.getProducts().subscribe((c: any) => {
      this.checkProduct(c);
      this.filterProducts()
    });

    this._categotyService.getSubCategoriesByCategory(this.name).subscribe((c: any) => {
      console.log(c)
      this.subCategories = c;
    })

    this._productService.getProductsByCategory(this.name).subscribe((byCategory) => {
      const prod: any = byCategory;

      // Helper function to handle the asynchronous subcategory fetching
      const fetchSubCategories = (product: any) => {
        const subCategoryRequests = product.subCategories.map((subCategoryId: any) =>
          this._categotyService.getSubCategoryById(subCategoryId).toPromise()
        );

        return Promise.all(subCategoryRequests).then(subCategories => {
          product.subCategories = subCategories;
          return product;
        });
      };

      // Process all products
      const productPromises = prod.map((product: any) => fetchSubCategories(product));

      // After all products are processed
      Promise.all(productPromises).then(updatedProducts => {
        console.log(updatedProducts);
        this.checkProduct(updatedProducts);
      }).catch(error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
    });

  }
  ngOnDestroy(): void {
    // Clean up the event listener when component is destroyed
    document.removeEventListener('keydown', this.handleKeyboardEvents.bind(this));
  }

  checkProduct(byCategory: Product[]) {
    this.allProducts = byCategory;
    this.isProductAvailable = new Array(this.allProducts.length); // Initialize availability array

    Promise.all(this.allProducts.map((product: { id: string }, index: number) =>
      this._cartService.checkProductAvailability(product.id).toPromise().then(isAvailable => {
        this.isProductAvailable[index] = isAvailable; // Store availability status
      })
    )).then(() => {
      this.combineAllProductAndisAvailable = this.allProducts.map((product: { id: string }, index: number) => ({
        ...product,
        isAvailable: this.isProductAvailable[index]
      }));

      for (let i = 0; i < this.combineAllProductAndisAvailable.length; i++) {
        this._productService.getProductRatingsAndReviews(this.combineAllProductAndisAvailable[i].id).subscribe(data => {
          this.combineAllProductAndisAvailable[i].reviewsAndRatings = data;
          let sum = 0;
          if (this.combineAllProductAndisAvailable[i].reviewsAndRatings.length > 0) {
            for (let j = 0; j < this.combineAllProductAndisAvailable[i].reviewsAndRatings.length; j++) {
              sum = sum + this.combineAllProductAndisAvailable[i].reviewsAndRatings[j].rating;
            }
            this.combineAllProductAndisAvailable[i].avgRating =
              this.roundToHalfOrFull(sum / this.combineAllProductAndisAvailable[i].reviewsAndRatings.length);
          } else {
            this.combineAllProductAndisAvailable[i].avgRating = 0;
          }
        });
      }

      this.filteredProducts = this.combineAllProductAndisAvailable; // Initialize filteredProducts
      console.log(this.filteredProducts)
      this.p = this._paginationService.getCurrentPage() || 1;

    }).catch(error => {
      console.log(error);
    });
  }

  filterProducts(subCategoryId?: number) {
    const query = this.searchQuery.toLowerCase();

    this.filteredProducts = this.combineAllProductAndisAvailable.filter((product: any) => {
      // Check if the product name or description includes the search query
      const matchesQuery = product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      // Check if the product matches the subCategoryId filter
      const matchesSubCategory = !subCategoryId ||
        product.subCategories.some((subCategory: any) => subCategory.id === subCategoryId);


      return matchesQuery && matchesSubCategory;
    });

    // Optional: Reset pagination when filtering changes
  }




  addToCart(product: Product) {
    let isAvailable: any = {
      itemId: 0,
      exists: false,
    };

    this._cartService.checkProductAvailability(product.id.toString()).subscribe(
      (data) => {
        isAvailable = data;

        if (isAvailable.exists) {
          Swal.fire({
            icon: 'info',
            title: 'Already in Cart',
            text: `${product.name} is already in your cart.`,
            confirmButtonText: 'Go to Cart'
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/user/', this.user.id]);
            }
          });
        } else {
          this.CartDetail.cart = this.cart;
          this.CartDetail.product = product;
          this.CartDetail.quantity = 1;

          this._cartService.addToCart(this.CartDetail).subscribe(
            (data) => {
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

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(1);
  }

  getHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5; // Check if there is a half star
  }

  // Utility function to round to nearest .5 or full number
  roundToHalfOrFull(value: number): number {
    return Math.round(value * 2) / 2;
  }


  onSortChange(event: any) {
    const sortOption: string=event.target.value;
    if (sortOption === 'low-to-high') {
      this.filteredProducts.sort((a: { price: number; }, b: { price: number; }) => a.price - b.price);
    } else if (sortOption === 'high-to-low') {
      this.filteredProducts.sort((a: { price: number; }, b: { price: number; }) => b.price - a.price);
    } else {
      // Reset to default sorting (you can modify this logic as needed)
      this.filteredProducts = [...this.filteredProducts];
    }
  }



  sortByDate(event: any) {

    const order:string = event.target.value;
    if (order === 'newest') {
      this.filteredProducts.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (order === 'oldest') {
      this.filteredProducts.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  }

  onSubcategoryChange(event: any) {
    const subcategoryId = event.target.value; // Get the id of the subcategory
    console.log(subcategoryId)
    if (event.target.checked) {
      if (!this.selectedSubcategories.includes(subcategoryId)) {
        this.selectedSubcategories.push(subcategoryId);
        this.filterProducts(subcategoryId)
      }
    }
    this.filterProducts(); // Call filterProducts to update the filtered products
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
      if (pageNumber <= Math.ceil(this.filteredProducts.length / 15)) {
        this.onPageChange(pageNumber);
      }
    }
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
