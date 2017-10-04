import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Document } from '../../../shared/models/document.model';
import { DocumentService } from '../../../shared/services/document.service';
import { WorkSpaceService } from '../../../shared/services/work-space.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  public documents: Document[] = [];

  constructor(private workspaceService: WorkSpaceService) { }

  ngOnInit() {
    this.workspaceService.getOpenedDocuments()
    .subscribe(
      documents => {
        this.documents = documents;
      },
      error => console.error(error)
    );

  }

}
