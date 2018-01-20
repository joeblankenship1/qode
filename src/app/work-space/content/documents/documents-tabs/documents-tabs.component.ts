import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { DocumentService } from '../../../../shared/services/document.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-documents-tabs',
  templateUrl: './documents-tabs.component.html',
  styleUrls: ['./documents-tabs.component.css']
})
export class DocumentsTabsComponent implements OnInit {
  @Input() doc: Document = null;
  @Output() selected = new EventEmitter<void>();
  sele: Document = null;

  constructor(private documentService: DocumentService, private workspaceService: WorkSpaceService) { }

  ngOnInit() {
    this.workspaceService.getSelectedDocument()
    .subscribe(
    selectedDocument => {
      this.sele = selectedDocument;
    });
  }

  onSelectDocument() {
    this.selected.emit();
  }

  onCloseDocument() {
    this.doc.setOpened(false);
    this.documentService.updateDocument(this.doc, { 'opened': false })
      .subscribe();
  }
}
