import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../shared/models/document.model';
import { DocumentsTabsComponent } from './documents/documents-tabs/documents-tabs.component';
import { DocumentService } from '../../shared/services/document.service';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
