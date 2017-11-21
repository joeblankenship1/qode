import { Component, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Code } from '../../../shared/models/code.model';
import { CodeService } from '../../../shared/services/code.service';
import { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../shared/services/project.service';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-code-list',
  templateUrl: './code-list.component.html',
  styleUrls: ['./code-list.component.css']
})
export class CodeListComponent implements OnInit {
  public codes: Code[] = [];
  public newCodeName = '';
  public projectId: string;

  constructor(private codeService: CodeService, private workspaceService: WorkSpaceService, 
              private modal: Modal) { }

  ngOnInit() {
    this.codeService.getCodes()
      .subscribe(
      codes => {
        this.codes = codes;
        this.projectId = this.workspaceService.getProjectId();
      }
      );
      this.projectId = this.workspaceService.getProjectId();
  }

  onAddCode() {
    if (this.newCodeName == null || this.newCodeName === '') {
      return;
    }
    this.codeService.addCode(new Code({
      'name': this.newCodeName, 'description': '',
      'project': this.workspaceService.getProjectId()
    }))
      .subscribe(
      resp => {
      },
      error => {
        this.modal.alert().headerClass('btn-danger').title('Error al guardar').body(error).open();
        console.error(error);
      });
    this.newCodeName = '';
  }
}
