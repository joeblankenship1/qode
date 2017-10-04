import { Component, OnInit, Input } from '@angular/core';
import { Page } from '../../../../../shared/models/page.model';
import { Line } from '../../../../../shared/models/line.model';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  @Input() page: Page;
  lines: Line[] = [];


  constructor() { }

  ngOnInit() {
    this.lines = this.page.getLines();
  }

}
