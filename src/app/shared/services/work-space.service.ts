import { Injectable } from '@angular/core';
import { Document } from '../models/document.model';
import { Quote } from '../models/quote.model';
import { Page } from '../models/page.model';
import { DocumentService } from './document.service';
import { QuoteService } from './quote.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DocumentContent } from '../models/document-content.model';
import { Code } from '../models/code.model';
import { Project } from '../models/project.model';

@Injectable()
export class WorkSpaceService {

  private project: Project;

  private openedDocuments: Document[] = [];
  private openedDocuments$ = new BehaviorSubject<Document[]>([]);

  private selectedDocument: Document = null;
  private selectedDocument$ = new BehaviorSubject<Document>(null);

  private documentContents: DocumentContent[];
  private documentContents$= new BehaviorSubject<DocumentContent[]>([]);

  private selectedDocumentContent: DocumentContent;
  private selectedDocumentContent$ = new BehaviorSubject<DocumentContent>(null);

  private quotesSelectedDocument: Quote[];
  private quotesSelectedDocument$= new BehaviorSubject<Quote[]>([]);

  private codesSelectedDocument: Code[];
  private codesSelectedDocument$ =  new BehaviorSubject<Code[]>([]);

  constructor(private documentService: DocumentService, private quoteService: QuoteService) { }

  loadWorkSpace() {
    this.quoteService.getQuotes().subscribe(
      quotes => {
        this.quoteService.setQuoteList(quotes.map( q => new Quote(q.text, q.position.start, q.position.end, q.documentDisplay,
        this.project._id, q._id, q.memo)));
        this.documentService.getDocuments().subscribe(
          docs => {
            this.documentService.setDocumentList(docs);
            this.initWorkSpace();
          },
          error => console.error(error)
        );
      },
      error => console.error(error)
    );
  }

  // Add new document two list of openedDocuments
  openDocument(doc: Document) {
    if (!this.openedDocuments.includes(doc)) {
      this.openedDocuments.push(doc);
      this.setOpenedDocuments(this.openedDocuments);
    }
    this.setSelectedDocument(doc);
  }

  // Select a document to show on content
  selectDocument(doc: Document) {
    if (this.openedDocuments.includes(doc)) {
      const docContent = this.documentContents.find( dc => doc.getId() === dc.getDocumentId());
      this.setSelectedDocument(doc);
      this.setSelectedDocumentContent(docContent);
      this.setSelectedDocumentQuotes(doc.getQuotes());
    }
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

  // Return content of selected document
  getSelectedDocumentContent() {
    return this.selectedDocumentContent$.asObservable();
  }

  setSelectedDocumentContent(selectedDocumentContent: DocumentContent) {
    this.selectedDocumentContent = selectedDocumentContent;
    this.selectedDocumentContent$.next(selectedDocumentContent);
  }

  // Refresh list of opened documents
  setOpenedDocuments(docArray: Document[]) {
    this.openedDocuments = docArray;
    this.openedDocuments$.next(docArray);
  }

  // Return the list of opened documents
  getOpenedDocuments() {
    return this.openedDocuments$.asObservable();
  }

  // Refresh list of document contents
  setDocumentContents(docContArray: DocumentContent[]) {
    this.documentContents = docContArray;
    this.documentContents$.next(docContArray);
  }

  // Return the list of opened conetnts
  getDocumentContents() {
    return this.documentContents$.asObservable();
  }

    // Refresh quotes of selected doc
    setSelectedDocumentQuotes(quotes: Quote[]) {
      this.quotesSelectedDocument = quotes;
      this.quotesSelectedDocument$.next(quotes);
    }

    // Return quotes of selected doc
    getSelectedDocumentQuotes() {
      return this.quotesSelectedDocument$.asObservable();
    }

    private initWorkSpace() {
      this.documentService.getDocumentsList().subscribe(
        documents => {
          documents.map( d => {
            if (d.isOpened()) {
              this.openedDocuments.push(d);
            }
            this.documentContents.push(new DocumentContent(d));
          });
          this.setOpenedDocuments(this.openedDocuments);
          this.setDocumentContents(this.documentContents);
          this.selectDocument(this.openDocument[0]);
        },
        error => console.error(error)
      );
    }

}
