import { Component, OnInit } from '@angular/core';
import { CodeService } from '../shared/services/code.service';
import { DocumentService } from '../shared/services/document.service';
import { ContextMenuService } from 'ngx-contextmenu';
import { QuoteService } from '../shared/services/quote.service';
import { WorkSpaceService } from '../shared/services/work-space.service';
import { WindowSelection } from '../shared/helpers/window-selection';

@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.css']
})
export class WorkSpaceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
