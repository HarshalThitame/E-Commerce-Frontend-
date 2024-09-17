import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../services/login.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {LoginComponent} from "../../login/login.component";

@Component({
  selector: 'app-seller-navbar',
  templateUrl: './seller-navbar.component.html',
  styleUrl: './seller-navbar.component.css'
})
export class SellerNavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  sellerId: string | null = null;
  dialogRef: any;
  user:any;
  dropdownOpen = false;



  constructor(public login: LoginService,
              private dialog: MatDialog,private _route:Router) {}

  ngOnInit(): void {
    this.user = this.login.getUser();
    console.log(this.user)
    if(this.user != null){
      this.sellerId = this.user.id;
      this.isLoggedIn = true;
    }
    this.login.loginStatusSubject.asObservable().subscribe((data:any)=>{
      this.isLoggedIn = this.login.isLoggedIn();
      console.log(data)
      this.user = this.login.getUser();
    })

  }

  openLogin() {
    this.dialogRef = this.dialog.open(LoginComponent, {
      width: '700px',
    });
  }

  logout() {
    this.login.logout();
    this.isLoggedIn=false;
    window.location.reload();
  }

  toggleDropdown(event: MouseEvent): void {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }


}
