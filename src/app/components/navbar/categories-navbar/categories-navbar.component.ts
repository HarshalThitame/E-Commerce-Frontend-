import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../services/login.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {CategoryService} from "../../../services/category.service";
import {ProductService} from "../../../services/product.service";
import {LoginComponent} from "../../login/login.component";

@Component({
  selector: 'app-categories-navbar',
  templateUrl: './categories-navbar.component.html',
  styleUrl: './categories-navbar.component.css'
})
export class CategoriesNavbarComponent implements OnInit {
  isLoggedIn: any = false;
  user :any;
  dialogRef: any;
  userId: any;
  categories: any;
  searchQuery: string = '';
  products: any;

  constructor(public login: LoginService,
              private dialog: MatDialog,private _router:Router,
              private _categoryService: CategoryService,
              private _productService: ProductService,) {}

  ngOnInit(): void {
    let user = this.login.getUser();
    console.log(user)
    if(user != null){
      this.userId = user.id;
      this.isLoggedIn = true;
    }
    this.login.loginStatusSubject.asObservable().subscribe((data:any)=>{
      this.isLoggedIn = this.login.isLoggedIn();
      console.log(data)
      user = this.login.getUser();
    })
    // console.log(user.id)

    this._categoryService.getAllCategoriesGenral().subscribe((data) => {
      this.categories = data;
    })
  }


  search(){
    if (this.searchQuery.trim()) {
      console.log(this.searchQuery)
      this._productService.searchProducts(this.searchQuery);
      this._router.navigate(['/user/allproducts/category/',+this.searchQuery])
    }
  }

}
