import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Page } from '../../../../../shared/models/page.model';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.css']
})
export class BracketComponent implements OnInit, OnChanges {

  @Input() quotes: [{
    quoteId: string,
    borderTop: boolean,
    borderBottom: boolean,
    column: number
  }];

  public columns = [];


  constructor() { }

  ngOnInit() {   
  }

  ngOnChanges() {
    this.quotes.map(q => {
      
      this.columns[q.column] = q;
    });
  }

  public getQuoteType(quote) {
    let styleClass = 'quote empty';
    if (quote !== undefined) {
      styleClass = 'quote';
      if (quote.borderTop) {
        styleClass = styleClass + ' borderTop-quote ';
      }
      if (quote.borderBottom) {
        styleClass = styleClass + ' borderBottom-quote ';
      }
  
    }
    return styleClass;
  }

}
