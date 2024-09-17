import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {WishlistService} from "./wishlist.service";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private dataSubject = new BehaviorSubject<string>('Initial Data');
  data$ = this.dataSubject.asObservable();

  setData(data: string) {
    this.dataSubject.next(data);
  }
}
