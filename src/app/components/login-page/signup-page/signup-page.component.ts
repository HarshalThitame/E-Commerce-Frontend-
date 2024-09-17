import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent implements OnInit {
  signupForm: FormGroup|any;

  user:any = {
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phone:"",
    dateOfBirth:"",
    gender:""
  }

  constructor(private fb: FormBuilder,
              private _loginService: LoginService,
              private _router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]], // Phone number validation for 10 digits
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(form: FormGroup|any) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value);

      this.user.email = this.signupForm.value.email;
      this.user.password = this.signupForm.value.confirmPassword;
      this.user.firstName = this.signupForm.value.firstName;
      this.user.lastName = this.signupForm.value.lastName;
      this.user.phone = this.signupForm.value.phone;
      this.user.dateOfBirth = this.signupForm.value.dateOfBirth;
      this.user.username = this.signupForm.value.username;
      this.user.gender = this.signupForm.value.gender;

      this._loginService.createUser(this.user).subscribe(()=>{
        this._snackBar.open("Your account has been successfully created. Welcome aboard!","",{duration:3000});
        this._router.navigate(['/login']);
      },error => {
        console.log(error);
      })


      console.log(this.user)
      // Handle form submission logic here
    } else {
      console.log('Form is invalid');
    }
  }
}
