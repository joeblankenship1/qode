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
    this.createPages();
    if (document.getQuotes().length > 0) {
      this.updateDocumentQuotesDisplay();
    }
  }

  public updateDocumentQuotesDisplay() {
    this.quotesDisplay = [];
    this.createQuotesDisplay(this.document.getQuotes());
    this.setQuoteDisplayOfPage();
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

  // public addQuote(quote: Quote) {
  //   const indxOf = this.document.getQuotes().findIndex( q => {
  //     return q.getId() === quote.getId();
  //   });
  //   if (indxOf !== -1) {
  //     this.document.getQuotes()[indxOf] = quote;
  //   }else {
  //     this.document.getQuotes().push(quote);
  //   }
  //   this.updateDocumentQuotesDisplay();
  // }

  // public removeQuote(quote: Quote) {
  //   const indxOf = this.document.getQuotes().findIndex( q => {
  //     return q.getId() === quote.getId();
  //   });
  //   if (indxOf !== -1) {
  //     this.document.getQuotes().splice(indxOf, 1);
  //   }
  //   this.createPages();
  //   this.updateDocumentQuotesDisplay();
  // }

  public createPages() {
    const quotes = this.document.getQuotes();
    // const pages: Page[] = [];
    this.pages = [];
    let lines: Line[];
    let pageId = 0;
    let page: Page = new Page(pageId);

    lines = LineDefinition.createLines(this.document.text);
    lines.map((line, index) => {
      if (index % AppSettings.PAGE_SIZE === 0 && index !== 0) {
        this.pages.push(page);
        pageId++;
        page = new Page(pageId);
      }
      page.setLine(line);
    });
    this.pages.push(page);
    // return pages;
  }


  private createQuotesDisplay(quotes: Quote[]) {
    if (quotes) {
      quotes.forEach(quote => {
        const column = this.findColumnOfQuote(quote);
        this.quotesDisplay.push(new QuoteDisplay(quote, column));
      });
    }
  }

  private setQuoteDisplayOfPage() {
    this.pages.map(p => {
      const quotes = this.quotesDisplay.filter(q => {
        return q.pageHasQuote(p.getId());
      });
      if (quotes.length > 0) {
        const pageDisplay = quotes.map(q => {
          return q.getLines(p.getId());
        });
        p.setPageDisplay(pageDisplay);
      }
    });

  }

  private columnIsTaken(pages, column, display: QuoteDisplay) {
    let taken = false;
    const list = this.zip(pages, display);
    let iter = 0;
    while (!taken && iter < list.length) {
      const item = list[iter];
      const p1 = item[0];
      const p2 = item[1];
      let i = 0;
      const len = display.getQuote().getCodes().length === 0 ? 1 : display.getQuote().getCodes().length;
      while (!taken && i < len) {
        if (p2.column + i === column) {
          taken = this.intersect(p1.startLine, p2.page.startLine, p1.endLine, p2.page.endLine);
        }
        i++;
      }
      iter++;
    }
    return taken;
  }

  private zip(a, b) {
    const c = [];
    a.map((e, i) => {
      if (b.pages[i] && e.page === b.pages[i].page) {
        c.push([e, { page: b.pages[i], column: b.column }]);
      }
    });
    return c;
  }

  private intersect(i1, i2, f1, f2) {
    return i2 <= f1 && i1 <= f2;
  }

  private findColumnOfQuote(quote: Quote) {
    let column = 0;
    let success = false;
    const len = quote.getCodes().length === 0 ? 1 : quote.getCodes().length;
    while (!success && column <= AppSettings.MAX_COLMNS) {
      const pages = quote.getDocumentDisplay();
      while (!success) {
        let i = 0;
        let iterSuccess = true;
        while (iterSuccess && i < len) {
          iterSuccess = this.quotesDisplay.find(display => {
            return this.columnIsTaken(pages, column + i, display);
          }) === undefined;
          i++;
        }
        success = iterSuccess;
        if (!success) {
          column += i;
        }
      }
    }
    return column;
  }

  // Given a quote it looks for the pages it iterates on the pages which are
  // where the quote is defined. Then each page calls the same function which
  // iterates on the lines.
  public setLinesColor(relatedQuote, column: number, type: boolean) {
    if (relatedQuote) {
      window.getSelection().removeAllRanges();
      let quote: Quote;
      let pages: Page[] = [];
      quote = relatedQuote.quote;
      const position = quote.getPosition();
      const relatedPages = quote.getDocumentDisplay().map(rp => {
        return rp.page;
      });
      pages = this.pages.filter(p => {
        return relatedPages.indexOf(p.getId()) > -1;
      });
      pages.forEach((p, i) => {
        p.setLinesColor(relatedQuote, column, type, i === 0, pages.length - 1 - i === 0);
      });
    }
  }


}
