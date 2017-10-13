import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Code } from '../../../shared/models/code.model';
import { CodeService } from '../../../shared/services/code.service';
import { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../shared/services/project.service';

@Component({
  selector: 'app-code-list',
  templateUrl: './code-list.component.html',
  styleUrls: ['./code-list.component.css']
})
export class CodeListComponent implements OnInit {
  public codes: Code[] = [];
  public newCodeName: string = '';
  private project: Project;

  constructor(private codeService: CodeService, private projectService: ProjectService) { }

  ngOnInit() {
    this.codeService.getCodes()
    .subscribe(
      codes => {
        this.codes = codes;
      }
    );
    this.projectService.getOpenedProject()
      .subscribe(
      project => {
        this.project = project;
      },
      error => console.error(error)
      );
  }

  onAddCode() {
    if (this.newCodeName == null || this.newCodeName === '') {
      return;
    }
    this.codeService.addCode(new Code({'name': this.newCodeName, 'description': '', 'project': this.project._id}))
    .subscribe(
      resp => {
      },
      error => {
        alert(error);
        console.error(error); });
    this.newCodeName = '';
  }
}
