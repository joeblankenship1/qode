import { Component, OnInit } from '@angular/core';
import { QuotesRetrievalService } from '../../../shared/services/quotes-retrieval.service';
import { Quote } from '../../../shared/models/quote.model';

@Component({
  selector: 'app-retrieved-quotes-list',
  templateUrl: './retrieved-quotes-list.component.html',
  styleUrls: ['./retrieved-quotes-list.component.css']
})
export class RetrievedQuotesComponent implements OnInit {

  public retrievedQuotes: Quote[];

  constructor(private quotesRetrievalService: QuotesRetrievalService) { }

  ngOnInit() {
    this.quotesRetrievalService.getRetrievedQuotes()
    .subscribe( quotes => {
      this.retrievedQuotes = quotes;
    });
  }

}
