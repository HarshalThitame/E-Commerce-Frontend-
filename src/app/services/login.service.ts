import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import baseURL from "./helper";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public loginStatusSubject = new Subject<boolean>();

  constructor(private  http: HttpClient,
              private router: Router,) { }


  //get current user
  public getCurrentUser(){
    let token:any = this.getToken();
    console.log("token from service : "+token);

    return this.http.get<any>(`${baseURL}/auth/current-user`);
  }

  public createUser(user:any){
    return this.http.post<any>(`${baseURL}/auth/signup`, user);
  }


  //generate token
  public generateToken(loginData: any) {

    return this.http.post(`${baseURL}/auth/login`, loginData);
  }

  public loginUser(token: any) {
    localStorage.setItem('token', token);
    console.log("from service userLogin : "+localStorage.getItem('token'));
    // this.loginStatusSubject.next(true);
    return true;
  }

  public updateSeller(seller:any) {
    return this.http.put(`${baseURL}/auth/update`, seller);
  }
  public updateUser(user:any) {
    return this.http.put(`${baseURL}/auth/update`, user);
  }

  public updateUserPassword(user:any) {
    return this.http.put(`${baseURL}/auth/update-password`, user);
  }

  public isLoggedIn() {
    let tokenStr = localStorage.getItem('token');

    if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
      return false;
    } else {
      return true;
    }
  }

  public isUserPresent(email:any){
    return this.http.post<any>(`${baseURL}/auth/is-present`, email);
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // this.router.navigate(['/login']);


    return true;
  }

  //set userDetails
  public setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  //Get user
  public getUser() {
    let userStr = localStorage.getItem('user');

    if (userStr != null) {
      return JSON.parse(userStr);
    } else {
      this.logout();
      return null;
    }
  }


  //get user role

  public getUserRole() {
    let user = this.getUser();
    return user.userRole;
  }


  public getToken() {
    return localStorage.getItem('token');
    }
}
