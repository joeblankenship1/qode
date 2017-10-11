import { Quote } from './quote.model';
import { AppSettings } from '../../app.settings';

export class Line {
  public text: string;
  public id: number;
  public relatedQuotes: [{
    quote: Quote,
    borderTop: boolean,
    borderBottom: boolean,
    column: number;
  }];


  constructor(id: number, text: string, relatedQuotes?) {
    this.id = id;
    this.text = text;
    this.relatedQuotes = relatedQuotes ? relatedQuotes : [];
  }

  public setQuoteId(quote) {
    this.relatedQuotes.push(quote);
  }

  public setRelatedQuotes(quotes) {
    this.relatedQuotes = quotes;
  }

  public getRelatedQuotes() {
    return this.relatedQuotes;
  }

  public getRelatedQuote(column: number) {
    return this.relatedQuotes.find( q => {
      return q.column === column;
    });
  }

  public getLineType() {
    let styleClass = 'text-area white-line';
    if (this.id === 0) {
     styleClass += 'text-area top-line';
    } else if (this.id === AppSettings.PAGE_SIZE - 1) {
      styleClass +=  'text-area bottom-line';
    }
    return styleClass;
  }

  public getBracketType(column: number) {
    let styleClass = 'quote-empty';
    const relatedQuote = this.getRelatedQuote(column);
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

  public getBracketColor(column: number) {
    const relatedQuote = this.getRelatedQuote(column);
    return relatedQuote ? relatedQuote.quote.getColor() : 'transparent';
  }

}

