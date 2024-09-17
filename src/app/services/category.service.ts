import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "./helper";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  public createCategory(category:any){

    return this.http.post(`${baseURL}/api/admin/categories`,category);
  }


  public getCategoryById(id:any){
    return this.http.get(`${baseURL}/api/seller/categories/${id}`);
  }

  public getAllCategories(){
    return this.http.get<any>(`${baseURL}/api/seller/categories`);
  }

  public getAllCategoriesGenral(){
    return this.http.get<any>(`${baseURL}/api/general/all-categories`);
  }

  public getSubCategoriesByCategory(name: any) {
    return this.http.get<any>(`${baseURL}/api/general/sub-categories/${name}`);
  }

  public getSubCategoryById(id: any) {
    return this.http.get<any>(`${baseURL}/api/general/sub-category/${id}`);
  }
}
