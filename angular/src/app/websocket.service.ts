import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
@Injectable()
export class WebsocketService {
  private socket;
  public socketID : string;
  constructor() { 
    this.connect();
  }
  
  private connect() {
    this.socket = io('http://localhost:3000/mynamespace');
    this.socket.on('connect', () => {
      this.socketID = this.socket.id;
    });
  }
  
  public on(url:string) : Observable<any>{
    let That = this;
    return new Observable<any> (observer => {
      this.socket.on(url, (data : any) => observer.next(data));
    });
  }
  
  public emit(url:string,data){
    this.socket.emit(url,data);
  }
}
