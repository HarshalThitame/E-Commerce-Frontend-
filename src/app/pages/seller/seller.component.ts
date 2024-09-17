import { Component, OnInit } from '@angular/core';
import { SellerService } from "../../services/seller.service";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CategoryService } from "../../services/category.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {

  selectedCategories: any[] = [];
  selectedSubCategories: any[] = [];
  selectedSubSubCategories: any[] = [];
  user: any;
  category: any[] = [];
  productForm: FormGroup;
  highlightEnabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerService,
    private router: Router,
    private loginService: LoginService,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      image: [null],
      selectedCheckboxes: this.fb.array([]),
      highlightEnabled: [false],
      productHighlights: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addHighlight();
    this.loadCurrentUser();
    this.loadCategories();
  }

  private loadCurrentUser(): void {
    this.loginService.getCurrentUser().subscribe(
      (data: any) => {
        if (data.userRole === "SELLER") {
          this.user = data;
        } else {
          this.loginService.logout();
        }
      },
      error => console.error(error)
    );
  }

  private loadCategories(): void {
    this.categoryService.getAllCategoriesGenral().subscribe(data => {
      this.category = data;
      this.setupCheckboxes();
    });

    this.categoryService.getAllCategories().subscribe(
      (data: any[]) => console.log(data), // Assuming you are using this data elsewhere
      error => console.error(error)
    );
  }

  get selectedCheckboxes(): FormArray {
    return this.productForm.get('selectedCheckboxes') as FormArray;
  }

  setupCheckboxes(): void {
    const checkboxes = this.category.map(() => this.fb.control(false));
    this.productForm.setControl('selectedCheckboxes', this.fb.array(checkboxes));
  }

  onCheckboxChange(event: Event, category: any, subCategory?: any, subSubCategory?: any): void {
    const target = event.target as HTMLInputElement;
    const { checked } = target;

    if (!subCategory && !subSubCategory) {
      this.updateSelection(this.selectedCategories, category, checked);
      this.clearChildSelections(category.id);
    } else if (subCategory && !subSubCategory) {
      this.updateSelection(this.selectedSubCategories, { ...subCategory, parentId: category.id }, checked);
      this.clearSubSubSelections(subCategory.id);
    } else if (subSubCategory) {
      this.updateSelection(this.selectedSubSubCategories, { ...subSubCategory, parentId: subCategory.id }, checked);
    }
  }

  private updateSelection(array: any[], item: any, checked: boolean): void {
    if (checked) {
      array.push(item);
    } else {
      const index = array.findIndex(i => i.id === item.id);
      if (index !== -1) {
        array.splice(index, 1);
      }
    }
  }

  private clearChildSelections(parentId: any): void {
    this.selectedSubCategories = this.selectedSubCategories.filter(sc => sc.parentId !== parentId);
    this.clearSubSubSelections(parentId);
  }

  private clearSubSubSelections(parentId: any): void {
    this.selectedSubSubCategories = this.selectedSubSubCategories.filter(ssc => ssc.parentId !== parentId);
  }

  get productHighlights(): FormArray {
    return this.productForm.get('productHighlights') as FormArray;
  }

  toggleHighlights(event: Event): void {
    this.highlightEnabled = (event.target as HTMLInputElement).checked;
  }

  addHighlight(): void {
    const productHighlightFormGroup = this.fb.group({
      name: [''],
      description: ['']
    });

    this.productHighlights.push(productHighlightFormGroup);
  }

  removeHighlight(index: number): void {
    this.productHighlights.removeAt(index);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to submit this product?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel!'
      }).then(result => {
        if (result.isConfirmed) {
          // Prepare product data
          const productData = {
            name: this.productForm.value.name,
            description: this.productForm.value.description,
            price: this.productForm.value.price,
            stockQuantity: this.productForm.value.stockQuantity,
            // Transform categories to only include ids
            categories: this.selectedCategories.length > 0 ? this.selectedCategories.map(c => ({ id: c.id })) : [],
            // Transform subCategories to only include ids
            subCategories: this.selectedSubCategories.length > 0 ? this.selectedSubCategories.map(sc => ({ id: sc.id })) : [],
            // Transform subSubCategories to only include ids
            subSubCategories: this.selectedSubSubCategories.length > 0 ? this.selectedSubSubCategories.map(ssc => ({ id: ssc.id })) : [],
            seller: this.user ? { id: this.user.id } : null, // Ensure seller is properly included
            // Transform productHighlights to include necessary details or keep as empty if not required
            productHighlights: this.productForm.value.productHighlights.length > 0 ? this.productForm.value.productHighlights.map((ph: { name: any; description: any; }) => ({
              name: ph.name,
              description: ph.description
            })) : [],
            published: this.productForm.value.published || false
          };

          // Log the product data for verification
          console.log(productData);

          // Submit the product data
          this.sellerService.addProduct(productData).subscribe(
            (data: any) => {
              Swal.fire('Submitted!', 'Your product has been submitted.', 'success').then(result => {
                if (result.isConfirmed) {
                  this.router.navigate(['seller/add-images/', data.id]);
                }
              });
            },
            error => {
              console.error(error);
              Swal.fire('Oops...', 'Something went wrong!', 'error');
            }
          );
        } else {
          Swal.fire('Cancelled', 'Your product submission has been cancelled.', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
    }
  }

}
