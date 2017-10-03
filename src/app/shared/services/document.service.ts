import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Document } from '../models/document.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';
import { Line } from '../models/line.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class DocumentService {

  headers: Headers;
  options: RequestOptions;

  private openedDocuments: Document[] = [];
  private openedDocuments$ = new BehaviorSubject<Document[]>([]);
  private selectedDocument: Document = null;
  private selectedDocument$ = new BehaviorSubject<Document>(null);

  constructor(private http: AuthHttp) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  // Return the actual shown document
  getSelectedDocument() {
    return this.selectedDocument$.asObservable();
  }

  // Set document to be shown
  setSelectedDocument(selectedDocument: Document) {
    this.selectedDocument = selectedDocument;
    this.selectedDocument$.next(selectedDocument);
  }

  // Add new document two list of openedDocuments
  openDocument(doc: Document) {
    if (!this.openedDocuments.includes(doc)) {
      this.openedDocuments.push(doc);
      this.setOpenedDocuments(this.openedDocuments);
    }
    this.setSelectedDocument(doc);
  }

  // Refresh list of opened documents
  setOpenedDocuments(docArray: Document[]) {
    this.openedDocuments = docArray;
    this.openedDocuments$.next(docArray);
  }


  getOpenedDocuments() {
    return this.openedDocuments$.asObservable();
  }

  // Get all documents from server
  getDocuments(): Observable<any> {
    return this.http.get( environment.apiUrl + 'document')
      .map((data: Response) => {
        const extracted = data.json();
        const documentArray: Document[] = [];
        let document: Document;
        if (extracted._items) {
          for (const element of extracted._items) {
            document = new Document(element);
            if (element.lines) {
              const lines = element.lines.map(line =>
                new Line(line.text, line.relatedQuotes, line.predecessorQuotes)
              );
              document.setLines(lines);
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

}
