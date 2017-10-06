import { Quote } from './quote.model';

export class QuoteDisplay {
  private quoteId: string;
  private pages: [{
    page: number;
    startLine: number;
    endLine: number;
  }];
  private column: number;

  constructor(quote: Quote, column: number) {
    this.quoteId = quote.getId();
    this.pages = quote.getDocumentDisplay();
    this.column = column;
  }

  public pageHasQuote(pageId) {
    return this.pages.filter( p => {
      return p.page === pageId;
    }).length > 0;
  }

  public getLines(pageId) {
    const page = this.pages.find( p => {
      return p.page === pageId;
    });
    if (page) {
      return {
        quoteId: this.quoteId,
        lines: {
          startLine: page.startLine,
          endLine: page.endLine
        },
        column: this.column
      };
    }
    return undefined;
  }

}
