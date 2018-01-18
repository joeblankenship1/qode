import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { DocumentService } from '../../../../shared/services/document.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent implements OnInit, OnDestroy {
  @Input() document: Document;

  constructor(private  workspaceService: WorkSpaceService,
  private documentService: DocumentService) { }


  ngOnInit() {
  }

  onOpenDocument() {
    this.document.setOpened(true);
    this.documentService.updateDocument(this.document, {'opened': true})
    .subscribe(doc => {this.workspaceService.selectDocument(doc); });
  }

  ngOnDestroy() {

  }

}
