import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { DocumentService } from '../../../shared/services/document.service';
import { Document } from '../../../shared/models/document.model';
import { WorkSpaceService } from '../../../shared/services/work-space.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  public openedDocuments: Document[] = [];
  public selectedDocument: Document;

  constructor(private workspaceService: WorkSpaceService) { }

  ngOnInit() {
    this.workspaceService.getOpenedDocuments()
      .subscribe(
      openedDocuments => {
        this.openedDocuments = openedDocuments;
      }
      );

    this.workspaceService.getSelectedDocument()
      .subscribe(
      selectedDocument => {
        this.selectedDocument = selectedDocument;
      }
      );
  }

  onDocumentSelected(document: Document) {
    this.selectedDocument = document;
    this.workspaceService.selectDocument(document);
  }

  ngOnDestroy() {
  }

}
