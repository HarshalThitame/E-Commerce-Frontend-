import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import {LoginService} from '../../services/login.service';
import {ProductService} from '../../services/product.service';
import {CartService} from '../../services/cart.service';
import {CategoryService} from '../../services/category.service';
import {WishlistService} from '../../services/wishlist.service'; // Import WishlistService
import {Product} from '../../model/products.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  products: Product[] = [];
  productsForBestOfCategory: Product[] = [];
  user: any;
  cart: any;
  CartDetail: any = {};
  wishlistId: any; // Add wishlistId
  wishlist: Set<number> = new Set(); // Store wishlist product IDs
  randomMobile:any;
  randomFashion:any;
  randomProduct:any;

  combineAllProductofElectronicsAndisAvailable: any[] = [];
  combineAllProductofFashionAndisAvailable: any[] = [];
  combineAllProductofMobileAndisAvailable: any[] = [];
  allProducts: any[] = [];

  [key: string]: any; // Index signature to allow string keys

  constructor(
    private loginService: LoginService,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private wishlistService: WishlistService // Inject WishlistService
  ) {
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadCategories();
    this.loadAllProducts('allProducts');
    this.loadProductsByCategory('Electronics', 'combineAllProductofElectronicsAndisAvailable');
    this.loadProductsByCategory('Fashion', 'combineAllProductofFashionAndisAvailable');
    this.loadProductsByCategory('Phones & Tablets', 'combineAllProductofMobileAndisAvailable');
  }

  private loadUser(): void {
    this.loginService.getCurrentUser().subscribe(
      (data: any) => {
        this.user = data;
        if (data.userRole === 'SELLER') {
          this.router.navigate(['/seller']);
        } else if (data.userRole === 'USER') {
          this.router.navigate(['/']);
        } else {
          this.loginService.logout();
          this.router.navigate(['/login']);
        }
        this.loadCart();
        this.loadWishlist(); // Load wishlist after user is set
      },
      error => {
        this.loginService.logout();
        this.router.navigate(['/login']);
      }

    );
  }

  private loadCart(): void {
    this.cartService.getCartByUser(this.user.id).subscribe(
      cart => this.cart = cart,
      error => this.handleError(error)
    );
  }

  private loadCategories(): void {
    this.categoryService.getAllCategoriesGenral().subscribe(
      categories => this.categories = categories,
      error => this.handleError(error)
    );
  }

  private loadAllProducts(property: string): void {
    this.productService.getAllProducts().subscribe(
      (products: Product[]) => this.checkProductAvailability(products, property),
      error => this.handleError(error)
    );
      this.randomProduct = getRandomElement(this.products);
  }

  private loadProductsByCategory(category: string, property: string): void {
    this.productService.getProductsByCategory(category).subscribe(
      async (products: Product[]) => {
        const availabilityChecks = products.map(product =>
          this.cartService.checkProductAvailability(product.id.toString()).toPromise()
        );

        const availabilityResults = await Promise.all(availabilityChecks);

        // Process and limit to 10 products
        const processedProducts = await Promise.all(products.map(async (product, index) => {
          const isInWishlist = await this.checkServerWishlist(product.id);

          return {
            ...product,
            isAvailable: availabilityResults[index],
            isInWishlist
          };
        }));

        // Limit the final product list to 10 items
        // processedProducts.reverse();
        this[property] = processedProducts.slice(0, 10);
        if (property === 'combineAllProductofMobileAndisAvailable') {
         this.randomMobile =  getRandomElement(this.combineAllProductofMobileAndisAvailable);
          this.randomMobile.productHighlights = this.randomMobile.productHighlights.slice(0, 5);
        }
        if (property === 'combineAllProductofFashionAndisAvailable') {
          this.randomFashion =  getRandomElement(this.combineAllProductofFashionAndisAvailable);
          this.randomFashion.productHighlights = this.randomFashion.productHighlights.slice(0, 5);
        }
      },
      error => this.handleError(error)
    );
  }


  private checkProductAvailability(products: Product[], property: string): void {
    const availabilityChecks = products.map(product =>
      this.cartService.checkProductAvailability(product.id.toString()).toPromise()
    );

    Promise.all(availabilityChecks).then(availabilityResults => {
      this[property] = products.map((product, index) => ({
        ...product,
        isAvailable: availabilityResults[index]
      }));
    }).catch(error => this.handleError(error));
  }

  private loadWishlist(): void {
    this.wishlistService.getWishlistByUser(this.user.id).subscribe(
      (wishlist: any) => {
        this.wishlistId = wishlist.id; // Get the wishlist ID
        this.wishlist = new Set(wishlist.items.map((item: any) => item.productId));
      },
      (error: any) => this.handleError(error)
    );
  }

  isProductInWishlist(productId: number): boolean {
    return this.wishlist.has(productId);
  }

  async checkServerWishlist(productId: number): Promise<undefined | boolean> {
    try {
      const data: boolean | undefined = await this.wishlistService.isProductInWishlistCheck(this.wishlistId, productId).toPromise();
      return data; // Return the boolean result
    } catch (error) {
      console.error(error); // Handle any errors that occur during the API call
      return false; // Return false if there was an error
    }
  }

  async toggleWishlist(product: any): Promise<void> {
    // const isInWishlist = this.isProductInWishlist(product.id);
    //
    // if (isInWishlist) {
    //   this.removeFromWishlist(product.id);
    //   product.isInWishlist = false;
    // } else {
    //   // Optional server-side check if not found locally
    //   const serverCheck = await this.checkServerWishlist(product.id);
    //   if (serverCheck) {
    //     this.wishlist.add(product.id); // Update local wishlist if server confirms
    //   } else {
    //     this.addToWishlist(product);
    //   }
    // }

    if (product.isInWishlist) {
      this.removeFromWishlist(product.id);
      product.isInWishlist = false;
    } else {
      this.addToWishlist(product);
      product.isInWishlist = true;
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
      () => {
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

  scrollLeft1(): void {
    this.scroll('sc1', -300);
  }

  scrollRight1(): void {
    this.scroll('sc1', 300);
  }

  scrollLeft2(): void {
    this.scroll('sc2', -300);
  }

  scrollRight2(): void {
    this.scroll('sc2', 300);
  }

  scrollLeft3(): void {
    this.scroll('sc3', -300);
  }

  scrollRight3(): void {
    this.scroll('sc3', 300);
  }

  scrollLeft4(): void {
    this.scroll('sc4', -300);
  }

  scrollRight4(): void {
    this.scroll('sc4', 300);
  }

  private scroll(containerClass: string, distance: number): void {
    const container = document.querySelector(`.${containerClass}`) as HTMLElement;
    container.scrollBy({left: distance, behavior: 'smooth'});
  }

  addToCart(product: Product): void {
    if (product.stockQuantity < 2) {
      this.ngOnInit();
      return;
    }
    this.cartService.checkProductAvailability(product.id.toString()).subscribe(
      (availability: any) => {
        if (availability.exists) {
          this.handleProductInCart(product);
        } else {
          this.addProductToCart(product);
        }
      },
      error => this.handleError(error)
    );
  }

  private handleProductInCart(product: Product): void {
    Swal.fire({
      icon: 'info',
      title: 'Already in Cart',
      text: `${product.name} is already in your cart.`,
      confirmButtonText: 'Go to Cart'
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/user/', this.user.id]);
      }
    });
  }

  private addProductToCart(product: Product): void {
    this.CartDetail.cart = this.cart;
    this.CartDetail.product = product;
    this.CartDetail.quantity = 1;

    this.cartService.addToCart(this.CartDetail).subscribe(
      () => this.snackBar.open(`${product.name} has been added to your cart.`, 'Continue Shopping', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['snackbar-success']
      }),
      error => {
        console.error(error);
        this.snackBar.open('There was an error adding the product to your cart. Please try again.', 'Try Again', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    );
  }

  private handleError(error: any): void {
    console.error('An error occurred:', error);
  }

  protected readonly getRandomElement = getRandomElement;
}

function getRandomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
