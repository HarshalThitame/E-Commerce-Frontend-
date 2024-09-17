import {Component, OnInit} from '@angular/core';
import {ShippingAddress} from "../../../model/shipping-address.model";
import {LoginService} from "../../../services/login.service";
import {SavedAddressService} from "../../../services/saved-address.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent implements OnInit {
  shippingAddress: ShippingAddress |any;
  user:any;
  address = {
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country:'',
    zipCode: '',
    user:{}
  };

  constructor(private _loginService: LoginService,
              private _SaveAddress:SavedAddressService) {
  }

  ngOnInit(): void {
    this._loginService.getCurrentUser().subscribe((data) => {
      this.user = data;
      this.address.user = data;
      if(data.userRole == "USER") {
      }
      else {
        this._loginService.logout();
      }
    })
  }

  onSubmit() {
    // Display SweetAlert confirmation
    Swal.fire({
      title: 'Confirm Delivery Address',
      text: `Is this your delivery address?\n\n${this.address.addressLine1}\n${this.address.addressLine2}\n${this.address.city}, ${this.address.state}, ${this.address.zipCode}\n${this.address.country}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with form submission
        this._SaveAddress.saveAddress(this.address).subscribe(
          data => {
            console.log('Address saved:', data);
            Swal.fire('Success', 'Your address has been saved!', 'success');
            window.location.reload();
          },
          error => {
            console.error('Error saving address:', error);
            Swal.fire('Error', 'There was an error saving your address.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your address submission was cancelled.', 'info');
      }
    });
  }
}
