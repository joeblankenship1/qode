import { Injectable } from '@angular/core';
import { Quote } from '../models/quote.model';
import { QuoteService } from './quote.service';
import { Code } from '../models/code.model';
import { Document } from '../models/document.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class QuotesRetrievalService {

  private retrivedQuotes: Quote[] = [];
  public retrivedQuotes$ =  new BehaviorSubject<Quote[]>(null);

  private allQuotes: Quote[];

  constructor(private quoteService: QuoteService) { }

  initQuotesRetrieval() {
    this.quoteService.getQuoteList().subscribe( quotes => {
      this.allQuotes = quotes;
    });
  }

  public setRetrievedQuotes(quotes: Quote[]) {
    this.retrivedQuotes = quotes;
    this.retrivedQuotes$.next(quotes);
  }

  public getRetrievedQuotes() {
    return this.retrivedQuotes$.asObservable();
  }

  public updateRetrievedQuotes(documents: Document[], codes: Code[]) {
    this.setRetrievedQuotes(this.getQuotesFromDocsCodes(documents, codes));
  }


  getQuotesFromCodes(codes: Code[], quotes: Quote[]) {
    return quotes.filter( quote => {
      codes.map( code => {
        return quote.hasCode(code);
      });
    });
  }

  getQuotesFromDocuments(documents: Document[], quotes: Quote[]) {
    return quotes.filter( quote => {
      documents.map( document => {
        return document.hasQuote(quote);
      });
    });
  }

  getQuotesFromDocsCodes(documents: Document[], codes: Code[]) {
    if (documents.length = 0) {
      return this.getQuotesFromCodes(codes, this.allQuotes);
    } else {
      const temp: Quote[] = this.getQuotesFromDocuments(documents, this.allQuotes);
      if (codes.length > 0) {
        return this.getQuotesFromCodes(codes, temp);
      }
    }
  }

}
