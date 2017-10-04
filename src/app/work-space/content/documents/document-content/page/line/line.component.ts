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
  quotes: string[] = [];
  borderTopQuotesIds: string[] = [];
  borderBottomQuotesIds: string[] = [];

  constructor() { }

  ngOnInit() {
    this.borderBottomQuotesIds = this.line.borderBottomQuotesIds;
    this.borderTopQuotesIds = this.line.borderTopQuotesIds;
  }

  ngOnChanges() {
  }

  // Define the css class of the line. If quote starts or ends at the
  // related line, this will show a closing border.
  public getQuoteType(quoteId: string) {
    let styleClass = 'quote ';
    if (this.borderTopQuotesIds.find(q => quoteId === q )) {
      styleClass = styleClass + 'borderTop-quote ';
    }
    if (this.borderBottomQuotesIds.find(q => quoteId === q)) {
      styleClass = styleClass + 'borderBottom-quote ';
    }
    return styleClass;
  }

}
