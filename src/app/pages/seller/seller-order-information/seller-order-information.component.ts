import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoginService} from "../../../services/login.service";
import {SellerService} from "../../../services/seller.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-seller-order-information',
  templateUrl: './seller-order-information.component.html',
  styleUrl: './seller-order-information.component.css'
})
export class SellerOrderInformationComponent implements OnInit {
  @ViewChild('invoiceContent') invoiceContent!: ElementRef;

  user: any;
  orderDetails: any;
  shippingAddress: any;
  paymentDetails: any;
  id: any;
  invoice = {
    date: new Date().toLocaleDateString(),
    orderId: '12345',
    productName: 'Product Name',
    quantity: 1,
    price: 100
  };

  statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  protected orderForm: FormGroup | any;


  constructor(private fb: FormBuilder,
              private _loginService: LoginService,
              private _sellerService: SellerService,
              private _route: ActivatedRoute,) {
    this.orderForm = this.fb.group({
      status: [''] // Initialize with an empty value
    });
  }


  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');

    this._loginService.getCurrentUser().subscribe((userdata) => {
      this.user = userdata;

      if (userdata.userRole == "SELLER") {
      } else {
        this._loginService.logout();
      }
    });

    this._sellerService.getOrderDetailbyiID(this.id).subscribe((orderData: any) => {
      console.log(orderData);

      this.orderDetails = orderData;

      // Set the form value when data is fetched
      this.orderForm.patchValue({
        status: this.orderDetails.order.status // Assuming 'status' is a property in the fetched data
      });

      this._sellerService.getShippingAddressByOrderId(this.orderDetails.order.id).subscribe((shippingAddress: any) => {
          this.shippingAddress = shippingAddress;
          console.log(this.shippingAddress);
        },
        error => {
          console.log(error)
        })

      this._sellerService.getPaymentByOrderId(this.orderDetails.order.id).subscribe((paymentData: any) => {
        this.paymentDetails = paymentData;
        console.log(this.paymentDetails);

      }, error => {
        console.log(error)
      })
    });

    // Subscribe to value changes of the 'status' control
    this.orderForm.get('status')?.valueChanges.subscribe((selectedStatus: string) => {
      this.updateOrderStatus(selectedStatus);
    });
  }
  private updateOrderStatus(selectedStatus: string): void {
    console.log('Selected Status:', selectedStatus);
    this.orderDetails.order.status = selectedStatus;
    this._sellerService.updateOrder(this.orderDetails.order).subscribe((orderData: any) => {
      console.log(orderData);
    })
  }


  downloadInvoice() {
    const data = this.invoiceContent.nativeElement;

    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('invoice.pdf');
    });
  }

}
