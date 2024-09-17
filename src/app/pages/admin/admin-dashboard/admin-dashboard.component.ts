import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../../../services/login.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  constructor(private _router: Router, private _loginService: LoginService) {
  }

  ngOnInit(): void {
    this._loginService.getCurrentUser().subscribe((data: any) => {
      console.log(data.userRole);
      if (data.userRole == "ADMIN") {
      } else {
        this._loginService.logout();
      }
    });
  }


  openCreateCategory() {
  this._router.navigate(['/admin/create-category']);
  }
}
