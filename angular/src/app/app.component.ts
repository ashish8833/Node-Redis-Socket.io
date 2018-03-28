import { Component } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(webSocket: WebsocketService){
    webSocket.on('message-all').subscribe((data:any) => {
      console.log(data);
    });
  }
}
