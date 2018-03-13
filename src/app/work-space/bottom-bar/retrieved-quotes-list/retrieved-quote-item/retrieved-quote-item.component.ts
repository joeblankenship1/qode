import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Quote } from '../../../../shared/models/quote.model';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';


@Component({
  selector: 'app-retrieved-quote-item',
  templateUrl: './retrieved-quote-item.component.html',
  styleUrls: ['./retrieved-quote-item.component.css']
})
export class RetrievedQuoteItemComponent implements OnInit {

  @Input() retrievedQuote: Quote;
  @Input() isSelected: boolean;
  @Output() selected = new EventEmitter<void>();

  shown = true;

  constructor() { }

  ngOnInit() {
  }

  onWatchQuote() {
    if (this.retrievedQuote.getDocument().isOpened()) {
      this.selected.emit();
    }
  }
}
