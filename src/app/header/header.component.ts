import { Component, OnInit } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CodeModalComponent } from './code-modal/code-modal.component';
import { ProjectShareModalComponent } from '../my-projects/project-share-modal/project-share-modal.component';

import { overlayConfigFactory } from 'angular2-modal';
import { Code } from '../shared/models/code.model';
import { AuthService } from '../shared/services/auth.service';
import { Routes, Router } from '@angular/router';
import { Project } from '../shared/models/project.model';
import { ProjectService } from '../shared/services/project.service';
import { WorkSpaceService } from '../shared/services/work-space.service';
import { FileExtraction } from '../shared/helpers/file-extraction';
import { DocumentService } from '../shared/services/document.service';
import { Document } from '../shared/models/document.model';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [Modal]
})
export class HeaderComponent implements OnInit {
  appname = '';
  show: boolean;
  private projectId: string;

  constructor(private authsvc: AuthService, private router: Router, private modal: Modal,
    private workspaceService: WorkSpaceService, private projectService: ProjectService,
    private documentService: DocumentService) {
    this.appname = 'libreQDA';
  }

  ngOnInit() {
    this.authsvc.loggedIn$.subscribe(s => {
      this.show = s;
    });
  }

  logout() {
    this.authsvc.logOut();
  }

  // Get result from input file
  onChange(event) {
    const files = event.srcElement.files;
    for (let index = 0; index < files.length; index++) {
      const f = files[index.toString()];
      const reader: FileReader = new FileReader();
      const fileE = new FileExtraction();
      const name = f.name;
      const type = f.type.split('/')[1];

      reader.onloadend = (e: ProgressEvent) => {
        const a: any = e.target;
        const buffer = a.result;
        fileE.extractText(buffer, type).then(t => {
          this.newFile(name, t);
        });
      };

      if (type === 'plain' || type === 'rtf') {
        reader.readAsText(f);
      } else {
        reader.readAsArrayBuffer(f);
      }
    }
  }

  // Add a new code
  onNewCode() {
    const newCode = new Code({ name: '', project: this.workspaceService.getProjectId() });
    this.modal.open(CodeModalComponent, overlayConfigFactory({ code: newCode, mode: 'new' }, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => {
          if (result != null) {
            this.modal.alert().headerClass('btn-danger').title('Error al guardar').body(result).open();
          }
        });
      });
  }

  // Share the actual project
  onShareProject() {
    const projectId = this.workspaceService.getProjectId();
    this.modal.open(ProjectShareModalComponent, overlayConfigFactory({project: this.projectService.getProject(projectId)}, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => {
          if (result != null) {
            this.modal.alert().headerClass('btn-danger').title('Error al guardar').body(result).open();
          }
        });
      });
  }

  private newFile(name, text) {
    this.documentService.addDocument(new Document({
      name: name,
      text: text,
      opened: true
    }, this.workspaceService.getProjectId()))
      .subscribe();
  }
}
