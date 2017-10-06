import { Quote } from './quote.model';
import { AppSettings } from '../../app.settings';

export class Line {
  public text: string;
  public id: number;
  public relatedQuotesIds: [{
    quoteId: string,
    borderTop: boolean,
    borderBottom: boolean,
    column: number;
  }];
  private brackets = [];


  constructor(id: number, text: string, relatedQuotesIds?, borderTopQuotesIds?: string[],
    borderBottomQuotesIds?: string[]) {
    this.id = id;
    this.text = text;
    this.relatedQuotesIds = relatedQuotesIds ? relatedQuotesIds : [];
  }

  public setQuoteId(quote) {
    this.relatedQuotesIds.push(quote);
  }

  public setRelatedQuotes(quotes) {
    this.relatedQuotesIds = quotes;
  }

  public getRelatedQuotes() {
    return this.relatedQuotesIds;
  }

  public getBrackets() {
    return this.brackets;
  }

  public getLineType() {
    let styleClass = 'text-area white-line';
    if (this.id % AppSettings.PAGE_SIZE === 0) {
     styleClass += 'text-area top-line';
    } else if (this.id % AppSettings.PAGE_SIZE === AppSettings.PAGE_SIZE - 1) {
      styleClass +=  'text-area bottom-line';
    }
    return styleClass;
  }

  public getBracketType(quote: Quote) {
    let styleClass = 'quote-empty';
    const relatedQuote = this.getRelatedQuote(quote);
    if (relatedQuote) {
      styleClass = 'quote';
      if (relatedQuote.borderTop) {
        styleClass = styleClass + ' borderTop-quote ';
      }
      if (relatedQuote.borderBottom) {
        styleClass = styleClass + ' borderBottom-quote ';
      }
    }
    return styleClass;
  }

  private getRelatedQuote(quote: Quote) {
    return this.relatedQuotesIds.find(q => {
      return q.quoteId === quote.getId();
    });
  }

}

