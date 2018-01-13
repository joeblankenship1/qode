import { Quote } from './quote.model';
import { AppSettings } from '../../app.settings';

export class Line {
  public text: string;
  public id: number;
  private relatedQuotes: [{
    quote: Quote,
    borderTop: boolean,
    borderBottom: boolean,
    column: number;
  }];
  public background_color: string;
  public preSpanText = '';
  public spanText = '';
  public postSpanText = '';


  constructor(id: number, text: string, relatedQuotes?) {
    this.id = id;
    this.text = text;
    this.relatedQuotes = relatedQuotes ? relatedQuotes : [];
    this.background_color = 'transparent';
    this.spanText = text;
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
    return this.relatedQuotes.find(q => {
      const len = q.quote.getCodes().length === 0 ? 1 : q.quote.getCodes().length;
      return ((q.column <= column) && ((q.column + len) > column));
      //return q.column === column;
    });
  }

  public getLineType() {
    let styleClass = 'text-area white-line';
    if (this.id === 0) {
      styleClass += 'text-area top-line';
    } else if (this.id === AppSettings.PAGE_SIZE - 1) {
      styleClass += 'text-area bottom-line';
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
    let color = 'transparent';
    if (relatedQuote) {
      const code = relatedQuote.quote.getCodes()[column - relatedQuote.column];
      color = code ? code.getColor() : 'black';
    }
    return color;
  }


  public getBracketTitle(column: number) {
    const relatedQuote = this.getRelatedQuote(column);
    let title = '';
    if (relatedQuote) {
      const code = relatedQuote.quote.getCodes()[column - relatedQuote.column];
      title = code ? code.getName() : '';
    }
    return title;
  }

  public setTextColor(column: number, type: boolean) {
    const relatedQuote = this.getRelatedQuote(column);
    let color = '';
    if (relatedQuote && type) {
      const code = relatedQuote.quote.getCodes()[column - relatedQuote.column];
      color = code ? code.getColor() : 'transparent';
      this.setTextSpan(relatedQuote);
    } else {
      this.preSpanText = '';
      this.spanText = this.text;
      this.postSpanText = '';
    }
    this.background_color = color;
    
  }

  public getTextColor(column: number) {
    return this.background_color;
  }

  public isPainted() {
    return this.background_color !== 'transparent';
  }

  private setTextSpan(relatedQuote) {
    if (relatedQuote.borderTop || relatedQuote.borderBottom) {
      let quote: Quote;
      quote = relatedQuote.quote;

      if (relatedQuote.borderTop && !relatedQuote.borderBottom) {
        const start = quote.getPosition().start;
        this.preSpanText = this.text.substring(0, start);
        this.spanText = this.text.substr(start, this.text.length - this.preSpanText.length);
      }

      if (relatedQuote.borderBottom && !relatedQuote.borderTop) {
        const end = quote.getPosition().end;
        this.spanText = this.text.substring(0, end);
        this.postSpanText = this.text.substr(end, this.text.length - this.preSpanText.length);
      }

      if (relatedQuote.borderTop && relatedQuote.borderBottom) {
        const start = quote.getPosition().start;
        const end = quote.getPosition().end;
        this.preSpanText = this.text.substring(0, start);
        this.spanText = this.text.substring(start, end);
        this.postSpanText = this.text.substr(end, this.text.length - this.preSpanText.length)
      }

    }
  }

}

