import { Component, OnInit, Input, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import { Code } from '../../../../shared/models/code.model';
import { CodeModalComponent, CodeModalData } from '../../../../header/code-modal/code-modal.component';

@Component({
  selector: 'app-code-item',
  templateUrl: './code-item.component.html',
  styleUrls: ['./code-item.component.css'],
  providers: [Modal]
})
export class CodeItemComponent implements OnInit{
  @Input() code: Code;
  
  constructor(private modal: Modal) {
  }
  
  ngOnInit() {
  }

  public onOpenCode() {
    this.modal.open(CodeModalComponent, overlayConfigFactory({ code: this.code, mode: 'new' }, BSModalContext ))
    .then((resultPromise) => {
      resultPromise.result.then((result) => {
        if (result != null){
          this.modal.alert().headerClass("btn-danger").title("Error al guardar").body(result).open();
        }});
    });
  }

}
