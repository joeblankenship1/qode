import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Quote } from '../models/quote.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Document } from '../models/document.model';
import { Project } from '../models/project.model';
import { ProjectService } from './project.service';


@Injectable()
export class QuoteService {

  headers: Headers;
  options: RequestOptions;
  projectId: string;

  quoteList: Quote[];
  quoteList$ = new BehaviorSubject<Quote[]>([]);

  constructor(private http: AuthHttp) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  setQuoteList(quoteList: Quote[]) {
    this.quoteList = quoteList;
    this.quoteList$.next(quoteList);
  }

  getQuoteList() {
    return this.quoteList$.asObservable();
  }

  // Load quotes from project
  loadQuotes(projectId: string): Observable<Quote[]> {
    this.projectId = projectId;
    return this.http.get(environment.apiUrl + `quote?where={"project": ${projectId}"}`).map(
      (data: Response) => {
        const extracted = data.json();
        const quotes = extracted._items.map( q => new Quote(q.text, q.position.start, q.position.end, q.documentDisplay,
          projectId, q._id, q.memo));
        this.setQuoteList(quotes);
        return quotes;
      },
      error => console.error(error)
    );
  }

  // Saves the new quote and returns the db _id.
  addQuote(quote): Observable<any> {
    const body = JSON.stringify(quote);
    return this.http.post( environment.apiUrl + 'quote' , body, this.options)
      .map(res => res.json()._id || {})
      .catch(this.handleErrorObservable);
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

}
