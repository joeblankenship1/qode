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
    return this.http.get( environment.apiUrl + `document?where={"key.project": "${projectId}"}`)
      .map((data: Response) => {
        const extracted = data.json();
        const documentArray: Document[] = [];
        let document: Document;
        if (extracted._items) {
          for (const element of extracted._items) {
            document = new Document(element, projectId);

            if (element.quotes && element.quotes.length > 0) {
              this.createQuotes(element.quotes, document);
            }
            if (element.memos && element.memos.length > 0) {
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
  addDocument(document: Document): Observable<any> {
    const body = document.getMessageBody();
    return this.http.post( environment.apiUrl + 'document', body, this.options)
      .map((data: Response) => {
          const extracted = data.json();
          if (extracted._id) {
            document.setId(extracted._id);
          }
          if (extracted._etag) {
            document.setEtag(extracted._etag);
          }
          this.documentList.push(document);
          this.documentList$.next(this.documentList);
          return document;
      })
      .catch(this.handleErrorObservable);
  }

  public updateDocument(document: Document, fields: any): Observable<any> {
    const updheaders = new Headers({ 'Content-Type': 'application/json', 'If-Match': document.getEtag()});
    const updoptions = new RequestOptions({ headers: updheaders });
    const index = this.documentList.indexOf(document, 0);
    this.documentList[index] = document;
    this.documentList$.next(this.documentList);
    return this.http.patch(environment.apiUrl + 'document/' + document.getId(), fields, updoptions)
      .map((data: Response) => {
        const extracted = data.json();
        if (extracted._id) {
          document.setEtag(extracted._etag);
        }
        this.documentList[index] = document;
        return document;
      });
  }


  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  private createQuotes(quotes, document: Document) {
      this.quoteService.getQuoteList().subscribe(
      quoteList => {
          document.setQuotes(quoteList.filter( q => quotes.find( e => e === q.getId()) !== undefined ));
      },
      error => console.log(error)
    );
  }

}
