import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { DocumentService } from '../../../../shared/services/document.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from '../../../../shared/services/user.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';

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
    private userService: UserService,
  private spinnerService: SpinnerService) { }

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
    if (this.userService.getRole() !== 'Lector') {
      this.documentService.updateDocument(this.doc, { 'opened': false })
        .subscribe();
    }
    this.documentService.updateOpened(this.doc, false);
  }
}
