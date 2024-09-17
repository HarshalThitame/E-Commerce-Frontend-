import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { LoginService } from "../../../services/login.service";
import { EmailService } from "../../../services/email.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup | any;
  otpForm: FormGroup | any;
  step: number = 1;  // Step tracker (1 for email, 2 for OTP and new password)
  otpSent: boolean = false;  // Track OTP status
  loading: boolean = false;  // Loading spinner indicator
  private otp: any;
  user: any;

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private emailService: EmailService,
              private snackBar: MatSnackBar,
              private router: Router,) { }

  ngOnInit(): void {
    // Initialize the email form (Step 1)
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Initialize the OTP and new password form (Step 2)
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mismatch: true };  // Return error object if mismatch
    }
    return null;  // No errors
  }

  // Step 1: Handle email submission and send OTP
  onEmailSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email').value;
      this.loading = true;  // Show spinner
      this.loginService.isUserPresent(email).subscribe(data => {
        this.user = data;
        if (data.email == email) {
          this.emailService.sendOtp(email).subscribe((data:any) => {
            this.otp = data.otp;
            console.log(this.otp);
            this.loading = false;  // Hide spinner after receiving OTP
            this.snackBar.open("OTP sent to your email address : "+email,"close",{duration:3000});
            this.step = 2;  // Move to Step 2 (OTP and new password)
          }, error => {
            this.loading = false;  // Hide spinner on error
            console.error('Error sending OTP', error);
          });
        } else {
          this.snackBar.open("Invalid email!!!","close",{duration:3000});
          this.loading = false;  // Hide spinner if user is not found
        }
      });
    }
  }

  // Step 2: Handle OTP and new password submission
  onOtpSubmit() {
    if (this.otpForm.valid) {
      const otp = this.otpForm.get('otp').value;
     if(otp == this.otp)
     {
       this.user.password = this.otpForm.get('confirmPassword').value;
       console.log(this.user)
        this.loginService.updateUserPassword(this.user).subscribe((data)=>{
          this.snackBar.open("Succesfully password updated!","close",{duration:3000});
          this.router.navigate(['/login'])
        })
     }
     else {
       this.snackBar.open("Invalid OTP!!!","close",{duration:3000});
     }
    }
  }
}
