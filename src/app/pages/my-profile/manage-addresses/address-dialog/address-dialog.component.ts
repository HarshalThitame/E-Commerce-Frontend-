import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SavedAddressService} from "../../../../services/saved-address.service";
import {LoginService} from "../../../../services/login.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrl: './address-dialog.component.css'
})
export class AddressDialogComponent implements OnInit {
  addressForm: FormGroup;
  user: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addressService: SavedAddressService,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {
    console.log(data)
    this.addressForm = this.fb.group({
      firstName: [data.address.firstName || '', [Validators.required]],
      lastName: [data.address.lastName || '', [Validators.required]],
      addressLine1: [data.address.addressLine1 || '', Validators.required],
      addressLine2: [data.address.addressLine2 || '', Validators.required],
      city: [data.address.city || '', Validators.required],
      state: [data.address.state || '', Validators.required],
      zipCode: [data.address.zipCode || '', Validators.required],
      country: [data.address.country || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      if (this.data.address.id) {
        const savedAddress = this.addressForm.value;
        savedAddress.user = this.user;
        console.log(savedAddress)
        this.addressService.updateAddress(this.data.address.id, savedAddress).subscribe(() => {
          this.snackBar.open("Address updated successfully", "Close")
          this.dialogRef.close(true);
        });
      } else {
        const savedAddress = this.addressForm.value;
        savedAddress.user = this.user;
        console.log(savedAddress)
        this.addressService.saveAddress(savedAddress).subscribe(() => {
          this.snackBar.open("New Address saved successfully", "Close")
          this.dialogRef.close(true);
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    this.loginService.getCurrentUser().subscribe(data => {
      this.user = data;
    },
      error => {
      this.loginService.logout()
      })
  }
}
