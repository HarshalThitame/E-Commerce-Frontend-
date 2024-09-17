import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {NotificationService} from "../../../../services/notification.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginService} from "../../../../services/login.service";

@Component({
  selector: 'app-seller-order-notification',
  templateUrl: './seller-order-notification.component.html',
  styleUrl: './seller-order-notification.component.css'
})
export class SellerOrderNotificationComponent implements OnInit ,OnDestroy {
  notifications: any[] = [];
  private websocketSubscription: Subscription | any;
  seller: any;



  constructor(private websocketService: NotificationService,
              private loginService: LoginService,) {}

  ngOnInit(): void {

    this.loginService.getCurrentUser().subscribe((data:any)=>{
      this.seller = data;
    })
    this.websocketSubscription = this.websocketService.onMessage().subscribe(
      (message: any) => {
        // if(message.product.seller.id == this.seller.id)
        {
          try {
            console.log(message)
            this.notifications.push(message);
            this.showToast(); // Call method to show the toast
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        }
      },
      (err) => {
        console.error('WebSocket error:', err);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }
    this.websocketService.close();
  }

  showToast(): void {
    setTimeout(() => {
      const toasts = document.querySelectorAll('.toast');
      toasts.forEach(toast => {
        (toast as HTMLElement).classList.add('show');
      });
    }, 100); // Delay to ensure toast is added to the DOM before showing
  }

  removeNotification(notification: any): void {
    this.notifications = this.notifications.filter(n => n !== notification);
    // Optionally, hide the toast by removing the 'show' class after a delay
    setTimeout(() => {
      const toasts = document.querySelectorAll('.toast');
      toasts.forEach(toast => {
        (toast as HTMLElement).classList.remove('show');
      });
    }, 500); // Adjust time to match toast duration
  }


}
