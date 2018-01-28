import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { DocumentService } from '../../../../shared/services/document.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-documents-tabs',
  templateUrl: './documents-tabs.component.html',
  styleUrls: ['./documents-tabs.component.css']
})
export class DocumentsTabsComponent implements OnInit {
  @Input() doc: Document = null;
  @Output() selected = new EventEmitter<void>();
  sele: Document = null;

  constructor(private documentService: DocumentService,
    private workspaceService: WorkSpaceService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.workspaceService.getSelectedDocument()
    .subscribe(
    selectedDocument => {
      this.sele = selectedDocument;
    });
  }

  onSelectDocument() {
    // this.spinnerService.show();
    this.selected.emit();
  }

  onCloseDocument() {
    this.doc.setOpened(false);
    this.documentService.updateDocument(this.doc, { 'opened': false })
      .subscribe();
  }
}
