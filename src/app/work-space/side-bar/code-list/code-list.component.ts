import { Component, OnInit } from '@angular/core';
import { Code } from '../../../shared/models/code.model';

@Component({
  selector: 'app-code-list',
  templateUrl: './code-list.component.html',
  styleUrls: ['./code-list.component.css']
})
export class CodeListComponent implements OnInit {
  public codes: Code[] = [new Code("cod1","Descricpión"),new Code("cod2","Descricpión 2222")];

  constructor() { }

  ngOnInit() {
  }

}
