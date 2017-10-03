import { Quote } from './quote.model';

export class Line {
  public text: string;
  public relatedQuotes: Quote[];
  public borderTopQuotes: Quote[];
  public borderBottomQuotes: Quote[];
  public predecessorQuotes: Quote[];

  constructor(text: string, relatedQuotes?: Quote[], predecessorQuotes?: Quote[],
     borderTopQuotes?: Quote[], borderBottomQuotes?: Quote[]) {
    this.text = text;
    this.relatedQuotes = relatedQuotes ? relatedQuotes : [];
    this.predecessorQuotes = predecessorQuotes ? predecessorQuotes : [];
    this.borderTopQuotes = borderTopQuotes ? borderTopQuotes : [];
    this.borderBottomQuotes = borderBottomQuotes ? borderBottomQuotes : [];
  }

  public setQuote(quote: Quote) {
    this.relatedQuotes.push(quote);
  }

  public setPredecessorQuote(quote: Quote) {
    this.predecessorQuotes.push(quote);
  }

  public setBorderTopQuote(quote: Quote) {
    this.borderTopQuotes.push(quote);
  }

  public setBorderBottomQuote(quote: Quote) {
    this.borderBottomQuotes.push(quote);
  }
}
