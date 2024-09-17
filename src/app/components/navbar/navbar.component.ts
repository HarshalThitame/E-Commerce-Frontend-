import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoginService} from "../../services/login.service";
import {LoginComponent} from "../login/login.component";
import {Route, Router} from "@angular/router";
import {CategoryService} from "../../services/category.service";
import {ProductService} from "../../services/product.service";
import {PaginationService} from "../../services/pagination.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: any = false;
  user: any;
  dialogRef: any;
  userId: any;
  dropdownOpen = false;

  constructor(public login: LoginService,
              private dialog: MatDialog, private _router: Router,
              protected paginationService: PaginationService,) {
  }

  ngOnInit(): void {
    let user = this.login.getUser();
    console.log(user)
    if (user != null) {
      this.userId = user.id;
      this.isLoggedIn = true;
    }
    this.login.loginStatusSubject.asObservable().subscribe((data: any) => {
      this.isLoggedIn = this.login.isLoggedIn();
      console.log(data)
      user = this.login.getUser();
    })
  }

  openLogin() {
    this.dialogRef = this.dialog.open(LoginComponent, {
      width: '700px',
    });
  }

  logout() {
    this.login.logout();
    this.isLoggedIn = false;
    window.location.reload();
  }

  toggleDropdown(event: MouseEvent): void {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }


}
