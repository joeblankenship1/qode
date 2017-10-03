import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Quote } from '../models/quote.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Document } from '../models/document.model';
import { Project } from '../models/project.model';


@Injectable()
export class QuoteService {

  headers: Headers;
  options: RequestOptions;
  project: Project;

  quoteList: Quote[];
  quoteList$ = new BehaviorSubject<Quote[]>([]);

  constructor(private http: AuthHttp) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  loadQuotes() {
    return this.getQuotes().subscribe(
      quotes => {
        this.setQuoteList(quotes.map( q => new Quote(q.text, q.position.start, q.position.end, q.documentDisplay,
        this.project._id, q._id, q.memo)));
      },
      error => console.error(error)
    );
  }

  // Get quotes of a document from server
  getQuotes(): Observable<any> {
    return this.http.get( environment.apiUrl + `quote?where={"project": ${this.project._id}"}`);
  }

  // Saves the new quote and returns the db _id.
  saveQuote(quote): Observable<any> {
    const body = JSON.stringify(quote);
    return this.http.post( environment.apiUrl + 'quote' , body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  setQuoteList(quoteList: Quote[]) {
    this.quoteList = quoteList;
    this.quoteList$.next(quoteList);
  }

  getQuoteList() {
    return this.quoteList$.asObservable();
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
