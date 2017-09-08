import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../../shared/models/document.model';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent implements OnInit {
  @Input() document: Document;
  
  constructor() { }

  ngOnInit() {
  }

  onOpenDocument() {
    
  }

}
