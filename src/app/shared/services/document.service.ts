import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Document } from '../models/document.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';
import { Line } from '../models/line.model';


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

  getDocuments(): Observable<any> {
    return this.http.get('http://localhost:5000/document')
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

  getSelectedDocument() {
    return this.selectedDocument$.asObservable();
  }

  setSelectedDocument(selectedDocument: Document) {
    this.selectedDocument = selectedDocument;
    this.selectedDocument$.next(selectedDocument);
  }

  openDocument(doc: Document) {
    if (!this.openedDocuments.includes(doc)) {
      this.openedDocuments.push(doc);
      this.setOpenedDocuments(this.openedDocuments);
    }
    this.setSelectedDocument(doc);
  }

  setOpenedDocuments(docArray: Document[]) {
    this.openedDocuments = docArray;
    this.openedDocuments$.next(docArray);
  }

  getOpenedDocuments() {
    return this.openedDocuments$.asObservable();
  }

  saveDocument(document): Observable<any> {
    const body = JSON.stringify(document);
    return this.http.post('http://localhost:5000/document', body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  private extractData(res: Response) {
    const body = res.json();
    console.log(body);
    return body.data || {};
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
