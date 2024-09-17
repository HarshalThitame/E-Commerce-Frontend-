import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SellerService} from "../../../services/seller.service";
import {S3Client, PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import {log} from "node:util"; // Import S3Client and PutObjectCommand

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrl: './seller-profile.component.css'
})
export class SellerProfileComponent implements OnInit {
  userId: any;
  selectedOption = 'Profile';
  seller: any = {};

  profileForm: FormGroup | any;
  private s3Client: S3Client;
  private oldProfileImage: any;


  constructor(private loginService: LoginService,
              private router: Router,
              private fb: FormBuilder,
              private sellerService: SellerService,
              private snackBar: MatSnackBar) {
    this.s3Client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: 'AKIAYRH5ND6JDPJFGWEN',
        secretAccessKey: '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'
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loginService.getCurrentUser().subscribe(data => {
        this.userId = data.id;
        this.seller = data
        this.loadSellerData(this.seller)

      },
      error => {
        this.loginService.logout()
      })
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      id: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      businessName: ['', Validators.required],
      gstNumber: [''],
      panCardNumber: [''],
      dateOfBirth: [''],
      gender: ['', Validators.required],
    });
  }

  loadSellerData(data: any): void {
    // Patch the form with data from the server
    this.profileForm.patchValue({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      businessName: data.businessName,
      gstNumber: data.gstNumber,
      panCardNumber: data.panCardNumber,
      dateOfBirth: this.formatDate(data.dateOfBirth),
      gender: data.gender,
      profileImage: data.profileImage
    });

    if (data.profileImage != null) {
      const str = data.profileImage.split('https://harshal-ecom.s3.amazonaws.com/profile-images/');
      console.log(str[1])
      this.oldProfileImage = str[1]
    }
  }


  updateProfile(): void {
    if (this.profileForm.valid) {


      console.log(this.seller.profileImage)
      this.profileForm.value.profileImage = this.seller.profileImage;


      this.loginService.updateSeller(this.profileForm.value).subscribe(
        (response: any) => {
          this.ngOnInit()
          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 3000,
          },);
        },
        (error: any) => {
          console.log(error);
          this.snackBar.open('Error updating profile', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }

  formatDate(isoDateString: string): string {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // Return in 'yyyy-MM-dd' format
  }

  onProfilePictureChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0]; // Get the selected file
      this.uploadFileToS3(file); // Upload the selected file
    }
  }

  async uploadFileToS3(file: File): Promise<void> {

    const FileName = `${this.seller.id}_${this.seller.username}_${file.name}`;


    const bucketName = 'harshal-ecom'; // Your S3 bucket name
    const uniqueFileName = `profile-images/${FileName}`; // Create a unique file name

    const params = {
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: file,
    };

    try {
      const command = new PutObjectCommand(params); // Create a new PutObjectCommand
      await this.s3Client.send(command); // Send the command to S3
      console.log('File uploaded successfully');

      // Update the profile image URL after successful upload
      this.seller.profileImage = `https://${bucketName}.s3.amazonaws.com/${uniqueFileName}`;
      console.log(this.seller.profileImage)
      this.updateProfile();
      await this.deleteFileFromS3(this.oldProfileImage)
      this.ngOnInit()
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  async deleteFileFromS3(fileName: string): Promise<void> {
    const bucketName = 'harshal-ecom';
    const params = {
      Bucket: bucketName,
      Key: `profile-images/${fileName}` // Adjust the path as necessary
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);
      console.log('File deleted successfully');

      // Optionally, update the seller profile image to a default or empty image
      this.seller.profileImage = '';
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Programmatically trigger the file input click
    }
  }
}
