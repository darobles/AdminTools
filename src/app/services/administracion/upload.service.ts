import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, switchAll } from 'rxjs/operators';
import { Subject,Observable } from 'rxjs';
import prop from 'prop.json';
 
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) { }

  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));
 
  public connect(): WebSocketSubject<any> {
    this.socket$ = webSocket({
      url: 'ws://' + prop.base_url + '/SictravAdminToolsRest-web/upload',
      deserializer: e => e.data
    });
    return this.socket$;
  }
  
  sendMessage(msg: string) {
    this.socket$.next(msg);
  }
  close() {
    if(this.socket$ != undefined)
    {
      this.socket$.complete(); 
    }
  }
}
