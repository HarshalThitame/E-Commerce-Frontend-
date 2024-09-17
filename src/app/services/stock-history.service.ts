import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "./helper";
import {StockHistory} from "../model/StockHistory.model";

@Injectable({
  providedIn: 'root'
})
export class StockHistoryService {

  constructor(private http: HttpClient) { }


  public saveHistory(data:StockHistory){
    return this.http.post(`${baseURL}/api/seller/stock-history`, data);
  }

  public getHistoryBySeller(id:number){
    return this.http.get(`${baseURL}/api/seller/stock-history/seller/${id}`);
  }
}
