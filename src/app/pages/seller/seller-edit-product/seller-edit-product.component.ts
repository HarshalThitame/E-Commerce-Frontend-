import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Product} from "../../../model/products.model";
import {SellerService} from "../../../services/seller.service";
import {LoginService} from "../../../services/login.service";
import {CategoryService} from "../../../services/category.service";
import {SharedDataService} from "../../../services/shared-data.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-seller-edit-product',
  templateUrl: './seller-edit-product.component.html',
  styleUrl: './seller-edit-product.component.css'
})
export class SellerEditProductComponent implements OnInit {
  selectedCategories: any[] = [];
  selectedSubCategories: any[] = [];
  selectedSubSubCategories: any[] = [];
  user: any;
  category: any[] = [];
  productForm: FormGroup;
  highlightEnabled: boolean = false;

  subCategories: any[] = [];
  subSubCategories: any[] = [];
  private isPublished: any;

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
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
    this.loginService.getCurrentUser().subscribe(data => {
      this.user = data;
    },error => {
      this.loginService.logout()
    })

    this.loadCategories();
    this.loadProductData();
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

  private loadProductData(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.sellerService.getProductById(productId).subscribe(
         (product: any) => {

          for (let i = 0; i < product.subCategories.length; i++) {
            const id:number = product.subCategories[i];
            this.sellerService.getSubCategoryById(id).subscribe((data: any) => {
              this.subCategories.push(data);
            });
          }

           for (let i = 0; i < product.subSubCategories.length; i++) {
             const id:number = product.subSubCategories[i];
             this.sellerService.getSubSubCategoryById(id).subscribe((data: any) => {
               this.subSubCategories.push(data);
             },error => {
               console.log(error);
             })
           }

          this.productForm.patchValue(product);
          this.selectedCategories = product.categories || [];
          this.selectedSubCategories = this.subCategories || [];
          this.selectedSubSubCategories = this.subSubCategories || [];
          this.productHighlights.clear();
          product.productHighlights.forEach((highlight: any) => this.addHighlight(highlight));
          this.highlightEnabled = product.productHighlights && product.productHighlights.length > 0;
           this.isPublished = product.published;
           console.log(product)
        },
        error => console.error(error)
      );
    }
  }

  private setupCheckboxes(): void {
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

  addHighlight(highlight: any = {id:null, name: '', description: '' }): void {
    const productHighlightFormGroup = this.fb.group({
      id:[highlight.id],
      name: [highlight.name],
      description: [highlight.description]
    });

    this.productHighlights.push(productHighlightFormGroup);
  }

  removeHighlight( id: any,index: number): void {
    this.productHighlights.removeAt(index);
    this.sellerService.deleteHighlightById(id).subscribe(data => {

    },
      error => console.error(error))
  }
// edit-product.component.ts
  isCategorySelected(id: number): boolean {
    return this.selectedCategories.some(c => c.id === id);
  }

  isSubCategorySelected(id: number): boolean {
    return this.selectedSubCategories.some(sc => sc.id === id);
  }

  isSubSubCategorySelected(id: number): boolean {
    return this.selectedSubSubCategories.some(ssc => ssc.id === id);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this product?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel!'
      }).then(result => {
        if (result.isConfirmed) {
          // Prepare product data
          const productData = {
            name: this.productForm.value.name,
            description: this.productForm.value.description,
            price: this.productForm.value.price,
            stockQuantity: this.productForm.value.stockQuantity,
            categories: this.selectedCategories.length > 0
              ? this.selectedCategories.map(c => ({
                id: c.id,
                name: c.name,
                description: c.description
              }))
              : [],
            subCategories: this.selectedSubCategories.length > 0
              ? this.selectedSubCategories.map(sc => ({
                id: sc.id,
                name: sc.name,
                description: sc.description
              }))
              : [],

            subSubCategories: this.selectedSubSubCategories.length > 0
              ? this.selectedSubSubCategories.map(ssc => ({
                id: ssc.id,
                name: ssc.name,
                description: ssc.description
              }))
              : [],
            seller: this.user ? { id: this.user.id } : null,
            productHighlights: this.productForm.value.productHighlights.length > 0 ? this.productForm.value.productHighlights.map((ph: {id:any; name: any; description: any; }) => ({
              id: ph.id,
              name: ph.name,
              description: ph.description
            })) : [],
            published: this.isPublished || false
          };

          // Submit the product data
          const productId = this.route.snapshot.paramMap.get('id');
          if (productId) {
            console.log(productData);
            this.sellerService.updateProduct(productId, productData).subscribe(
              (data: any) => {
                console.log(data)
                Swal.fire('Updated!', 'Your product has been updated.', 'success').then(result => {
                  if (result.isConfirmed) {
                    this.router.navigate(['seller/products']);
                  }
                });
              },
              error => {
                console.error(error);
                Swal.fire('Oops...', 'Something went wrong!', 'error');
              }
            );
          }
        } else {
          Swal.fire('Cancelled', 'Your product update has been cancelled.', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
    }
  }
}
