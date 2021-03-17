import { Injectable } from '@angular/core';
import {HttpInterceptor} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor() { }

    intercept(req:any, next:any){

      let tokenizedReq = req.clone({
          setHeaders:{
              Authorization : 'Token '+sessionStorage.getItem('unicorn_auth_token')
          }
      })
        return next.handle(tokenizedReq);
    }
}
