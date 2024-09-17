import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginService} from "../../../services/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../services/product.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-images',
  templateUrl: './add-images.component.html',
  styleUrl: './add-images.component.css'
})
export class AddImagesComponent implements OnInit{


  previewImages: string[] = [];
  selectedFiles: File[] = [];
  user:any;
  product:any;
  id:any;
  imageUrls: string[] = [];
  productForm: FormGroup | undefined;
  uploadingImages = false;


  private s3Client: S3Client;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private loginService:LoginService,
              private route:ActivatedRoute,
              private productService:ProductService,
              private router:Router) {
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



    this.loginService.getCurrentUser().subscribe(
      (data: any) => {
        if (data.userRole === "SELLER") {
          this.user = data;
        } else {
          this.loginService.logout();
        }
      },
      error => {
        console.log(error);
      }
    );

    this.productService.getProductById(this.id).subscribe((data) => {
        console.log(data)
        this.product = data;
      },
      (error)=>{
        console.log(error)
        this.router.navigate(['/error']); // Redirect to error page on failure
      })
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.previewImages = [];
      this.selectedFiles = [];
      const files: File[] = Array.from(event.target.files);

      // Limit to 5 images
      const maxFiles = 15;
      const selectedFiles = files.slice(0, maxFiles);

      selectedFiles.forEach(file => {
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }
  async uploadFilesToS3(): Promise<void> {
    const bucketName = 'harshal-ecom';
    let fileIndex = 1; // Start numbering from 1

    for (const file of this.selectedFiles) {
      const uniqueFileName = `${this.id}_${fileIndex}_${file.name}`;

      const params = {
        Bucket: bucketName,
        Key: `images/${uniqueFileName}`,
        Body: file,
      };

      try {
        // @ts-ignore
        await this.s3Client.send(new PutObjectCommand(params));
        this.imageUrls.push(uniqueFileName); // Store the file name after successful upload
        fileIndex++; // Increment the file index
        console.log(this.imageUrls)
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }
  }
  // Function to sort files by name
  sortFilesByName(files: File[]): File[] {
    return files.sort((a, b) => a.name.localeCompare(b.name));
  }
  async onSubmit() {
    try {
      this.selectedFiles = this.sortFilesByName(this.selectedFiles);
      this.uploadingImages = true;
      await this.uploadFilesToS3();
      this.productService.uploadImages(this.imageUrls).subscribe(
        data => {
          console.log(data);
          Swal.fire({
            title: 'Success!',
            text: 'Product saved successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/seller/products'], {
              queryParams: { 'NO-IMAGE': 'true' }
            });
          });
        },
        error => {
          console.error('Error:', error);
          this.uploadingImages = false;
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue saving the product.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.uploadingImages = false;
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue uploading files.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
