import { Quote } from './quote.model';

export class Line {
  public text: string;
  public id: number;
  public relatedQuotesIds: string[];
  public borderTopQuotesIds: string[];
  public borderBottomQuotesIds: string[];


  constructor(id: number, text: string, relatedQuotesIds?: string[], borderTopQuotesIds?: string[],
    borderBottomQuotesIds?: string[]) {
    this.id = id;
    this.text = text;
    this.relatedQuotesIds = relatedQuotesIds ? relatedQuotesIds : [];
    this.borderTopQuotesIds = borderTopQuotesIds ? borderTopQuotesIds : [];
    this.borderBottomQuotesIds = borderBottomQuotesIds ? borderBottomQuotesIds : [];
  }

  public setQuoteId(quoteId: string) {
    this.relatedQuotesIds.push(quoteId);
  }

  public setBorderTopQuoteId(quoteId: string) {
    this.borderTopQuotesIds.push(quoteId);
  }

  public setBorderBottomQuoteId(quoteId: string) {
    this.borderBottomQuotesIds.push(quoteId);
  }
}
