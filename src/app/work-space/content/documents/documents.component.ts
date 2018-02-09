import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { SpinnerService } from '../../../shared/services/spinner.service';
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
  spinnerDocuments = false;
  spinnerCoding = false;

  constructor(private workspaceService: WorkSpaceService,
    private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinnerService.getSpinner('document')
      .subscribe(
      state => {
        this.spinnerDocuments = state;
      });
    this.spinnerService.setSpinner('document', true);
    this.spinnerService.getSpinner('coding')
    .subscribe(
    state => {
      this.spinnerCoding = state;
    });

    this.workspaceService.getOpenedDocuments()
      .subscribe(
      openedDocuments => {
        this.openedDocuments = openedDocuments;
      });

    this.workspaceService.getSelectedDocument()
      .subscribe(
      selectedDocument => {
        this.selectedDocument = selectedDocument;
      });
  }

  onDocumentSelected(document: Document) {
    this.selectedDocument = document;
    this.workspaceService.selectDocument(document);
  }

  ngOnDestroy() {
  }

}
