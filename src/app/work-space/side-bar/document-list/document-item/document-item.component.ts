import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { DocumentService } from '../../../../shared/services/document.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';
import { DocumentModalComponent } from '../../../../header/document-modal/document-modal.component';
import { overlayConfigFactory } from 'angular2-modal';
import { BSModalContext, Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent implements OnInit, OnDestroy {
  @Input() document: Document;

  constructor(private  workspaceService: WorkSpaceService, private modal: Modal,
  private documentService: DocumentService) { }


  ngOnInit() {
  }

  onOpenDocument() {
    this.document.setOpened(true);
    this.documentService.updateDocument(this.document, {'opened': true})
    .subscribe(doc => {this.workspaceService.selectDocument(doc); });
  }

  onEditDcument() {
    this.modal.open(DocumentModalComponent, overlayConfigFactory({ doc: this.document, mode: 'new' }, BSModalContext ))
    .then((resultPromise) => {
      resultPromise.result.then((result) => { });
    });
  }

  ngOnDestroy() {

  }

}
