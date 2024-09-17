import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../../services/category.service";

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent implements OnInit{

  categoryForm: FormGroup | any;

  constructor(private fb: FormBuilder,private _categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
    this._categoryService.createCategory(this.categoryForm.value).subscribe((data)=>{
      console.log(data);
    },error => {
      console.log(error)
    })
      // Handle form submission logic here
      // (e.g., call a service to create the category)
      console.log(this.categoryForm.value); // For demonstration
    }
  }

}
