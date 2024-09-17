import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "./helper";

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }


  public sendOtp(email:any){
    return this.http.post(`${baseURL}/auth/send-otp`, email);
  }

  public sendOrderDetails(data:any)
  {
    return this.http.post(`${baseURL}/api/users/email`, data);
  }

}
