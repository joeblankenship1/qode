import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../shared/models/document.model';
import { DocumentService } from '../../shared/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Input() documents: Document[] = [];

  constructor() { }

  ngOnInit() {
  }

}
