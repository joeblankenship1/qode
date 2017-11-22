import { Quote } from './quote.model';

export class QuoteDisplay {
  private quote: Quote;
  private pages: [{
    page: number;
    startLine: number;
    endLine: number;
  }];
  private column: number;

  constructor(quote: Quote, column?: number) {
    this.quote = quote;
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
        quote: this.quote,
        lines: {
          startLine: page.startLine,
          endLine: page.endLine
        },
        column: this.column
      };
    }
    return undefined;
  }

  public getQuote(): Quote {
    return this.quote;
  }

  public setQuote(quote: Quote) {
    this.quote = quote;
  }

}
