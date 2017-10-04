import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';
import { DocumentService } from '../../../../shared/services/document.service';
import { WorkSpaceService } from '../../../../shared/services/work-space.service';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent implements OnInit {
  @Input() document: Document;

  constructor(private  workspaceService: WorkSpaceService) { }


  ngOnInit() {
  }

  onOpenDocument() {
    this.workspaceService.openDocument(this.document);
  }

}
