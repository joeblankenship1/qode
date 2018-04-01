import { Component, OnInit, ViewChild } from '@angular/core';
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
import { NotificationsService } from 'angular2-notifications';
import { PopupLoaderService } from '../shared/services/popup-loader.service';
import { SpinnerService } from '../shared/services/spinner.service';
import { UserService } from '../shared/services/user.service';
import { ImportCodesModalComponent } from './import-codes-modal/import-codes-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [Modal]
})
export class HeaderComponent implements OnInit {
  @ViewChild('files') filesVar: any;
  profile;
  appname = '';
  show: boolean;
  permissions: Array<string>;
  private projectId: string;

  constructor(private authsvc: AuthService, private router: Router, private modal: Modal,
    private workspaceService: WorkSpaceService, private projectService: ProjectService,
    private documentService: DocumentService, private notificationsService: NotificationsService,
    private popupLoaderService: PopupLoaderService, private userService: UserService,
    private spinnerService: SpinnerService) {
    this.appname = 'Qode';
  }

  ngOnInit() {
    this.authsvc.loggedIn$.subscribe(s => {
      this.show = s;
    });

    this.authsvc.getProfile().subscribe(
      profile => {
        this.profile = profile;
      },
      error => console.error(error)
    );
    this.userService.getRolePermissions().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      error => { console.error(error); }
    );
  }

  logout() {
    this.authsvc.logOut();
  }

  // Get result from input file
  onChange(event) {
    this.uploadFiles(event).then((array) => {
      this.spinnerService.setSpinner('document', false);
    });
  }

  uploadFiles(event): Promise<any> {
    const promises_array: Array<any> = [];
    this.spinnerService.setSpinner('document', true);
    const srcElement = event.target || event.srcElement;
    const files = srcElement.files;
    for (let index = 0; index < files.length; index++) {
      const that = this;
      promises_array.push(new Promise((resolve, reject) => {
        const f = files[index.toString()];
        const reader: FileReader = new FileReader();
        const fileE = new FileExtraction();
        const name = f.name;
        if (!this.documentService.validateDocName(name)) {
          this.notificationsService.error('Error', 'Ya existe un documento con ese nombre.');
          this.filesVar.nativeElement.value = '';
          reader.abort();
          resolve(false);
          return;
        }
        const type = f.type.split('/')[1];

        reader.onloadend = (e: ProgressEvent) => {
          const a: any = e.target;
          const buffer = a.result;
          fileE.extractText(buffer, type).then(t => {
            this.newFile(name, t);
            resolve(true);
          }).catch(error => {
            console.error(error);
            resolve(false);
            this.notificationsService.error('Error', 'El tipo de archivo no es soportado por el sistema.');
          });
        };

        if (type === 'plain' || type === 'rtf') {
          reader.readAsText(f);
        } else {
          reader.readAsArrayBuffer(f);
        }
      }));
    }
    this.filesVar.nativeElement.value = '';
    return Promise.all(promises_array);
  }


  // Add a new code
  onNewCode() {
    const newCode = new Code({ 'name': '', 'project': this.workspaceService.getProjectId() });
    this.modal.open(CodeModalComponent, overlayConfigFactory({ code: newCode, mode: 'new' }, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => { });
      });
  }

  // Import codes from other project
  onImportCodes() {
    // const newCode = new Code({ 'name': '', 'project': this.workspaceService.getProjectId() });
    this.modal.open(ImportCodesModalComponent, overlayConfigFactory({ mode: 'new' }, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => { });
      });
  }

  // Share the actual project
  onShareProject() {
    const projectId = this.workspaceService.getProjectId();
    this.modal.open(ProjectShareModalComponent,
      overlayConfigFactory({ project: this.projectService.getSelectedProjectItem(), profile: this.profile }, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => {
          if (result != null) {
            this.notificationsService.error('Error', result);
          }
        });
      });
  }

  onSimpleQuery() {
    //this.workspaceService.setBottomBar(true);
    this.workspaceService.setPopup(true, 'SimpleQueryEditor');
  }

  onComplexQuery() {
    this.workspaceService.setPopup(true, 'ComplexQueryEditor');
  }

  private newFile(name, text) {
    this.spinnerService.setSpinner('document', true);
    this.documentService.addDocument(new Document({
      name: name,
      text: text,
      opened: true
    }, this.workspaceService.getProjectId()))
      .subscribe(() => this.spinnerService.setSpinner('document', false));
  }

  onCodeMatrix(cooc: boolean) {
    this.documentService.getCodesDocumentsMatrix(cooc).subscribe(
      resp => {
        resp['cooc'] = cooc;
        this.workspaceService.setMatrixResult(resp);
        this.workspaceService.setPopup(true, 'ChartPopup');
      },
      error => this.notificationsService.error('Error', JSON.parse(error).message) );
  }
}
