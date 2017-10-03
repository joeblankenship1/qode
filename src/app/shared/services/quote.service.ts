import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';


@Injectable()
export class QuoteService {

  headers: Headers;
  options: RequestOptions;

  constructor(private http: AuthHttp) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  // Saves the new quote and returns the db _id.
  saveQuote(quote): Observable<any> {
    const body = JSON.stringify(quote);
    return this.http.post( environment.apiUrl + 'quote' , body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // Extract _id from response.
  private extractData(res: Response) {
    const body = res.json();
    return body._id || {};
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  private handleErrorPromise(error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }

}
