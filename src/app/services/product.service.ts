import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import baseURL from "./helper";
import {Product} from "../model/products.model";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<any>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private _http: HttpClient) {}

  //getAllProducts
  public getAllProducts(): Observable<Product[]> {
    // @ts-ignore
    return this._http.get(`${baseURL}/api/general/products`);
  }

  public getProductById(id:any): Observable<Product> {
    return this._http.get<Product>(`${baseURL}/api/general/product/${id}`);
  }

  public getProductsByCategory(categoryName:string): Observable<Product[]> {
    const params = new HttpParams().set("categoryName", categoryName);
    return this._http.get<Product[]>(`${baseURL}/api/general/byCategory`,{params});
  }

  public uploadImages(images:any){
    return this._http.post(`${baseURL}/api/seller/products/images`, images);
  }

  public getProductBySeller(id:any){
    return this._http.get<Product>(`${baseURL}/api/seller/products/bySellerId/${id}`);
  }

  public searchProducts(query:any){
     this._http.get(`${baseURL}/api/general/products/search?query=${query}`).subscribe(data=>{
       this.productsSubject.next(data);
     })
  }

  public getProductRatingsAndReviews(id:any){
    return this._http.get(`${baseURL}/api/general/reviews/product/${id}`);
  }

  public submitReview(review:any){
    return this._http.post(`${baseURL}/api/general/reviews`,review);
  }

  public updateReview(review:any){
    console.log(review)
    return this._http.put(`${baseURL}/api/general/reviews`,review);
  }

  public deleteReview(id:any){
    return this._http.delete(`${baseURL}/api/general/reviews/${id}`);
  }

  public getUserRatingsAndReviews(id: any) {
    return this._http.get(`${baseURL}/api/general/reviews/user/${id}`);
  }

  public getIamgesByProductID(id:any){
    return this._http.get(`${baseURL}/api/general/images/${id}`);
  }


  public updateProduct(productId: any, product: any): Observable<Product> {
    return this._http.put<Product>(`${baseURL}/api/users/products/${productId}`, product);
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

}
