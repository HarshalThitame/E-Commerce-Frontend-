import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoginService} from "../../../services/login.service";
import {OrderService} from "../../../services/order.service";
import {ProductService} from "../../../services/product.service";
import {SellerService} from "../../../services/seller.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeleteObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Product} from "../../../model/products.model";
import {StockHistoryService} from "../../../services/stock-history.service";
import {ChangeType, StockHistory} from "../../../model/StockHistory.model";


// 1. Create a component for the dialog
@Component({
  selector: 'app-alert-dialog',
  template: `
    <h1 mat-dialog-title>Enter Information</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Your Input</mat-label>
        <input matInput [(ngModel)]="inputValue" type="number">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button (click)="onSubmit()">Submit</button>
    </div>
  `,
})
export class AlertDialogComponent {
  inputValue: string = '';

  changeType: ChangeType = "ADJUSTMENT";

  stockHistory: StockHistory = {
    changeAmount: 0,
    changeType: this.changeType,
    productId: 0,
    productName: "",
    reason: "",
    sellerId:0,
    updatedAt: new Date().toISOString()

  };

  constructor(
    private dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sellerService: SellerService,
    private stockHistoryService: StockHistoryService,
  ) {
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without submitting
  }

  onSubmit(): void {
    this.dialogRef.close(); // Close the dialog and submit data

    const product = this.data.product;


    this.stockHistory.productId = product.id;
    this.stockHistory.sellerId = product.seller.id
    this.stockHistory.productName = product.name;
    this.stockHistory.reason = "update stock"
    this.stockHistory.changeAmount = parseInt(this.inputValue) - product.stockQuantity
    this.stockHistory.updatedAt = new Date().toISOString();
    if (this.stockHistory.changeAmount < 0) {
      this.stockHistory.changeType = "REMOVAL"
    } else if (this.stockHistory.changeAmount > 0) {
      this.stockHistory.changeType = "ADDITION"
    } else if (this.stockHistory.changeAmount == 0) {
      this.stockHistory.changeType = "ADJUSTMENT"
    }

    this.stockHistoryService.saveHistory(this.stockHistory).subscribe(data => {
        console.log(data)
      },
      error => {
        console.log(error)
      })

    product.stockQuantity = this.inputValue;
    this.sellerService.updateProduct(product.id, product).subscribe(() => {
    }, (error: any) => {
      console.log(error)
    })
  }
}

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrl: './product-information.component.css'
})
export class ProductInformationComponent implements OnInit {
  @ViewChild('reviewsSection') reviewsSection!: ElementRef;

  product: any = {};
  totalSales: number = 0;
  totalOrders: number = 0;
  pendingOrders: number = 0;
  returnedOrders: number = 0;
  totalRevenue: number = 0;
  avgRating: number = 0;
  reviews: any[] = [];
  id: any;
  orderData: any;
  discountValue: any;
  discountPercentage: any;
  private s3Client: S3Client;
  productReviews:any;


  constructor(private route: ActivatedRoute,
              private loginService: LoginService,
              private orderService: OrderService,
              private productService: ProductService,
              private sellerService: SellerService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
  ) {
    this.s3Client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: 'AKIAYRH5ND6JDPJFGWEN',
        secretAccessKey: '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'
      }
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.loadProductData();
    this.loadOrderDataByProduct(this.id);
    this.loadProductReviews();
  }

  loadProductReviews() {
        this.productService.getProductRatingsAndReviews(this.id).subscribe(data => {
          this.productReviews = data;
          let sumOfRatings = 0;
          for (let r of this.productReviews) {
            sumOfRatings = sumOfRatings + r.rating;
          }
          this.productReviews.averageRating = sumOfRatings / this.productReviews.length;
        })
    }

  loadOrderDataByProduct(id: any) {
    this.sellerService.getOrderItemByProduct(id).subscribe(data => {
      this.orderData = data
      console.log(data);

      this.totalOrders = this.orderData.length;
      this.totalRevenue = 0;
      this.totalSales = 0;
      this.pendingOrders = 0;
      this.returnedOrders = 0;
      if (this.orderData.length > 0) {
        for (let i = 0; i < this.orderData.length; i++) {
          this.totalSales = this.totalSales + this.orderData[i].order.totalAmount;
          if (this.orderData[i].order.status == 'PENDING') {
            this.pendingOrders++;
          }
        }
        this.totalRevenue = this.totalSales * 0.091;
      }

      console.log(this.totalSales)
    })
  }

  loadProductData() {
    // Sample data for demonstration
    this.sellerService.getProductById(this.id).subscribe((data) => {
        this.product = data;

        this.discountValue = this.product.discount;
        this.loadProductImages(this.id)
        this.productService.getProductRatingsAndReviews(this.product.id).subscribe((ratingAndReviews) => {
          this.product.reviewsAndReviews = ratingAndReviews;

          if (this.product.reviewsAndRatings.length > 0) {
            let sumOfRatings = 0;
            for (let r of this.product.reviewsAndReviews) {
              sumOfRatings = sumOfRatings + r.rating;
            }
            this.product.averageRating = this.roundToHalfOrFull(sumOfRatings / this.product.reviewsAndReviews.length);
          }
        })
        console.log(this.product);
      },
      error => {
        console.log(error);
      })

    // Assign values from the product object
    this.totalSales = this.product.totalSales;
    this.totalOrders = this.product.totalOrders;
    this.pendingOrders = this.product.pendingOrders;
    this.returnedOrders = this.product.returnedOrders;
    this.totalRevenue = this.product.totalRevenue;
    this.avgRating = this.product.avgRating;
    this.reviews = this.product.reviews;
  }

  private loadProductImages(id: any) {
    this.sellerService.getIamgesByProductID(this.id).subscribe((data) => {
        this.product.images = data;
        if (this.product.images.length == 0) {
          this.product.published = false
          this.sellerService.updateProductisPublish(this.product.id, this.product).subscribe(data => {
            console.log(data);
          }, error => {
            console.log(error);
          })
        }
      },
      error => {
        console.log(error)
      })
  }

  editProduct() {
    console.log('Edit product logic goes here.');
  }

  viewProduct() {
    console.log('View product on store logic goes here.');
  }

  updateStock() {
    console.log('Update stock logic goes here.');
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

  // Utility function to round to nearest .5 or full number
  p: string | number = 1;
  roundToHalfOrFull(value: number): number {
    return Math.round(value * 2) / 2;
  }


  deleteImage(image: any) {
    console.log(image)
    const imageName: string = image.url;
    console.log(imageName)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sellerService.deleteImageById(image.id).subscribe(
          (data: any) => {
            Swal.fire(
              'Deleted!',
              'Your image has been deleted.',
              'success'
            );
            this.deleteFileFromS3(imageName);
            this.ngOnInit();
          },
          (error: any) => {
            Swal.fire(
              'Error!',
              'There was a problem deleting the image.',
              'error'
            );
            console.log(error);
          }
        );
      }
    });
  }


  openDialog(id: any) {
    const dialogRef = this.dialog.open(AlertDialogComponent,
      {
        data: {product: id}
      });
    dialogRef.afterClosed().subscribe();
  }

  applyDiscount() {
    if (this.discountPercentage < 100 && this.discountPercentage >= 0) {
      // this.product.price = this.product.price - (this.product.price * (this.discountPercentage / 100));
      const product = this.product;
      product.discount = this.discountPercentage;
      console.log(product);
      this.sellerService.updateProduct(product.id, product).subscribe(d => {
        console.log(d)
      }, (error: any) => {
        console.log(error)
      })
    }
  }


  async deleteFileFromS3(fileName: string): Promise<void> {
    const bucketName = 'harshal-ecom';
    const params = {
      Bucket: bucketName,
      Key: `images/${fileName}` // Adjust the path as necessary
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);
      console.log('File deleted successfully');


    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  togglePublish(product: Product): void {
    if (product.published) {
      product.published = false
    } else if (!product.published) {
      product.published = true;
    }
    console.log(product);
    this.sellerService.updateProductisPublish(product.id, product).subscribe(
      () => {
        this.snackBar.open(product.published ? "Product is published now." : "Product is unpublished now.", "Close", {duration: 3000});
      },
      (error: any) => {
        console.error('Error updating product', error, {
          duration: 3000,
        },);
        this.snackBar.open('Error updating product', "close", {
          duration: 3000
        });
      }
    );
  }

  onPageChange(pageNumber: number): void {
    this.p = pageNumber;
    this.scrollToReviews();
  }
  scrollToReviews(): void {
    if (this.reviewsSection) {
      const elementPosition = this.reviewsSection.nativeElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100; // Scroll 100px above the section

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

}
