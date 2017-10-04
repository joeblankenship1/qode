import { Document } from './document.model';
import { Page } from './page.model';
import { Quote } from './quote.model';
import { AppSettings } from '../../app.settings';
import { Line } from './line.model';
import { LineDefinition } from '../helpers/line-definition';


export class DocumentContent {
  private document: Document;
  private pages: Page[];

  constructor(document: Document) {
    this.document = document;
    this.pages = this.createPages(document);
  }

  public updatePages(newQuote: Quote) {
  }

  public getDocumentId() {
    return this.document.getId();
  }

  public getPages() {
    return this.pages;
  }

  private createPages(document: Document) {
    const quotes = document.getQuotes();
    const pages: Page[] = [];
    let lines: Line[];
    let pageId = 1;
    let page: Page = new Page(pageId);

    lines = LineDefinition.createLines(document.text);
    lines.map((line, index) => {
      if (index % AppSettings.PAGE_SIZE === 0 && index !== 0) {
        pages.push(page);
        pageId++;
        page = new Page(pageId);
      }
      page.setLine(line);
    });
    if (pageId % AppSettings.PAGE_SIZE !== 0) {
      pages.push(page);
    }
    return pages;
  }

}
