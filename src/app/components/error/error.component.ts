import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {

  errorCode:String = '404';

  constructor(private route: ActivatedRoute,
              private location:Location) {
  }
    ngOnInit(): void {
      this.route.data.subscribe(data=>{
        if(data['errorCode']){
          this.errorCode = data['errorCode'];
        }
      })
    }
  goBack(): void {
    window.history.back();
  }

}
