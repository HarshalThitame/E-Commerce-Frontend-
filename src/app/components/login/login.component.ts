import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements  OnInit{
  loginData:any={
    email:'',
    password:''
  }
  dialogRef: any;
  hide = true;
  user:any;

  constructor(private _loginService: LoginService,
              private _router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog)  {}
    ngOnInit(): void {
        this._loginService.getCurrentUser().subscribe((data:any)=>{
            console.log(data.userRole)
          if(data.userRole == "USER"){
            this._router.navigate(['/']);
          }else  if(data.userRole == "ADMIN"){
            this._router.navigate(['admin']);
          } else if(data.userRole=="SELLER"){
            this._router.navigate(['seller'])
          }
          else{
            this._loginService.logout();
          }
        },
          error => {
            console.log(error)
          })
    }

    formSubmit(){
    this._loginService.generateToken(this.loginData).subscribe((data:any)=>{
      console.log(data)
      this.dialog.closeAll();
      this._loginService.loginUser(data.token)
      this._loginService.getCurrentUser().subscribe(
        (user: any) => {
          this._loginService.setUser(user);
          if(user.userRole == "USER"){
            this._router.navigate(['/']);
            window.location.reload();
          }else if (user.userRole=="ADMIN")
          {
            this._router.navigate(['admin']);
          }
          else if(user.userRole=="SELLER"){
            this._router.navigate(['seller/dashboard'])
          }
          else{
            this._loginService.logout();
          }
      },
        error => {
          console.log(error);
        })

    })
    }

}
