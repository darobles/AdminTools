import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Servidor } from '../../classes/servidor';
import { Observable } from 'rxjs';
import prop from 'prop.json';

@Injectable({
  providedIn: 'root'
})
export class SictravService {

  URL: string = 'http://' + prop.base_url;
  constructor(private http: HttpClient) { }



  iniciarSictrav(servidor: number): Observable<any> {
    return this.http.get(this.URL + "/SictravAdminToolsRest-web/rest/sistema/" +servidor  +"/start",{responseType: 'text'});
  }

  stopSictrav(servidor: number): Observable<any> {
    return this.http.get(this.URL + "/SictravAdminToolsRest-web/rest/sistema/" +servidor  +"/stop",{responseType: 'text'});
  }

  reiniciarSictrav(servidor: number): Observable<any> {
    return this.http.get(this.URL + "/SictravAdminToolsRest-web/rest/sistema/" +servidor  +"/restart",{responseType: 'text'});
  }

  expLogSictrav(servidor: number, fec1: string, fec2:string): Observable<any> {
    return this.http.get(this.URL + "/SictravAdminToolsRest-web/rest/sistema/" +servidor  +"/log/"+fec1+"/"+fec2,{responseType: 'blob', observe: 'response'});
  }

  detenerBD(servidor: number): Observable<any> {
    return this.http.get(this.URL + "/SictravAdminToolsRest-web/rest/database/"+servidor +"/stop",{responseType: 'text'});
  }

  iniciarBD(servidor: number): Observable<any> {
    return this.http.get(this.URL + "/SictravAdminToolsRest-web/rest/database/"+servidor +"/start",{responseType: 'text'});
  }

  reiniciarServidor(servidor: number): Observable<any> {
    return this.http.get(this.URL + "/SictravAdminToolsRest-web/rest/configurador/server/"+servidor+"/restart",{responseType: 'text'});
  }

}