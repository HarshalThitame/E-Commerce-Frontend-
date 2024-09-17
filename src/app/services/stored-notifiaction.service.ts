import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoredNotifiactionService {

  private storedNotifications: any[] = [];

  constructor() { }

  addNotification(notification: any): void {
    this.storedNotifications.push(notification);
    // Optionally, save to localStorage or sessionStorage
    localStorage.setItem('notifications', notification);
  }

  getNotifications(): any[] {
    // Load from localStorage or sessionStorage if available
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      this.storedNotifications = JSON.parse(storedNotifications);
      localStorage.removeItem('notifications'); // Clear notifications after retrieving
    }
    return this.storedNotifications;
  }}
