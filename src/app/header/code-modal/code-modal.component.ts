import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BSModalContext, Modal } from 'angular2-modal/plugins/bootstrap';
import { Code } from '../../shared/models/code.model';
import { CodeService } from '../../shared/services/code.service';
import { Observable } from 'rxjs/Observable';
import { NotificationsService } from 'angular2-notifications';
import { WorkSpaceService } from '../../shared/services/work-space.service';
import { UserService } from '../../shared/services/user.service';

export class CodeModalData extends BSModalContext {
  public code: Code;
}

@Component({
  selector: 'app-code-modal',
  templateUrl: './code-modal.component.html',
  styleUrls: ['./code-modal.component.css']
})

export class CodeModalComponent implements OnInit, CloseGuard, ModalComponent<CodeModalData> {
  context: CodeModalData;
  code: Code;
  name: string;
  memo: string;
  color: string;
  role: string;

  constructor(public dialog: DialogRef<CodeModalData>, private codeService: CodeService, private workspaceService: WorkSpaceService,
              private modal: Modal, private notificationsService: NotificationsService, private userService: UserService) {
    dialog.setCloseGuard(this);
    this.context = dialog.context;
    this.code = dialog.context.code;
    this.memo = this.code.getMemo();
    this.name = this.code.getName();
    this.color = this.code.getColor();
    this.role = this.userService.getRole();
  }

  ngOnInit() {
  }

  public onSaveCode() {
    if (this.name === '' ) {
      this.notificationsService.error('Error', 'Nombre vacío, debe ingresar un nombre de código');
      return;
    }
    let oper: Observable<any>;
    this.code.setName(this.name);
    this.code.setMemo(this.memo);
    this.code.setColor(this.color);
    if (this.code.getId() === '0') {
      oper = this.codeService.addCode(this.code);
    }else {
      oper  = this.codeService.updateCode(this.code);
    }
    oper.subscribe(
      resp => {
        this.dialog.close();
      },
      error => {
        this.notificationsService.error('Error', error);
        console.error(error); }
    );
  }

  public onDeleteCode() {
    this.codeService.deleteCode(this.code).subscribe(
      resp => {
        this.dialog.close(-1);
        this.workspaceService.removeQuotesInDocumentContent(this.code);
      },
      error => {
        this.notificationsService.error('Error', error);
        console.error(error); });
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
