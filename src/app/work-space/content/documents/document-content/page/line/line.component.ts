import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Quote } from '../../../../../../shared/models/quote.model';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit, OnChanges {

  @Input() text: string;
  @Input() selected = false;
  @Input() quotes: Quote[] = [];
  @Input() predecessorQuotes: Quote[] = [];
  @Input() borderTopQuotes: Quote[] = [];
  @Input() borderBottomQuotes: Quote[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  // Define the css class of the line. If quote starts or ends at the
  // related line, this will show a closing border.
  public getQuoteType(quote: Quote) {
    let styleClass = 'quote ';
    if (this.borderTopQuotes.find(q => q.isEqual(quote))) {
      styleClass = styleClass + 'borderTop-quote ';
    }
    if (this.borderBottomQuotes.find(q => q.isEqual(quote))) {
      styleClass = styleClass + 'borderBottom-quote ';
    }
    return styleClass;
  }

}
