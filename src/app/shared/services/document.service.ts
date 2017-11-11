import { Injectable } from '@angular/core';
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
import { element } from 'protractor';


@Injectable()
export class DocumentService {


  headers: Headers;
  options: RequestOptions;
  projectId: string;

  private documentList: Document[];
  private documentList$ = new BehaviorSubject<Document[]>(null);

  constructor(private http: AuthHttp, private quoteService: QuoteService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' , 'Cache-Control': 'no-cache'});
    this.options = new RequestOptions({ headers: this.headers });
  }


  // Get all documents from server
  loadDocuments(projectId): Observable<Document[]> {
    this.projectId = projectId;
    return this.http.get( environment.apiUrl + `document?where={"project": "${projectId}"}`, this.options)
      .map((data: Response) => {
        const extracted = data.json();
        const documentArray: Document[] = [];
        let document: Document;
        if (extracted._items) {
          for (const element of extracted._items) {
            document = new Document(element, projectId, this.quoteService.getQuotesById(element.quotes));
            // if (element.quotes) {
            //   this.createQuotes(document,element.quotes);
            // }
            if (element.memos) {
              const memos = element.map( memo => new Memo());
              document.setMemos(memos);
            }
            documentArray.push(document);
          }
        }
        this.setDocuments(documentArray);
        return documentArray;
      }, e => console.error(e));
  }

  setDocuments(documents: Document[]) {
    this.documentList = documents;
    this.documentList$.next(this.documentList);
  }

  getDocuments() {
    return this.documentList$.asObservable();
  }

  // Send document to server
  addDocument(document): Observable<any> {
    const body = JSON.stringify(document);
    return this.http.post( environment.apiUrl + 'document', body, this.options)
      .map(res => res.json()._id || {})
      .catch(this.handleErrorObservable);
  }

  updateDocumentQuotes(document: Document): Observable<any> {
    const doc = this.documentList.find(d => d.getId() === document.getId());
    const body = {'quotes': document.getQuotes().map(q => q.getId())};
    this.headers = new Headers({ 'Content-Type': 'application/json' , 'Cache-Control': 'no-cache', 'If-Match': document.getEtag()});
    this.options = new RequestOptions({ headers: this.headers });
    return this.http.patch( environment.apiUrl + 'document/' + document.getId(), body, this.options)
      .map(res => {
        const extracted = res.json();
        if (extracted._etag) {
          document.setEtag(extracted._etag);
        }})
      .catch(this.handleErrorObservable);
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  // private createQuotes(document: Document) {
  //   // document.setQuotes(this.quoteService.quoteList.filter( q => quotes.find( e => e === q.getId()) !== undefined ));
  //   document.setQuotes(this.quoteService.quoteList.filter( q => document.getQuotes().find( e => e.getId() === q.getId()) !== undefined ));
  // }
}
