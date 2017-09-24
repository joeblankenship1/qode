import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthHttp {

  constructor(private http: Http, private authsvc: AuthService) { }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    const token = this.authsvc.getToken();
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
     });
    const reqOptions = new RequestOptions({headers: headers});
    return this.http.get(url, reqOptions);
  }

}
