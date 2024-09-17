import { StompService } from '@stomp/ng2-stompjs';
import { Injectable } from '@angular/core';
import { StompConfig, StompRService } from '@stomp/ng2-stompjs';
import {Observable, Subject} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket$: WebSocketSubject<any> | any;
  private readonly WS_ENDPOINT = 'ws://localhost:8080/auth/order-notifications';  // Your WebSocket endpoint

  constructor() {
    this.connect();
  }

  // Connect to the WebSocket server
  private connect(): void {
    this.socket$ = webSocket(this.WS_ENDPOINT);

  }

  // Send messages to the WebSocket server
  sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  // Handle incoming messages from WebSocket
  onMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Close WebSocket connection
  close(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
