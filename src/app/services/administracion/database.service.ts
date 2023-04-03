import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { Servidor } from '../../classes/servidor';
import { Observable } from 'rxjs';
import { Schema } from '../../classes/schema';
import { map } from "rxjs/operators";
import prop from 'prop.json';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  //ws
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));
  //rest
  test: Schema;
  URL: string = 'http://'+prop.base_url;
  constructor(private http: HttpClient) { }

  exportarBd(id_server: number): Observable<any> {
    return this.http.get(this.URL + "/SictravAdminToolsRest-web/rest/database/" + id_server + "/backup",{responseType: 'blob', observe: 'response'});
  }

  obtSchemas(id_server: number): Observable<any> {
    return this.http.get(this.URL + "/SictravAdminToolsRest-web/rest/database/" + id_server + "/schemas", { responseType: 'json' }).pipe(
      map((schemas: any[]) => schemas
        .map(schema => schema = new Schema(schema.nombre, schema.fecha, schema.status, schema.activo)))
    );
  }

  eliSchemas(id_server: number,schemaName: String): Observable<any> {
    var txt = this.URL + "/SictravAdminToolsRest-web/rest/database/" + id_server + "/borraschema/" + schemaName;
    return this.http.get(txt, { responseType: 'text' });
  }

  implementSchema(id_server: number,schemaName: String): Observable<any> {
    let url = this.URL + "/SictravAdminToolsRest-web/rest/database/"+ id_server +"/implementarSchema/" + schemaName;
    return this.http.get(url, { responseType: 'text' });
  }

  public uploadFile(id_server: number,fileToUpload: File) {
    const _formData = new FormData();
    _formData.append('uploadedFile', fileToUpload, fileToUpload.name);
    _formData.append('nameFile', fileToUpload.name);
    console.log(fileToUpload.name);
    let url = this.URL + "/SictravAdminToolsRest-web/rest/database/"+id_server+"/import";
    return this.http.post(url, _formData, { responseType: 'text' });
  }



  private extractData(res: Response): any {
    const body = res.json();
    return body || {};
  }


 
  public connect(): WebSocketSubject<any> {
    this.socket$ = webSocket({
      url: 'ws://'+prop.base_url+'/SictravAdminToolsRest-web/endpoint',
      deserializer: e => e.data
    });
    return this.socket$;
  }
  
  sendMessage(msg: string) {
    this.socket$.next(msg);
  }
  close() {
    this.socket$.complete(); 
  }
}