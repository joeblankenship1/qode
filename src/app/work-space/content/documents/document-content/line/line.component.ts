import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Quote } from '../../../../../shared/models/quote.model';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit, OnChanges {

  @Input() text: string;
  @Input() selected = false;
  @Input() quotes: Quote[] = [];
  @Input() predecessorQuotes = [];
  @Input() lineId: number;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

}
