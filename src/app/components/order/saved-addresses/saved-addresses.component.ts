import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../services/login.service";
import {CartService} from "../../../services/cart.service";
import {SavedAddressService} from "../../../services/saved-address.service";
import {ShippingAddress} from "../../../model/shipping-address.model";

@Component({
  selector: 'app-saved-addresses',
  templateUrl: './saved-addresses.component.html',
  styleUrl: './saved-addresses.component.css'
})
export class SavedAddressesComponent implements OnInit {

  user:any;
  savedAddresses:any = {
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    state: '',
    zipCode: '',
  };

  selectedAddress: ShippingAddress = {
    firstName:"",
    lastName:"",
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    state: '',
    zipCode: '',
    order: {}
  };

  constructor(private _loginService:LoginService, private _cartService:CartService,private _savedAddressService:SavedAddressService) { }
    ngOnInit(): void {

      this._loginService.getCurrentUser().subscribe((data) => {
        this.user = data;
        console.log(this.user)
        if(data.userRole == "USER") {}
        else {
          this._loginService.logout();
        }


        this._savedAddressService.getAdderssByUserId(this.user.id).subscribe(data=>{
          console.log(data);
          this.savedAddresses  = data;
        },
          error => {
            console.log(error)
          })
      })


    }
  selectAddress(address: any) {
    this.selectedAddress = address;
    this._savedAddressService.setSelectedAddress(this.selectedAddress);  }

}
