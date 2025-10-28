import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpEvent, HttpRequest } from '@angular/common/module.d-CnjH8Dlt';
import { HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private user : UserService) { }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  // {
  //   // Get the token from localhost
  //   const token = this.user.getToken();

  //   // If the token is there in the local storage, append it to the url in the header portion
  //   if(token)
  //   {
  //     const clone = req.clone({
  //       headers: req.headers.set('Authorization', 'Bearer '+token)
  //     });
  //     console.log('To be sent for the server : '+JSON.stringify(clone))

  //     return next.handle(clone);
  //   }
  //   return next.handle(req);
  // }

  /*
AuthService handles business logic: login, logout, token storage, session checks.

AuthInterceptor handles transport-level concerns: modifying HTTP requests before they’re sent.

Keeping them separate ensures each class has a single responsibility, making your code easier to maintain, test, and extend.

Interceptor Is registered with Angular’s HTTP_INTERCEPTORS and runs automatically for every HTTP request.

*/

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isPublicEndpoint = req.url.includes('/auth/register') || req.url.includes('/auth/login');

    if (isPublicEndpoint) {
      // Don't attach token for public endpoints
      return next.handle(req);
    }

    const token = this.user.getToken();

    if (token) {
      const clone = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      console.log('To be sent for the server : ' + JSON.stringify(clone));
      return next.handle(clone);
    }

    return next.handle(req);
  }

}



