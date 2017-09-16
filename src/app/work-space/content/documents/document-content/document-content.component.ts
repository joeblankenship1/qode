import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../../../shared/models/document.model';

@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrls: ['./document-content.component.css']
})
export class DocumentContentComponent implements OnInit {

  @Input() actualDocument: Document;
  
  constructor() { }

  ngOnInit() {
  }

}
