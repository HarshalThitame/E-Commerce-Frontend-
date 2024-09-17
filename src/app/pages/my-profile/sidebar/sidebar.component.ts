import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {MatDrawerMode} from "@angular/material/sidenav";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userId: any;
  user: any;
  isSidenavOpened = true; // Sidebar is open by default on larger screens
  sidenavMode:MatDrawerMode = 'side'; // Sidebar mode for larger screens
  isAccountSettingsExpanded = true; // Default expanded state
  isPaymentsExpanded = false; // Default expanded state
  isMyStuffExpanded = false; // Default expanded state


  constructor(private loginService: LoginService,
              private router: Router,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        this.sidenavMode = 'over'; // Use 'over' mode on mobile
        this.isSidenavOpened = false; // Sidebar is closed by default on mobile
      } else {
        this.sidenavMode = 'side'; // Use 'side' mode on larger screens
        this.isSidenavOpened = true; // Sidebar is open by default on larger screens
      }
    });
    this.loginService.getCurrentUser().subscribe(data => {
        this.userId = data.id;
        this.user = data
      },
      error => {
        this.loginService.logout()
      })
  }

  logOut() {
    this.loginService.logout()
    window.location.reload()
  }

  toggleSidenav($event: MouseEvent) {
    this.isSidenavOpened = !this.isSidenavOpened;
  }
  onNavItemClick(event: Event) {
    // Handle navigation item click
    event.stopPropagation(); // Prevent click event from affecting the sidebar toggle
    if (this.sidenavMode === 'over') {
      this.isSidenavOpened = false; // Close the sidebar on mobile after selection
    }
  }
}
