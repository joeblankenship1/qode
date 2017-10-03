import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';

@Component({
  selector: 'app-documents-tabs',
  templateUrl: './documents-tabs.component.html',
  styleUrls: ['./documents-tabs.component.css']
})
export class DocumentsTabsComponent implements OnInit {
  @Input() document: Document;
  @Output() selected = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onSelectDocument() {
    this.selected.emit();
  }

}
