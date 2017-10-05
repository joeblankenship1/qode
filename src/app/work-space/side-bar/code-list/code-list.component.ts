import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Code } from '../../../shared/models/code.model';
import { CodeService } from '../../../shared/services/code.service';
import { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../shared/services/project.service';
import { WorkSpaceService } from '../../../shared/services/work-space.service';

@Component({
  selector: 'app-code-list',
  templateUrl: './code-list.component.html',
  styleUrls: ['./code-list.component.css']
})
export class CodeListComponent implements OnInit {
  public codes: Code[] = [];
  public newCodeName = '';
  public projectId: string;

  constructor(private codeService: CodeService, private projectService: ProjectService,
    private workspaceService: WorkSpaceService) { }

  ngOnInit() {
    this.codeService.getCodes()
      .subscribe(
      codes => {
        this.codes = codes;
        this.projectId = this.workspaceService.getProjectId();
      }
      );
  }

  onAddCode() {
    if (this.newCodeName == null || this.newCodeName === '') {
      return;
    }
    this.codeService.addCode(new Code({
      'name': this.newCodeName, 'description': '',
      'project': this.projectId
    }))
      .subscribe(
      resp => {
      },
      error => {
        alert(error);
        console.error(error);
      });
    this.newCodeName = '';
  }
}
