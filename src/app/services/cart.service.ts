import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "./helper";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  public addToCart(cart:any){
    return this.http.put(`${baseURL}/api/users/cart-items`,cart);
  }

  public getCartByUser(userId:String){
    return this.http.get(`${baseURL}/api/carts/users/getByUser/${userId}`);
  }

  public checkProductAvailability(productId:any){
    return this.http.get(`${baseURL}/api/users/cart-items/check-product/${productId}`);
  }

  public getCartItems(userId:string){
    return this.http.get(`${baseURL}/api/users/cart-items/${userId}`);
  }

  increaseQuantity(itemId: number): Observable<any> {
    return this.http.put(`${baseURL}/api/users/cart-items/${itemId}/increase`, {});
  }

  decreaseQuantity(itemId: number): Observable<any> {
    return this.http.put(`${baseURL}/api/users/cart-items/${itemId}/decrease`, {});
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.delete(`${baseURL}/api/users/cart-items/${itemId}`);
  }

  checkout(cartItems: any[]): Observable<any> {
    return this.http.post(`${baseURL}/api/users/cart-items/checkout`, cartItems);
  }

  deleteCartItem(id:any){
    return this.http.delete(`${baseURL}/api/users/cart-items/byCartId/${id}`);
  }
}
