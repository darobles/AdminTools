import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import prop from 'prop.json';
 
@Injectable({
  providedIn: 'root'
})
export class LogSictrav {
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));
 
  public connect(): WebSocketSubject<any> {
    this.socket$ = webSocket({
      url: 'ws://'+prop.base_url+'/SictravAdminToolsRest-web/sictravLog',
      deserializer: e => e.data
    });
    return this.socket$;
  }
  
  sendMessage(msg: number) {
    this.socket$.next(msg);
  }
  close() {
    if(this.socket$ != undefined)
    { 
      this.socket$.complete(); 
    }
    
  }
}