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
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService  } from 'ng4-loading-spinner';

@Injectable()
export class DocumentService {


  headers: Headers;
  options: RequestOptions;
  projectId: string;

  private documentList: Document[];
  private documentList$ = new BehaviorSubject<Document[]>(null);

  private activatedDocuments: Document[] = [];
  private activatedDocuments$= new BehaviorSubject<Document[]>(null);

  constructor(private http: AuthHttp, private quoteService: QuoteService,  private spinnerService: Ng4LoadingSpinnerService) {
    this.headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    this.options = new RequestOptions({ headers: this.headers });
  }


  // Get all documents from server
  loadDocuments(projectId): Observable<Document[]> {
    this.projectId = projectId;
    return this.http.get(environment.apiUrl + `document?where={"key.project": "${projectId}"}`, this.options)
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
            // if (element.memo) {
            //   document.setMemo(elemmemo);
            // }
            if (element.atributes) {
              document.setAtributes(element.atributes);
            }
            documentArray.push(document);
          }
        }
        this.setDocuments(documentArray);
        return documentArray;
      }).catch((err: Response) => {
        const details = err.json();
        return Observable.throw(details);
      });
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
    return this.http.post(environment.apiUrl + 'document', body, this.options)
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

  updateDocumentQuotes(document: Document): Observable<any> {
    const doc = this.documentList.find(d => d.getId() === document.getId());
    const body = { 'quotes': document.getQuotes().map(q => q.getId()) };
    this.headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'If-Match': document.getEtag() });
    this.options = new RequestOptions({ headers: this.headers });
    return this.http.patch(environment.apiUrl + 'document/' + document.getId(), body, this.options)
      .map(res => {
        const extracted = res.json();
        if (extracted._etag) {
          document.setEtag(extracted._etag);
        }
      })
      .catch(this.handleErrorObservable);
  }

  public updateDocument(document: Document, fields: any): Observable<any> {
    const updheaders = new Headers({ 'Content-Type': 'application/json', 'If-Match': document.getEtag() });
    const updoptions = new RequestOptions({ headers: updheaders });
    const index = this.documentList.indexOf(document, 0);
    return this.http.patch(environment.apiUrl + 'document/' + document.getId(), fields, updoptions)
      .map((data: Response) => {
        const extracted = data.json();
        if (extracted._id) {
          document.setEtag(extracted._etag);
        }
        this.documentList[index] = document;
        this.documentList$.next(this.documentList);
        return document;
      });
  }

  public updateOpened( document: Document, opened: boolean) {
    document.setOpened(opened);
    const index = this.documentList.indexOf(document, 0);
    this.documentList[index] = document;
    this.documentList$.next(this.documentList);
  }

  public updateDocumentAtributes(document: Document): Observable<any> {
    const updheaders = new Headers({ 'Content-Type': 'application/json', 'If-Match': document.getEtag()});
    const updoptions = new RequestOptions({ headers: updheaders });
    const index = this.documentList.indexOf(document, 0);
    return this.http.put(environment.apiUrl + 'document/' + document.getId(), document.getMessageBody(), updoptions)
      .map((data: Response) => {
        const extracted = data.json();
        if (extracted._id) {
          document.setEtag(extracted._etag);
        }
        this.documentList[index] = document;
        this.documentList$.next(this.documentList);
        return document;
      });
  }


  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  public validateDocName(name: string): boolean {
    return (this.documentList.findIndex(d => d.name === name) === -1);
  }

  deleteDocument(doc: Document): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'If-Match': doc.getEtag() });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(environment.apiUrl + 'document/' + doc.getId(), options)
      .map((data: Response) => {
        const indxOf = this.documentList.findIndex(x => x.getId() === doc.getId());
        this.documentList.splice(indxOf, 1);
        this.setDocuments(this.documentList);
        return 'OK';
      }).catch((err: Response) => {
        const details = err.json();
        return Observable.throw(details);
      });
  }

  setActivatedDocuments(documents: Document[]) {
    this.activatedDocuments = documents;
    this.activatedDocuments$.next(documents);
  }

  setActivatedDocument(document: Document) {
    if (this.activatedDocuments.indexOf(document) === -1) {
      this.activatedDocuments.push(document);
      this.activatedDocuments$.next(this.activatedDocuments);
    }
  }

  removeActivatedDocument(document: Document) {
    if (this.activatedDocuments.indexOf(document) > -1) {
      this.activatedDocuments.splice(this.activatedDocuments.indexOf(document), 1);
      this.activatedDocuments$.next(this.activatedDocuments);
    }
  }

  getActivatedDocuments() {
    return this.activatedDocuments$.asObservable();
  }

  // private createQuotes(document: Document) {
  //   // document.setQuotes(this.quoteService.quoteList.filter( q => quotes.find( e => e === q.getId()) !== undefined ));
  //   document.setQuotes(this.quoteService.quoteList.filter( q => document.getQuotes().find( e => e.getId() === q.getId()) !== undefined ));
  // }
}
