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
  selected: Document;

  constructor(private workspaceService: WorkSpaceService,
    private documentService: DocumentService, private modal: Modal) { }


  ngOnInit() {
    this.workspaceService.getSelectedDocument()
      .subscribe(
      selectedDocument => {
        this.selected = selectedDocument;
      });
  }

  onOpenDocument() {
    this.document.setOpened(true);
    this.documentService.updateDocument(this.document, { 'opened': true })
      .subscribe(doc => { this.workspaceService.selectDocument(doc); });
  }

  onDeleteDocument() {
    const dialogRef = this.modal.confirm().size('lg').isBlocking(true).showClose(true).keyboard(27)
      .okBtn('Confirmar').okBtnClass('btn btn-info').cancelBtnClass('btn btn-danger')
      .title('Eliminar documento').body(' Seguro que desea eliminar el documento y todas las citas asociadas? ').open();
    dialogRef
      .then(r => {
        r.result
          .then(result => {
            this.documentService.deleteDocument(this.document)
              .subscribe(doc => {
                this.workspaceService.closeDocument(this.document);
              });
          })
          .catch(error =>
            console.log(error)
          );
      });
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
