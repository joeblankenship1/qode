import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
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

export class CodeModalComponent implements OnInit,CloseGuard,ModalComponent<CodeModalData> {
  context: CodeModalData;
  code: Code;

  constructor(public dialog: DialogRef<CodeModalData>, private codeService:CodeService) {
    dialog.setCloseGuard(this);
    this.context = dialog.context;
    this.code = dialog.context.code;
  }

  ngOnInit() {
  }

  public onSaveCode() {
    if (this.code.name === "" ){
      alert("Empty code name");
      return;
    }
    let oper: Observable<any>;
    if (this.code._id === "0"){
      oper = this.codeService.addCode(this.code);
    }else{
      oper  = this.codeService.updateCode(this.code);
    }
    oper.subscribe(
      resp => {
        this.dialog.close();
      },
      error => {
        alert(error);
        console.error(error)}
    )
  }

  public onDeleteCode() {
    this.codeService.deleteCode(this.code).subscribe(
      resp => {
        this.dialog.close();
      },
      error => {
        alert(error);
        console.error(error)});
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
