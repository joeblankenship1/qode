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
  projectId: string;

  operator: OperatorsEnum;

  documents: Document[] = [];
  codes: Code[] = [];

  constructor(private workspaceService: WorkSpaceService,
  private quotesRetrievalService: QuotesRetrievalService,
  private documentService: DocumentService, private codeService: CodeService ) {
    this.activatedCodes = true;
    this.activatedDocs = true;
  }

  ngOnInit() {
    this.documentService.getDocuments().subscribe( docs => {
      this.documents = docs;
      this.codeService.getCodes().subscribe( codes => {
        this.codes = codes;
      });
      this.projectId = this.workspaceService.getProjectId();
    });
  }

  onFormSubmit(f) {
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
    this.quotesRetrievalService.doSimpleQuery(docs, codes);
    this.workspaceService.setBottomBar(true);
    this.workspaceService.setPopup(false);
  }

  onClose() {
    this.workspaceService.setPopup(false);
  }

}
