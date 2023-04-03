import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { Subject,Observable } from 'rxjs';
import prop from 'prop.json';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService  {
  constructor(private http: HttpClient) { }
  URL: string = 'http://'+prop.base_url;
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));
 
  public connect(): WebSocketSubject<any> {
    this.socket$ = webSocket({
      url: 'ws://'+prop.base_url+'/SictravAdminToolsRest-web/serverStatus',
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

  getCpuUserInfo(id_server:number): Observable<any> {
    let url = this.URL + "/SictravAdminToolsRest-web/rest/serverInfo/"+id_server+"/cpuUsage";
    return this.http.get(url,{responseType: 'json'});
  }
}