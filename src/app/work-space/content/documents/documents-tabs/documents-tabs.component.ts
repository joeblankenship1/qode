import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { DocumentService } from '../../../../shared/services/document.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';

@Component({
  selector: 'app-documents-tabs',
  templateUrl: './documents-tabs.component.html',
  styleUrls: ['./documents-tabs.component.css']
})
export class DocumentsTabsComponent implements OnInit {
  @Input() doc: Document = null;
  @Output() selected = new EventEmitter<void>();
  constructor(private documentService: DocumentService, private workspaceService: WorkSpaceService) { }

  ngOnInit() {
  }

  onSelectDocument() {
    this.selected.emit();
  }

  onCloseDocument() {
    this.doc.setOpened(false);
    this.documentService.updateDocument(this.doc, {'opened': false})
    .subscribe();
  }

}
