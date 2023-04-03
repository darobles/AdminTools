import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest,HttpErrorResponse } from '@angular/common/http';

import { TokenStorageService } from '../../services/token-storage.service';
import { Observable,throwError,of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import { LoadingScreenService } from '../../services/loading-screen.service';

const TOKEN_HEADER_KEY = 'Authorization'; //Authorization //x-access-token

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService, private router: Router,private loadingScreenService: LoadingScreenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq).pipe(catchError(x=> this.handleAuthError(x)));;
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
        //navigate /delete cookies or whatever
        this.token.signOut();
        this.loadingScreenService.stopLoading();
        this.router.navigateByUrl(`/authentication/login`);
        // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      //  return throwError(err); // or EMPTY may be appropriate here
    }
    return throwError(err);
}
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];