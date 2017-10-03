import { Document } from './document.model';
import { Page } from './page.model';

export class DocumentContent {
  document: Document;
  pages: Page[];

  constructor(document: Document) {
    this.document = document;
    this.pages = this.createPages(document);
  }

  public createPages(document: Document) {
    return [];
  }

  public getDocumentId() {
    return this.document.getId();
  }

}
