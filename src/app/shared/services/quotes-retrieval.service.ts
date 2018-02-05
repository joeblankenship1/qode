import { Injectable } from '@angular/core';
import { Quote } from '../models/quote.model';
import { QuoteService } from './quote.service';
import { Code } from '../models/code.model';
import { Document } from '../models/document.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DocumentService } from './document.service';
import { CodeService } from './code.service';

@Injectable()
export class QuotesRetrievalService {

  private retrivedQuotes: Quote[] = [];
  public retrivedQuotes$ =  new BehaviorSubject<Quote[]>(null);

  private allQuotes: Quote[];

  constructor(private quoteService: QuoteService,
    private documentService: DocumentService,
    private codeService: CodeService) { }

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

  public updateFromActivation() {
    const docs = this.documentService.getActivatedDocuments();
    const codes = this.codeService.getActivatedCodes();
    this.updateRetrievedQuotes(docs, codes);
  }


  getQuotesFromCodes(codes: Code[], quotes: Quote[]) {
    const res = [];
    codes.map( code => {
      quotes.map( quote => {
        if (quote.hasCode(code)) {
          if (!res.includes(quote)) {
            res.push(quote);
          }
        }
      });
    });
    return res;
  }

  getQuotesFromDocuments(documents: Document[], quotes: Quote[]) {
    const res = [];
    documents.map( document => {
      quotes.map( quote => {
        if (document.hasQuote(quote)) {
          if (!res.includes(quote)) {
            res.push(quote);
          }
        }
      });
    });
    return res;
  }

  getQuotesFromDocsCodes(documents: Document[], codes: Code[]) {
    if (!documents || documents.length === 0) {
      return this.getQuotesFromCodes(codes, this.allQuotes);
    } else {
      const temp: Quote[] = this.getQuotesFromDocuments(documents, this.allQuotes);
      if (codes && codes.length > 0) {
        return this.getQuotesFromCodes(codes, temp);
      } else {
        return temp;
      }
    }
  }

}
