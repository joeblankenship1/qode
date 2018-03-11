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
    });
  }

  public getLineType() {
    let styleClass = 'text-area white-line';
    if (this.id % AppSettings.PAGE_SIZE === 0) {
      this.relatedQuotes.map ( q => {
        if (q.quote.getDocumentDisplay()[0].startLine !== this.id) {
          q.borderTop = false;
        }
      });
      styleClass += 'text-area top-line';
    } else if (this.id % AppSettings.PAGE_SIZE === AppSettings.PAGE_SIZE - 1) {
      styleClass += 'text-area bottom-line';
      this.relatedQuotes.map ( q => {
        const aux = q.quote.getDocumentDisplay().length;
        if (q.quote.getDocumentDisplay()[aux - 1].endLine !== this.id) {
          q.borderBottom = false;
        }
      });
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
      color = code ? code.getColor() : 'rgb(0,0,0)';
    }
    return color;
  }


  public getBracketTitle(column: number) {
    const relatedQuote = this.getRelatedQuote(column);
    let title = '';
    if (relatedQuote) {
      const code = relatedQuote.quote.getCodes()[column - relatedQuote.column];
      title = code ? code.getName() + '\n\n' + relatedQuote.quote.getMemo() : relatedQuote.quote.getMemo();
    }
    return title;
  }

  // sets the default line color to the line
  public setTextColorQuote(column: number, type: boolean, isFirstLine: boolean,
    isLastLine: boolean) {
    const relatedQuote = this.getRelatedQuote(column);
    // let color = '';
    if (relatedQuote && type) {
      // color = AppSettings.DEFAULT_LINE_COLOR;
      const startPosition = isFirstLine ? relatedQuote.quote.getPosition().start : 0;
      const endPosition = isLastLine ? relatedQuote.quote.getPosition().end : this.text.length;
      this.setTextColor(startPosition, endPosition, isFirstLine, isLastLine, type);
    } else {
      this.preSpanText = '';
      this.spanText = this.text;
      this.postSpanText = '';
      this.background_color =  '';
    }
    /*if (relatedQuote && type) {
      color = AppSettings.DEFAULT_LINE_COLOR;
      this.setTextSpan(relatedQuote.quote.getPosition().start, relatedQuote.quote.getPosition().end,
      relatedQuote.borderTop, relatedQuote.borderBottom, isFirstLine, isLastLine);
    } else {
      this.preSpanText = '';
      this.spanText = this.text;
      this.postSpanText = '';
    }*/
    // this.background_color = color;
  }

  setTextColor(startPosition: number, endPosition: number,
    isFirstLine: boolean, isLastLine: boolean, type: boolean) {

      this.setTextSpan( startPosition, endPosition, isFirstLine, isLastLine);
      this.background_color = type ? AppSettings.DEFAULT_LINE_COLOR : '';

  }

  public getTextColor(column: number) {
    return this.background_color;
  }

  public setDefaultBackgroundColor() {
    this.background_color = AppSettings.DEFAULT_LINE_COLOR;
  }

  public isPainted() {
    return this.background_color !== 'transparent';
  }

  public isMiddle(quote: Quote) {
    const start = quote.getDocumentDisplay()[0].startLine;
    const end = quote.getDocumentDisplay()[quote.getDocumentDisplay().length - 1].endLine;
    const middle = (end - start) / 2;

    return this.id === start + Math.trunc(middle);

  }

  // In order to highlight only the words of the quote, a span must be added to the
  // html code. Therefore the text is divided into 3 parts prespantext, spantext and postspantext.
  private setTextSpan(startPostion: number, endPosition: number,
    isFirstLine: boolean, isLastLine: boolean) {
      this.preSpanText = this.text.substring(0, startPostion);
      this.spanText = this.text.substring(startPostion, endPosition);
      this.postSpanText = this.text.substr(endPosition, this.text.length - this.spanText.length);
    /*if ((borderTop && isFirstLine) || (borderBottom && isLastLine)) {
      if (borderTop && !borderBottom) {
        this.preSpanText = this.text.substring(0, startPostion);
        this.spanText = this.text.substr(startPostion, this.text.length - this.preSpanText.length);
      }

      if (borderBottom && !borderTop) {
        this.spanText = this.text.substring(0, endPosition);
        this.postSpanText = this.text.substr(endPosition, this.text.length - this.spanText.length);
      }

      if (borderTop && borderBottom) {
        this.preSpanText = this.text.substring(0, startPostion);
        this.spanText = this.text.substring(startPostion, endPosition);
        this.postSpanText = this.text.substr(endPosition, this.text.length - this.preSpanText.length);
      }

    }*/
  }


}
