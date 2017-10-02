import { Quote } from './quote.model';

export class Line {
  public text: string;
  public relatedQuotes: Quote[];
  public predecessorQuotes: Quote[];

  constructor(text: string, relatedQuotes?: Quote[], predecessorQuotes?: Quote[]) {
    this.text = text;
    this.relatedQuotes = relatedQuotes ? relatedQuotes : [];
    this.predecessorQuotes = predecessorQuotes ? predecessorQuotes : [];
  }

  public setQuote(quote: Quote) {
    this.relatedQuotes.push(quote);
  }

  public setPredecessorQuote(quote: Quote) {
    this.predecessorQuotes.push(quote);
  }
}
