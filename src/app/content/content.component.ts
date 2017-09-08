import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../shared/models/document.model';
import { DocumentsTabsComponent } from './documents/documents-tabs/documents-tabs.component';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @Input() openedDocuments: Document[] = [];

  public selectedDocument: Document;
  constructor() { }

  ngOnInit() {
  }

  onDocumentSelected(document: Document) {
    this.selectedDocument = document;
  }
}
