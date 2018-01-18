import { Component, OnInit } from '@angular/core';
import { CloseGuard, ModalComponent, DialogRef } from 'angular2-modal';
import { BSModalContext, Modal } from 'angular2-modal/plugins/bootstrap';
import { Quote } from '../../shared/models/quote.model';
import { QuoteService } from '../../shared/services/quote.service';
import { CodeService } from '../../shared/services/code.service';
import { Code } from '../../shared/models/code.model';
import { CompleterItem, CompleterData, CompleterService } from 'ng2-completer';
import { Observable } from 'rxjs/Observable';
import { Document } from '../../shared/models/document.model';
import { DocumentService } from '../../shared/services/document.service';
import { NotificationsService } from 'angular2-notifications';

export class QuoteModalData extends BSModalContext {
  public quote: Quote;
  public document: Document;
}

@Component({
  selector: 'app-quotes-modal',
  templateUrl: './quote-modal.component.html',
  styleUrls: ['./quote-modal.component.css']
})
export class QuoteModalComponent implements OnInit, CloseGuard, ModalComponent<QuoteModalData> {

  private context: QuoteModalData;
  private quote: Quote;
  private document: Document;
  protected chosenCode: string;
  protected selectedCodes: Code[];
  protected codes: Code[];
  protected dataService: CompleterData;
  private memo: string;

  constructor(public dialog: DialogRef<QuoteModalData>, private quoteService: QuoteService,
              private codeService: CodeService, private completerService: CompleterService,
              private documentService: DocumentService , private modal: Modal, private notificationsService: NotificationsService) {
    dialog.setCloseGuard(this);
    this.context = dialog.context;
    this.quote = dialog.context.quote;
    this.document = dialog.context.document;
    this.selectedCodes = this.quote.getCodes().slice();
    this.memo = this.quote.getMemo() ? this.quote.getMemo() : '';
    this.codeService.getCodes()
    .subscribe(
      codes => {
        this.codes = codes;
        this.dataService = completerService.local(this.codes, 'name', 'name').descriptionField('memo');
      }
    );
  }

  ngOnInit() {
  }

  public onCodeSelected(selected: CompleterItem) {
    if (selected) {
      this.addCode(selected.originalObject);
    }
  }

  public addCode(code: Code) {
    const index = this.selectedCodes.findIndex( c => c.getName().trim() === code.getName().trim());
    if (index === -1) {
      this.selectedCodes.push(code);
      this.chosenCode = '';
    }
  }

  public onSaveQuote() {
    if (this.memo === '' && this.selectedCodes.length === 0) {
      this.notificationsService.error('Error al guardar', 'Debe ingresar algún código o un memo.');
      return;
    }
    this.quote.setCodes(this.selectedCodes);
    this.quote.setMemo(this.memo);
    if (!this.quote.getId()) {
      this.quoteService.addQuote(this.quote).subscribe(
        resp => {
          this.quote = resp;
          this.document.addQuote(this.quote);
          this.documentService.updateDocumentQuotes(this.document).subscribe(result => {} ,
            error => {
              this.notificationsService.error('Error al guardar', error);
              console.error(error); }
          );
          this.dialog.close(resp);
          },
          error => {
            this.notificationsService.error('Error al guardar', error);
            console.error(error); }
      );
    }else {
      this.quoteService.updateQuote(this.quote).subscribe(
        resp => {
          this.dialog.close(resp);
        },
        error => {
          this.notificationsService.error('Error al guardar', error);
          console.error(error); }
      );
    }
  }

  public onDeleteQuote() {
    this.quoteService.deleteQuote(this.quote).subscribe(
      resp => {
        this.document.removeQuote(this.quote);
        this.documentService.updateDocumentQuotes(this.document).subscribe(result => {} ,
          error => {
            this.notificationsService.error('Error al actualizar documento', error);
            console.error(error); }
        );
        this.dialog.close(-1);
      },
      error => {
        this.notificationsService.error('Error al borrar', error);
        console.error(error); }
    );
  }

  public onRemoveCode(code: Code) {
    const index = this.selectedCodes.indexOf(code);
    if (index !== -1) {
      this.selectedCodes.splice(index, 1);
    }
  }

  public onKeyUp(event) {
    if (event.code === 'Enter' || event.key === 'Enter' || event.keycode === 13) {
      if (this.chosenCode.trim() === '') {
        return;
      }
      const index = this.codes.findIndex( c => this.chosenCode.trim() === c.getName());
      if (index !== -1) {
        this.addCode(this.codes[index]);
        return;
      }
      let code = new Code({
        'name': this.chosenCode.trim(), 'description': '',
        'project': this.document.getProjectId()
      });
      this.codeService.addCode(code).subscribe(
        resp => {
          code = resp;
          this.selectedCodes.push(code);
          this.chosenCode = '';
        },
        error => {
          this.notificationsService.error('Error al guardar', error);
          console.error(error);
        });
    }
  }

  public onClose() {
    this.dialog.close();
  }

  beforeDismiss(): boolean {
    this.document = null;
    return true;
  }

  beforeClose(): boolean {
    this.document = null;
    return false;
  }

}
