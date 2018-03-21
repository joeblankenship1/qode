import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import { Quote } from '../models/quote.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Document } from '../models/document.model';
import { Project } from '../models/project.model';
import { ProjectService } from './project.service';
import { Code } from '../models/code.model';
import { CodeService } from './code.service';
import { DocumentService } from './document.service';

@Injectable()
export class QuoteService {

  headers: Headers;
  options: RequestOptions;
  projectId: string;

  quoteList: Quote[];
  quoteList$ = new BehaviorSubject<Quote[]>(null);


  constructor(private http: AuthHttp, private codeService: CodeService) {
    this.headers = new Headers({ 'Cache-Control': 'no-cache' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  // Saves the new quote and returns the db _id.
  addQuote(quote: Quote): Observable<Quote> {
    const body = quote.getMessageBody();
    return this.http.post(environment.apiUrl + 'quote', body, this.options)
      .map(res => {
        const extracted = res.json();
        if (extracted._id) {
          quote.setId(extracted._id);
        }
        if (extracted._etag) {
          quote.setEtag(extracted._etag);
        }
        quote.updateQuoteCount(1);
        this.quoteList.push(quote);
        this.quoteList$.next(this.quoteList);
        return quote;
      })
      .catch(this.handleErrorObservable);
  }

  deleteQuote(quote: Quote): Observable<any> {
    const updheaders = new Headers({ 'If-Match': quote.getEtag() });
    const updoptions = new RequestOptions({ headers: updheaders });
    const index = this.quoteList.findIndex(q => {
      return q.getId() === quote.getId();
    });
    return this.http.delete(environment.apiUrl + 'quote/' + quote.getId(), updoptions)
      .map(res => {
        quote.updateQuoteCount(-1);
        this.quoteList.splice(index, 1);
        this.quoteList$.next(this.quoteList);
      })
      .catch(this.handleErrorObservable);
  }

  getQuotesById(quotes, document: Document): Quote[] {
    const ret = [];
    if (quotes) {
      for (const q of quotes) {
        const foundQuote = this.quoteList.find(el => el.getId() === q);
        if (foundQuote) {
          foundQuote.setDocument(document);
          ret.push(foundQuote);
        }
      }
    }
    return ret;
  }

  getQuoteList() {
    return this.quoteList$.asObservable();
  }

  getQuoteRange() {
    return this.quoteList.length;
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }


  // Load quotes from project
  loadQuotes(projectId: string): Observable<Quote[]> {
    this.projectId = projectId;
    return this.http.get(environment.apiUrl + `quote?where={"project": "${projectId}"}`, this.options).map(
      (data: Response) => {
        const extracted = data.json();
        const quotes = extracted._items.map(q => {
          const qn = new Quote(q.text, q.position.start, q.position.end, q.documentDisplay,
            this.projectId, q._id, q.memo, q.color, q._etag, this.codeService.getCodesById(q.codes));
            qn.initQuoteCount();
            return qn;
        });
        this.setQuoteList(quotes);
        return quotes;
      }).catch((err: Response) => {
        const details = err.json();
        return Observable.throw(details);
      });
  }


  removeCodeFromQuotes(code_id: string) {
    const copy = Object.assign([], this.quoteList);

    copy.forEach( ( q, i) => {
      q.removeCode(code_id);
      if (q.getCodes().length === 0 && q.getMemo() === '') {
        this.quoteList.splice(this.quoteList.indexOf(q), 1);
      }
    });
    this.quoteList$.next(this.quoteList);
  }

  /*removeCodeFromQuotes(code_id: string) {
    let found = false;
    this.quoteList.every((q, i) => {
      const index = q.removeCode(code_id);
      if (index !== -1) {
        found = true;
        const idx = this.quoteList.findIndex(quote => {
        return quote.getId() === q.getId();
        });
        this.quoteList.splice(idx, 1);
        this.quoteList$.next(this.quoteList);
      }
      return true;
    });
    return found;
  }*/

  removeQuoteFromList(quote: Quote) {
    if (this.quoteList.includes(quote)) {
      this.quoteList.splice(this.quoteList.indexOf(quote), 0);
      this.quoteList$.next(this.quoteList);
    }
  }



  setQuoteList(quoteList: Quote[]) {
    this.quoteList = quoteList;
    this.quoteList$.next(quoteList);
  }

  updateQuote(quote: Quote): Observable<any> {
    const updheaders = new Headers({ 'If-Match': quote.getEtag() });
    const updoptions = new RequestOptions({ headers: updheaders });
    const body = quote.getMessageBody();
    const index = this.quoteList.findIndex(q => {
      return q.getId() === quote.getId();
    });
    return this.http.patch(environment.apiUrl + 'quote/' + quote.getId(), body, updoptions)
      .map(res => {
        const extracted = res.json();
        if (extracted._etag) {
          quote.setEtag(extracted._etag);
        }
        this.quoteList[index] = quote;
        this.quoteList$.next(this.quoteList);
        return quote;
      })
      .catch(this.handleErrorObservable);
  }


}
