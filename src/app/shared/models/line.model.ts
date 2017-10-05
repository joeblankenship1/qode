import { Quote } from './quote.model';

export class Line {
  public text: string;
  public id: number;
  public relatedQuotesIds: [{
    quoteId: string,
    borderTop: boolean,
    borderBottom: boolean,
    column: number;
  }];


  constructor(id: number, text: string, relatedQuotesIds?, borderTopQuotesIds?: string[],
    borderBottomQuotesIds?: string[]) {
    this.id = id;
    this.text = text;
    this.relatedQuotesIds = relatedQuotesIds ? relatedQuotesIds : [];
  }

  public setQuoteId(quote) {
    this.relatedQuotesIds.push(quote);
  }

  public getRelatedQuotes() {
    return this.relatedQuotesIds;
  }
}
