import {Component, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import { EventEmitter } from '@angular/core';
import {SavedAddressService} from "../../../services/saved-address.service";

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.css'
})
export class PaymentMethodsComponent implements OnInit{
  selectedAddress: any;
  constructor(private _savedAddress:SavedAddressService){}

  selectedMethod: string = '';
  paymentDetails: any = {};
  @Output() paymentData = new EventEmitter<any>();



  ngOnInit(): void {
    this._savedAddress.selectedAddress$.subscribe(address => {
      this.selectedAddress = address;
      console.log('Selected Address:', this.selectedAddress);
    });

  }


  onSubmit(paymentForm: NgForm) {
    if (paymentForm.valid) {
      console.log('Selected Payment Method:', this.selectedMethod);
      console.log('Payment Details:', this.paymentDetails);

      this.paymentData.emit({
        method: this.selectedMethod,
        details: this.paymentDetails
      });

      // Display SweetAlert message

        // Add logic to redirect or clear form after confirmation
        paymentForm.reset();
        this.selectedMethod = '';
        this.paymentDetails = {};
      }

  }
}
