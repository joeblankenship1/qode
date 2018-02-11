import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Document } from '../../../shared/models/document.model';
import { DocumentService } from '../../../shared/services/document.service';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})

export class DocumentListComponent implements OnInit {
  public documents: Document[] = [];
  spinner = false;

  constructor(private documentService: DocumentService,
  private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.documentService.getDocuments()
      .subscribe(
      documents => {
        this.documents = documents;
      },
      error => console.error(error)
      );

    this.spinnerService.getSpinner('document_list')
      .subscribe(
      state => {
        this.spinner = state;
      });
    this.spinnerService.setSpinner('document_list', true);
  }

}
