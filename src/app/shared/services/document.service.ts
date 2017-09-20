import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Document } from '../models/document.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';

@Injectable()
export class DocumentService {

  public url : string = 'http://localhost:5000/document'
  // openedDocuments: Observable<Document[]>;
  private openedDocuments: Document[] = [];
  private openedDocuments$ = new BehaviorSubject<Document[]>([]);
  private selectedDocument: Document = null;
  private selectedDocument$ = new BehaviorSubject<Document>(null);

  constructor(private http: Http) {

  }

  getDocuments(): Observable<any> {
    return this.http.get(this.url)
      .map((data: Response) => {
        const extracted = data.json();
        const documentArray: Document[] = [];
        let document;
        if (extracted._items) {
          for (const element of extracted._items) {
            document = new Document(element);
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



}
