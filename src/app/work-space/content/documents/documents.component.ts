import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../../shared/services/document.service';
import { Document } from '../../../shared/models/document.model';
import { LineService } from '../../../shared/services/line.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  public openedDocuments: Document[] = [];
  public selectedDocument: Document;
  constructor(private documentService: DocumentService, private lineService: LineService) { }

  ngOnInit() {
    this.documentService.getOpenedDocuments()
      .subscribe(
      openedDocuments => {
        this.openedDocuments = openedDocuments;
        this.selectedDocument = openedDocuments[0];
      }
      );

      this.documentService.getSelectedDocument()
      .subscribe(
      selectedDocument => {
        this.selectedDocument = selectedDocument;
      }
      );
  }

  onDocumentSelected(document: Document) {
    this.selectedDocument = document;
  }

}
