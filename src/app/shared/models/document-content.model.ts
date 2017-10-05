import { Document } from './document.model';
import { Page } from './page.model';
import { Quote } from './quote.model';
import { AppSettings } from '../../app.settings';
import { Line } from './line.model';
import { LineDefinition } from '../helpers/line-definition';
import { QuoteDisplay } from './quote-display';


export class DocumentContent {
  private document: Document;
  private pages: Page[];
  private quotesDisplay: QuoteDisplay[] = [];

  constructor(document: Document) {
    this.document = document;
    this.pages = this.createPages(document);
    if (document.getQuotes().length > 0) {
      this.createQuotesDisplay(document.getQuotes());
      this.setQuoteDisplayOfPage();
    }
  }

  public updatePages(newQuote: Quote) {
  }

  public getDocumentId() {
    return this.document.getId();
  }

  public getPages() {
    return this.pages;
  }

  public getQuotesDisplay() {
    return this.quotesDisplay;
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

  private createQuotesDisplay(quotes: Quote[]) {
    if (quotes) {
      quotes.forEach(quote => {
        let column = -1;
        let success = false;
        while (!success && column <= AppSettings.MAX_COLMNS) {
          column++;
          const pages = quote.getDocumentDisplay();
          success = this.quotesDisplay.find(display => {
            return this.columnIsTaken(pages, column, display);
          }) === undefined;
        }
        if (success) {
          this.quotesDisplay.push(new QuoteDisplay(quote, column));
        }
      });
    }
  }

  private setQuoteDisplayOfPage() {
    this.pages.map(p => {
      const quotes = this.quotesDisplay.filter(q => {
        return q.pageHasQuote(p);
      });
      if (quotes.length > 0) {
        const pageDisplay = quotes.map(q => {
          return q.getLines(p.getId());
        });
        p.setPageDisplay(pageDisplay);
      }
    });

  }

  private columnIsTaken(pages, column, display) {
    let taken = false;
    const list = this.zip(pages, display);
    list.map(item => {
      const p1 = item[0];
      const p2 = item[1];
      if (p2.column === column) {
        taken = this.intersect(p1.startLine, p2.page.startLine, p1.endLine, p2.page.endLine);
      }

    });
    return taken;
  }

  private zip(a, b) {
    const c = [];
    a.map((e, i) => {
      if (e.page === b.pages[i].page) {
        c.push([e, {page: b.pages[i], column: b.column}]);
      }
    });
    return c;
  }

  private intersect(i1, i2, f1, f2) {
    return i2 < f1 && i1 < f2;
  }

}
