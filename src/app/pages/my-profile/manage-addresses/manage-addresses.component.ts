import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SavedAddressService} from "../../../services/saved-address.service";
import {LoginService} from "../../../services/login.service";
import {AddressDialogComponent} from "./address-dialog/address-dialog.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-addresses',
  templateUrl: './manage-addresses.component.html',
  styleUrl: './manage-addresses.component.css'
})
export class ManageAddressesComponent implements OnInit {

  addresses: any[] = []; // Define type according to your data model
  user: any;

  constructor(
    private addressService: SavedAddressService,
    private LoginService:LoginService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.LoginService.getCurrentUser().subscribe(
      (data: any) => {
        this.user = data
        this.loadAddresses();
      }
    )
  }

  loadAddresses(): void {
    this.addressService.getAdderssByUserId(this.user.id).subscribe(
      (data: any) => {
        console.log(data)
        this.addresses = data;
      },
        (error: any) => {
        console.error('Error fetching addresses', error);
      }
    );
  }

  addNewAddress(): void {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '400px',
      data: { address: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAddresses(); // Reload addresses after adding
      }
    });
  }

  editAddress(address: any): void {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '400px',
      data: { address }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadAddresses(); // Reload addresses after editing
      }
    });
  }

  deleteAddress(addressId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.addressService.deleteAddress(addressId).subscribe(
          () => {
            this.loadAddresses(); // Reload addresses after deletion
            Swal.fire(
              'Deleted!',
              'Your address has been deleted.',
              'success'
            );
          },
          (error: any) => {
            console.error('Error deleting address', error);
            Swal.fire(
              'Error!',
              'There was an error deleting the address.',
              'error'
            );
          }
        );
      }
    });
  }
}
