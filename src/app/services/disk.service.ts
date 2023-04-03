import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, switchAll } from 'rxjs/operators';
import { Subject,Observable } from 'rxjs';
import  prop  from 'prop.json';
 
@Injectable({
  providedIn: 'root'
})
export class DiskService {
  URL: string = 'http://' + prop.base_url;
  constructor(private http: HttpClient) { }

  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));
 
  public connect(): WebSocketSubject<any> {
    this.socket$ = webSocket({
      url: 'ws://'+ prop.base_url +'/SictravAdminToolsRest-web/diskInfo',
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

  
  getDiskInfo(id_server:number): Observable<any> {
    let url = this.URL + "/SictravAdminToolsRest-web/rest/serverInfo/diskUsage/"+id_server;
    return this.http.get(url,{responseType: 'json'});
  }



}