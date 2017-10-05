import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Quote } from '../../../../../../shared/models/quote.model';
import { Line } from '../../../../../../shared/models/line.model';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit, OnChanges {

  @Input() line: Line;
  text: string;
  selected = false;
  quotes: [{
    quoteId: string,
    borderTop: boolean,
    borderBottom: boolean,
    column: number;
  }];

  constructor() { }

  ngOnInit() {
    this.quotes = this.line.getRelatedQuotes();

  }

  ngOnChanges() {
  }

  public getQuoteType(quote) {
    let styleClass = 'quote ';
    if (quote.borderTop) {
      styleClass = styleClass + 'borderTop-quote ';
    }
    if (quote.borderBottom) {
      styleClass = styleClass + 'borderBottom-quote ';
    }
    return styleClass;
  }

}
