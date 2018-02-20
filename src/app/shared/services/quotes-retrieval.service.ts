import { Injectable } from '@angular/core';
import { Quote } from '../models/quote.model';
import { QuoteService } from './quote.service';
import { Code } from '../models/code.model';
import { Document } from '../models/document.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DocumentService } from './document.service';
import { CodeService } from './code.service';
import { OperatorsEnum } from '../enums/operators.enum';
import { Response, Headers, RequestOptions, Http, URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class QuotesRetrievalService {

  headers: Headers;
  options: RequestOptions;
  projectId: string;

  private retrivedQuotes: Quote[] = [];
  public retrivedQuotes$ = new BehaviorSubject<Quote[]>(null);

  private allQuotes: Quote[] = [];
  private documents: Document[] = [];
  private codes: Code[] = [];

  constructor(private http: AuthHttp,
    private quoteService: QuoteService,
    private documentService: DocumentService,
    private codeService: CodeService) {
    this.headers = new Headers({ 'Cache-Control': 'no-cache' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  initQuotesRetrieval() {
    this.quoteService.getQuoteList().subscribe(quotes => {
      this.allQuotes = quotes;
      this.refreshRetrievedQuotes();
      this.documentService.getDocuments().subscribe(docs => {
        this.documents.map( d => {
          if (!docs.includes(d)) {
            this.documents.splice(this.documents.indexOf(d), 1);
          }
        });
        this.refreshRetrievedQuotes();
        this.codeService.getCodes().subscribe(codes => {
          this.codes.map( c => {
            if (!codes.includes(c)) {
              this.codes.splice(this.codes.indexOf(c), 1);
            }
          });
          this.refreshRetrievedQuotes();
        });
      });
    });
  }

  private setRetrievedQuotes(quotes: Quote[]) {
    this.retrivedQuotes = quotes;
    this.retrivedQuotes$.next(quotes);
  }

  addDocument(document: Document) {

    if (!this.documents.includes(document)) {
      this.documents.push(document);
    }
    this.doSimpleQuery(this.documents, this.codes);

  }

  removeDocument(document: Document) {

    this.documents.splice(this.documents.indexOf(document), 0);
    this.doSimpleQuery(this.documents, this.codes);

  }

  addCode(code: Code) {

    if (!this.codes.includes(code)) {
      this.codes.push(code);
    }
    this.doSimpleQuery(this.documents, this.codes);

  }

  removeCode(code: Code) {

    this.codes.splice(this.codes.indexOf(code), 0);
    this.doSimpleQuery(this.documents, this.codes);

  }

  getRetrievedQuotes() {
    return this.retrivedQuotes$.asObservable();
  }

  cleanRetrievedQuotes() {
    this.retrivedQuotes.splice(0);
    this.retrivedQuotes$.next(this.retrivedQuotes);
  }

  refreshRetrievedQuotes() {
    if (this.retrivedQuotes.length > 0) {
      this.doSimpleQuery(this.documents, this.codes);
    }
  }

  doSimpleQuery(documents: Document[], codes: Code[]) {
    let result: Quote[] = [];
    this.documents = documents;
    this.codes = codes;
    result = this.getQuotesFromDocuments(documents, this.allQuotes);
    result = this.getQuotesFromCodes(codes, result);
    this.setRetrievedQuotes(result);
  }

  private getQuotesFromDocuments(documents: Document[], quotes: Quote[]) {
    const res = [];
    documents.map(document => {
      quotes.map(quote => {
        if (document.hasQuote(quote)) {
          if (!res.includes(quote)) {
            res.push(quote);
          }
        }
      });
    });
    return res;
  }

  private getQuotesFromCodes(codes: Code[], quotes: Quote[]) {
    const res = [];
    codes.map(code => {
      quotes.map(quote => {
        if (quote.hasCode(code)) {
          if (!res.includes(quote)) {
            res.push(quote);
          }
        }
      });
    });
    return res;
  }

}
