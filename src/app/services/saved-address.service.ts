import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "./helper";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SavedAddressService {
  private selectedAddressSource = new BehaviorSubject<any>(null);
  selectedAddress$ = this.selectedAddressSource.asObservable();

  constructor(private _http: HttpClient) {}

  setSelectedAddress(address: any) {
    this.selectedAddressSource.next(address);
  }

  //save address
  public saveAddress(address:any){
    return this._http.post(`${baseURL}/api/user/savedAddress`, address);
  }
  //save address
  public updateAddress(id:any,address:any){
    return this._http.put(`${baseURL}/api/user/savedAddress/${id}`, address);
  }

  public getAdderssByUserId(userId:any){
    return this._http.get(`${baseURL}/api/user/savedAddress/${userId}`);
  }

  public deleteAddress(addressId:any){
    return this._http.delete(`${baseURL}/api/user/savedAddress/${addressId}`);
  }
}
