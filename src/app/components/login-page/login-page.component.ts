import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup|any;

  constructor(private fb: FormBuilder,
              private _loginService: LoginService,
              private _router: Router,) {}

  ngOnInit(): void {

    // Initialize the form group
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });


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
        if (error.status === 500) {
          console.log('Logging off...');
        }
      })
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);
      this._loginService.generateToken(this.loginForm.value).subscribe((data:any)=>{
        console.log(data)
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

    } else {
      console.log('Form is invalid');
    }
  }

}
