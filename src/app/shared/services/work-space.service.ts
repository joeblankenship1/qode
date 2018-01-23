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
import { QuoteDisplay } from '../models/quote-display';
import { indexDebugNode } from '@angular/core/src/debug/debug_node';

@Injectable()
export class WorkSpaceService {

  private projectId: string;

  private openedDocuments: Document[] = [];
  public openedDocuments$ = new BehaviorSubject<Document[]>([]);

  private selectedDocument: Document = null;
  public selectedDocument$ = new BehaviorSubject<Document>(null);

  private documentContents: DocumentContent[] = [];
  public documentContents$ = new BehaviorSubject<DocumentContent[]>([]);

  private selectedDocumentContent: DocumentContent;
  public selectedDocumentContent$ = new BehaviorSubject<DocumentContent>(null);
  private selectedDocumentId: string;

  private quotesSelectedDocument: Quote[] = [];
  public quotesSelectedDocument$ = new BehaviorSubject<Quote[]>([]);

  private newSelection: Quote;

  constructor(private documentService: DocumentService, private quoteService: QuoteService) { }

  public initWorkSpace(projectId) {
    this.projectId = projectId;
    this.cleanWorkSpace();
    this.selectedDocumentId = null;
    this.documentService.getDocuments().subscribe(
      documents => {
        documents.forEach(d => {
          if (d.isOpened() && !this.openedDocuments.includes(d)) {
            this.openedDocuments.push(d);
          } else if (!d.isOpened() && this.openedDocuments.includes(d)) {
            const i = this.openedDocuments.indexOf(d);
            this.openedDocuments.splice(i, 1);
          }
          if (this.documentContents.find(dc => d.getId() === dc.getDocumentId()) === undefined) {
            this.documentContents.push(new DocumentContent(d));
          }
        });
        this.setOpenedDocuments(this.openedDocuments);
        this.setDocumentContents(this.documentContents);
        const selectedDoc = this.selectedDocumentId != null ?
          this.openedDocuments.find(d => d.getId() === this.selectedDocumentId) : null;
        this.selectDocument(selectedDoc ? selectedDoc : this.openedDocuments[0]);
      },
      error => console.error(error)
    );
  }


  // Add new document too list of openedDocuments
  openDocument(doc: Document) {
    if (!this.openedDocuments.includes(doc)) {
      this.openedDocuments.push(doc);
      this.openedDocuments$.next(this.openedDocuments);
    }
    this.selectDocument(doc);
  }

  // Remove document from list of openedDocuments
  closeDocument(doc: Document) {
    const i = this.openedDocuments.indexOf(doc);
    this.openedDocuments.splice(i, 1);
    this.openedDocuments$.next(this.openedDocuments);
    if (this.selectedDocument === doc) {
      this.selectDocument(this.openedDocuments[0]);
    }
  }

  // Select a document to show on content
  selectDocument(doc: Document) {
    if (doc) {
      const docContent = this.documentContents.find(dc => doc.getId() === dc.getDocumentId());
      this.setSelectedDocument(doc);
      this.setSelectedDocumentContent(docContent);
      this.setSelectedDocumentQuotes(doc.getQuotes());
    } else {
      this.setSelectedDocument(doc);
      this.setSelectedDocumentContent(undefined);
      this.setSelectedDocumentQuotes([]);
    }
  }

  // Return the actual shown document
  getSelectedDocument() {
    return this.selectedDocument$.asObservable();
  }

  // Set document to be shown
  setSelectedDocument(selectedDocument: Document) {
    this.selectedDocument = selectedDocument;
    this.selectedDocumentId = selectedDocument ? selectedDocument.getId() : '';
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

  // Return id of actual project
  getProjectId() {
    return this.projectId;
  }

  setNewSelection(quote: Quote) {
    this.newSelection = quote;
  }

  removeQuotesInDocumentContent(code) {
    const quotes = this.quotesSelectedDocument;
    quotes.forEach( (q, i) => {
      if (q.getCodes().length === 1 && q.getCodes()[0] === code && q.getMemo() === '') {
        this.quotesSelectedDocument.splice(i, 1);
        this.quotesSelectedDocument$.next(this.quotesSelectedDocument);
      }
    });

    this.documentContents.forEach(doc => {
      const qAux = doc.getQuotesDisplay();
      qAux.forEach( q => {
        if (q.getQuote().getCodes().length === 1 && q.getQuote().getCodes()[0] === code && q.getQuote().getMemo() === '') {
          doc.removeQuote(q.getQuote());
        }
      });
  });
}

  updateDocumentContent() {
    this.selectedDocumentContent.updateDocumentQuotesDisplay();
    this.selectedDocumentContent$.next(this.selectedDocumentContent);
  }

  removeQuoteDocumentContent() {
    this.selectedDocumentContent.createPages();
    this.selectedDocumentContent.updateDocumentQuotesDisplay();
    this.selectedDocumentContent$.next(this.selectedDocumentContent);
  }

  cleanWorkSpace() {
    this.openedDocuments.splice(0);
    this.openedDocuments$.next(this.openedDocuments);
    this.selectedDocument = undefined;
    this.selectedDocument$.next(this.selectedDocument);
    this.selectedDocumentContent = undefined;
    this.selectedDocumentContent$.next(this.selectedDocumentContent);
    this.documentContents.splice(0);
    this.documentContents$.next(this.documentContents);
    this.quotesSelectedDocument.splice(0);
    this.quotesSelectedDocument$.next(this.quotesSelectedDocument);
  }
}
