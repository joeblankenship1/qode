import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BSModalContext, Modal } from 'angular2-modal/plugins/bootstrap';
import { Code } from '../../shared/models/code.model';
import { CodeService } from '../../shared/services/code.service';
import { Observable } from 'rxjs/Observable';

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

  constructor(public dialog: DialogRef<CodeModalData>, private codeService: CodeService, private modal: Modal) {
    dialog.setCloseGuard(this);
    this.context = dialog.context;
    this.code = dialog.context.code;
    this.memo = this.code.memo;
    this.name = this.code.name;
  }

  ngOnInit() {
  }

  public onSaveCode() {
    if (this.name === '' ) {
      this.modal.alert().headerClass('btn-danger').title('Error').body('Nombre vacío, debe ingresar un nombre de código').open();
      return;
    }
    let oper: Observable<any>;
    this.code.name = this.name;
    this.code.memo = this.memo;
    if (this.code._id === '0') {
      oper = this.codeService.addCode(this.code);
    }else {
      oper  = this.codeService.updateCode(this.code);
    }
    oper.subscribe(
      resp => {
        this.dialog.close();
      },
      error => {
        this.modal.alert().headerClass('btn-danger').title('Error').body(error).open();
        console.error(error); }
    );
  }

  public onDeleteCode() {
    this.codeService.deleteCode(this.code).subscribe(
      resp => {
        this.dialog.close();
      },
      error => {
        this.modal.alert().headerClass('btn-danger').title('Error').body(error).open();
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
