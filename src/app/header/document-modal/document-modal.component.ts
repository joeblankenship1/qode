import { Component, OnInit } from '@angular/core';
import { BSModalContext, Modal } from 'angular2-modal/plugins/bootstrap';
import { Document } from '../../shared/models/document.model';
import { CloseGuard, ModalComponent, DialogRef } from 'angular2-modal';
import { DocumentService } from '../../shared/services/document.service';
import { NotificationsService } from 'angular2-notifications';

export class DocumentModalData extends BSModalContext {
  public doc: Document;
}

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.css']
})
export class DocumentModalComponent implements OnInit, CloseGuard, ModalComponent<DocumentModalData> {

  context: DocumentModalData;
  doc: Document;
  newKey = '';
  newValue = '';
  memo = '';
  atributes = {};
  atributesList = [];

  constructor(public dialog: DialogRef<DocumentModalData>, private documentService: DocumentService,
    private modal: Modal, private notificationsService: NotificationsService) {
      dialog.setCloseGuard(this);
      this.context = dialog.context;
      this.doc = dialog.context.doc;
      this.memo = this.doc.memo;
      this.atributes = this.doc.getAtributes();
      this.atributesList = [];
      Object.keys(this.atributes).forEach(atr => {
        this.atributesList.push({key: atr, value: this.atributes[atr]});
      });
    }

  ngOnInit() {
  }

  onAddAtribute() {
    if (this.newKey === undefined || this.newKey.trim() === '') {
      this.notificationsService.error('Error', 'Debe ingresar un nombre de atributo');
      return;
    }
    const key = this.newKey.trim();
    if (this.atributesList.findIndex(p => p.key === key) !== -1) {
      this.notificationsService.error('Error', 'Ya existe un atributo con ese nombre');
      return;
    }
    const val = this.newValue === undefined ? '' : this.newValue.trim();
    this.atributesList.push({key: key, value: val});
  }

  onSaveDocument() {
    const newAttrs = {};
    this.atributesList.forEach( p => newAttrs[p.key] = p.value);
    this.doc.atributes = newAttrs;
    const oldMemo = this.doc.memo;
    this.doc.memo = this.memo;
    this.documentService.updateDocumentAtributes(this.doc).subscribe(
      resp => {
        this.dialog.close(this.doc);
      },
      error => {
        this.doc.atributes = this.atributes;
        this.doc.memo = oldMemo;
        this.notificationsService.error('Error', error);
        console.error(error); }
    );
  }

  onRemoveAtribute(atr) {
    const index = this.atributesList.findIndex(a => a.key === atr);
    if (index !== -1) {
      this.atributesList.splice(index, 1);
    }
  }

  public onClose() {
    this.dialog.close();
  }

  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return false;
  }

}
