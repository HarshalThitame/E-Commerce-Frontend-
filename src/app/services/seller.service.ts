import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "./helper";
import {Product} from "../model/products.model";
import {Observable} from "rxjs";
import {OrderInformationComponent} from "../pages/my-orders/order-information/order-information.component";

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private _http: HttpClient) { }

  public addProduct(product:any){
    return this._http.post(`${baseURL}/api/seller/products`, product);
  }

  public updateProduct(productId: any, product: any): Observable<any> {
    return this._http.put<any>(`${baseURL}/api/seller/products/${productId}`, product);
  }

  public updateProductisPublish(productId: any, product: any): Observable<any> {
    return this._http.put<any>(`${baseURL}/api/seller/products/published/${productId}`, product);
  }

  public updateProductStock( product: any): Observable<Product> {
    return this._http.put<Product>(`${baseURL}/api/seller/products/updateStock`, product);
  }

  public getAllOrderBySeller(id:any){
    return this._http.get(`${baseURL}/api/seller/order-item/bySeller/${id}`);
  }

  public getOrderDetailbyiID(id:any){
    return this._http.get(`${baseURL}/api/seller/order-item/byOrder/${id}`);
  }

  public getOrderItemByProduct(id:any){
    return this._http.get(`${baseURL}/api/seller/order-item/by-product/${id}`);
  }

  public getShippingAddressByOrderId(id:any){
    return this._http.get(`${baseURL}/api/seller/shipping-address/byOrder/${id}`);
  }
  public getPaymentByOrderId(id:any){
    return this._http.get(`${baseURL}/api/seller/payments/byOrderId/${id}`);
  }

  public updateOrder(order:any){
    return this._http.put(`${baseURL}/api/seller/order/byOrder`, order);
  }
  public getProductById(id:any) {
    return this._http.get(`${baseURL}/api/seller/products/${id}`);
  }

  public deleteHighlightById(hId:any){
    return this._http.delete(`${baseURL}/api/seller/highlight/${hId}`);
  }

  public deleteProductById(productId: number) {
    return this._http.delete(`${baseURL}/api/seller/products/${productId}`);
  }

  public getIamgesByProductID(id:any){
    return this._http.get(`${baseURL}/api/seller/images/${id}`);
  }

  public deleteImageById(i: any) {
    return this._http.delete(`${baseURL}/api/seller/images/${i}`);
  }

  public getCategoryById(id:any){
    return this._http.get(`${baseURL}/api/seller/categories/${id}`);
  }

  getSubCategoryById(subSubCategoryId: any) {
   return this._http.get(`${baseURL}/api/seller/categories/sub-category/${subSubCategoryId}`);
  }

  getSubSubCategoryById(id: any) {
    return this._http.get(`${baseURL}/api/seller/categories/sub-sub-category/${id}`);
  }
}
