import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import baseURL from "./helper";

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient) { }


  public getWishlistByUser(userid: any) {
    return this.http.get(`${baseURL}/api/users/wishlist/user/${userid}`);
  }


  addToWishlist(id: any, product: any) {
    return this.http.post(`${baseURL}/api/users/wishlist/${id}/items`, product);

  }

  removeFromWishlist(item: number) {
    return this.http.delete(`${baseURL}/api/users/wishlist/items/${item}`);
  }

  removeFromWishlistByProductId(wid: number,pid: number) {
    return this.http.delete(`${baseURL}/api/users/wishlist/items/by-wishlist/${wid}/${pid}`);
  }



  // Continue from previous method
  public isProductInWishlistCheck(wishlistId: any, productId: any):Observable<boolean> {
    return this.http.get<boolean>(`${baseURL}/api/users/wishlist/1/product/${productId}`)
  }
}


