import { Component, OnInit } from '@angular/core';
import { OperatorsEnum } from '../../../shared/enums/operators.enum';
import { WorkSpaceService } from '../../../shared/services/work-space.service';

@Component({
  selector: 'app-complex-query-editor',
  templateUrl: './complex-query-editor.component.html',
  styleUrls: ['./complex-query-editor.component.css']
})
export class ComplexQueryEditorComponent implements OnInit {

  activatedDocs;
  activatedCodes;
  operator: OperatorsEnum;
  options;
  a;
  oper;

  constructor(private workspaceService: WorkSpaceService ) {
    this.activatedCodes = true;
    this.activatedDocs = true;
    const options = Object.keys(OperatorsEnum);
    this.options = options.slice(options.length / 2);
  }

  ngOnInit() {
  }

  onSetOperator(value: string) {
    this.operator = OperatorsEnum[value];
    console.log(this.operator);
  }

  onFormSubmit(f) {
    console.log(f.adocs);
  }

  onClose() {
    this.workspaceService.setPopup(false);
  }

}
