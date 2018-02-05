import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopupLoaderService } from '../../../shared/services/popup-loader.service';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { OperatorsEnum } from '../../../shared/enums/operators.enum';
import { QuotesRetrievalService } from '../../../shared/services/quotes-retrieval.service';
import { DocumentService } from '../../../shared/services/document.service';
import { CodeService } from '../../../shared/services/code.service';
import { Code } from '../../../shared/models/code.model';
import { Document } from '../../../shared/models/document.model';


@Component({
  selector: 'app-simple-query-editor',
  templateUrl: './simple-query-editor.component.html',
  styleUrls: ['./simple-query-editor.component.css']
})
export class SimpleQueryEditorComponent implements OnInit {

  activatedDocs;
  activatedCodes;
  operAnd;
  operOr;
  operNot;

  operator: OperatorsEnum;

  documents: Document[] = [];
  codes: Code[] = [];

  constructor(private workspaceService: WorkSpaceService,
  private quotesRetrievalService: QuotesRetrievalService,
  private documentService: DocumentService, private codeService: CodeService ) {
    this.activatedCodes = true;
    this.activatedDocs = true;
    this.operAnd = false;
    this.operNot = false;
    this.operOr = true;
  }

  ngOnInit() {
    this.documentService.getDocuments().subscribe( docs => {
      this.documents = docs;
      this.codeService.getCodes().subscribe( codes => {
        this.codes = codes;
      });
    });
  }

  onFormSubmit(f) {
    this.operator = this.getOper();
    let codes: Code[] = this.codes;
    let docs: Document[] = this.documents;
    if (this.activatedCodes && this.activatedDocs) {
      codes = this.codeService.getActivatedCodes();
      docs = this.documentService.getActivatedDocuments();
    } else {
      if (this.activatedCodes && !this.activatedDocs) {
        codes = this.codeService.getActivatedCodes();
      } else {
        if ( !this.activatedCodes && this.activatedDocs) {
          docs = this.documentService.getActivatedDocuments();
        }
      }
    }
  }

  onClose() {
    this.workspaceService.setPopup(false);
  }

  private getOper(): OperatorsEnum {
    if (this.operAnd) {
      this.operator = OperatorsEnum['AND'];
    } else {
      if (this.operOr) {
        this.operator = OperatorsEnum['OR'];
      } else {
        if (this.operNot) {
          this.operator = OperatorsEnum['NOT'];
        }
      }
    }
    return this.operator;
  }

}
