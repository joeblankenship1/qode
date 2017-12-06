import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Document } from '../../../shared/models/document.model';
import { DocumentService } from '../../../shared/services/document.service';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})

export class DocumentListComponent implements OnInit {
  public documents: Document[] = [];

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.documentService.getDocuments()
      .subscribe(
      documents => {
        this.documents = documents;
      },
      error => console.error(error)
      );

  }

}
