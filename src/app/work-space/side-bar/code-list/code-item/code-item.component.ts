import { Component, OnInit, Input } from '@angular/core';
import { Code } from '../../../../shared/models/code.model';

@Component({
  selector: 'app-code-item',
  templateUrl: './code-item.component.html',
  styleUrls: ['./code-item.component.css']
})
export class CodeItemComponent implements OnInit {
  @Input() code: Code;

  constructor() { }

  ngOnInit() {
  }

  onOpenCode() {
    alert("Code open");
  }

}
