import { Component, OnInit } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CodeModalComponent } from './code-modal/code-modal.component';
import { overlayConfigFactory } from 'angular2-modal';
import { Code } from '../shared/models/code.model';
import { AuthService } from '../shared/services/auth.service';
import { Routes, Router } from '@angular/router';
import { Project } from '../shared/models/project.model';
import { ProjectService } from '../shared/services/project.service';
import { WorkSpaceService } from '../shared/services/work-space.service';

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

  constructor(private authsvc: AuthService, private router: Router, private modal: Modal
    , private workspaceService: WorkSpaceService) {
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

  onNewCode() {
    const newCode = new Code({ name: '', project: this.workspaceService.getProjectId() });
    this.modal.open(CodeModalComponent, overlayConfigFactory({ code: newCode, mode: 'new' }, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => {});
      });
  }

}
