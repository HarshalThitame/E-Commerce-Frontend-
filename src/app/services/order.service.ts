import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as http from "node:http";
import baseURL from "./helper";
import {Order} from "../model/Order.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  public saveOrder(order: {}){
    return this.http.post<Order>(`${baseURL}/api/users/orders`, order);
  }

  public saveOrderItems(orderitem:any){
    return this.http.post(`${baseURL}/api/user/order-items`, orderitem);
  }

  public savePayment(payment:any){
    return this.http.post(`${baseURL}/api/general/payments`,payment)
  }

  public getAllOrdersByUser(id:any){
    return this.http.get(`${baseURL}/api/users/orders/user/${id}`);
  }
  public getAllOrdersItemsByUser(id:any){
    return this.http.get(`${baseURL}/api/user/order-items/byUser/${id}`);
  }

  public getOrderItemById(id:any){
    return this.http.get(`${baseURL}/api/user/order-items/byOrder/${id}`);
  }

  public getPaymentByOrderId(id:any){
    return this.http.get(`${baseURL}/api/general/payments/byOrderId/${id}`);
  }
  public updateOrder(order:any){
    return this.http.put(`${baseURL}/api/users/orders/byOrder`, order);
  }

  public saveShippingAddress(shippingAddress:any){
    return this.http.post(`${baseURL}/api/users/shipping-address`,shippingAddress);
  }

  public getShippingAddressByOrderId(id:any){
    return this.http.get(`${baseURL}/api/users/shipping-address/byOrder/${id}`);
  }
}
