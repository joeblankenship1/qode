import { Document } from './document.model';
import { Page } from './page.model';
import { Quote } from './quote.model';

export class DocumentContent {
  private document: Document;
  private pages: Page[];

  constructor(document: Document) {
    this.document = document;
    this.pages = this.createPages(document);
  }

  public createPages(document: Document) {
    return [];
  }

  public updatePages(newQuote: Quote) {
  }

  public getDocumentId() {
    return this.document.getId();
  }

  public getPages() {
    return this.pages;
  }

}
