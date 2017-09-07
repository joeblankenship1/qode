import { Component, OnInit } from '@angular/core';
import { Document } from '../../shared/document.model'

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[];


  constructor() { }

  ngOnInit() {
  }

}
