import { Component, OnInit, Input } from '@angular/core';
import { Quote } from '../../../../shared/models/quote.model';


@Component({
  selector: 'app-retrieved-quote-item',
  templateUrl: './retrieved-quote-item.component.html',
  styleUrls: ['./retrieved-quote-item.component.css']
})
export class RetrievedQuoteItemComponent implements OnInit {

  @Input() retrievedQuote: Quote;

  constructor() { }

  ngOnInit() {
  }

}
