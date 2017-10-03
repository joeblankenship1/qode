import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Document } from '../models/document.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';
import { Line } from '../models/line.model';
import { environment } from '../../../environments/environment';
import { Quote } from '../models/quote.model';
import { Memo } from '../models/memo.model';
import { Project } from '../models/project.model';
import { QuoteService } from './quote.service';


@Injectable()
export class DocumentService implements OnInit {

  headers: Headers;
  options: RequestOptions;
  project: Project;

  private documentList: Document[];
  private documentList$ = new BehaviorSubject<Document[]>(null);

  constructor(private http: AuthHttp, private quoteService: QuoteService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  ngOnInit() {
  }

  loadData() {
    this.getDocuments().subscribe(
      docs => this.documentList = docs,
      error => console.error(error)
    );
  }

  // Get all documents from server
  getDocuments(): Observable<any> {
    return this.http.get( environment.apiUrl + `document?where={"project": ${this.project._id}"}`)
      .map((data: Response) => {
        const extracted = data.json();
        const documentArray: Document[] = [];
        let document: Document;
        if (extracted._items) {
          for (const element of extracted._items) {
            document = new Document(element, this.project._id);
            if (element.quotes) {
              this.createQuotes(element.quotes, document);
            }
            if (element.memos) {
              const memos = this.createMemos(element.memos);
              document.setMemos(memos);
            }
            documentArray.push(document);
          }
        }
        return documentArray;
      });
  }

  // Send document to server
  saveDocument(document): Observable<any> {
    const body = JSON.stringify(document);
    return this.http.post( environment.apiUrl + 'document', body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  setDocumentList(documents: Document[]) {
    this.documentList = documents;
    this.documentList$.next(this.documentList);
  }

  getDocumentsList() {
    return this.documentList$.asObservable();
  }

  // Extract document _id form response
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

  private createMemos(memos) {
    return memos.map( memo => new Memo());
  }

  private createQuotes(quotes, document: Document) {
      this.quoteService.getQuoteList().subscribe(
      quoteList => {
          document.setQuotes(quoteList.filter( q => quotes.find( e => e._id === q.getId()) !== undefined ));
      },
      error => console.log(error)
    );
  }

}
