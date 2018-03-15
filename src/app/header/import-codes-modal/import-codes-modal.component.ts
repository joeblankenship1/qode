import { Component, OnInit } from '@angular/core';
import { BSModalContext, Modal } from 'angular2-modal/plugins/bootstrap';
import { CloseGuard, ModalComponent, DialogRef } from 'angular2-modal';
import { CodeService } from '../../shared/services/code.service';
import { ProjectService } from '../../shared/services/project.service';
import { Project } from '../../shared/models/project.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { WorkSpaceService } from '../../shared/services/work-space.service';
import { NotificationsService } from 'angular2-notifications';

export class ImportCodeModalData extends BSModalContext {
  // public code: Code;
}

@Component({
  selector: 'app-import-codes-modal',
  templateUrl: './import-codes-modal.component.html',
  styleUrls: ['./import-codes-modal.component.css']
})
export class ImportCodesModalComponent implements OnInit, CloseGuard, ModalComponent<ImportCodeModalData> {

  private projects: Project[];
  private spinner = false;
  public sortBy = 'name';
  public sortOrder = 'asc';
  public projId = '';
  public actualProject = '';
  // permissions: Array<string>;

  constructor(public dialog: DialogRef<ImportCodeModalData>, private codeService: CodeService,
              private workspaceService: WorkSpaceService, private modal: Modal,
              private notificationsService: NotificationsService,
              private projectService: ProjectService, private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinnerService.getSpinner('projects')
    .subscribe(
    state => {
      this.spinner = state;
    });
    this.spinnerService.setSpinner('projects', true);
    // this.userService.getRolePermissions().subscribe(
    //   permissions => {
    //     this.permissions = permissions;
    //   },
    //   error => { console.error(error); }
    // );
    this.actualProject = this.workspaceService.getProjectId();
    this.projectService.getProjects()
    .subscribe(
    projects => {
      if (projects) {
        this.projects = projects;
        this.spinnerService.setSpinner('projects', false);
      } else {
        this.projects = [];
      }
    },
    error => console.error(error));
  }

  private onImport() {
    this.codeService.importCodes(this.projId).subscribe(
      resp => {
        this.notificationsService.success('Éxito', 'Los códigos se importaron correctamente');
        this.dialog.close();
      },
      error => this.notificationsService.error('Error', error) );
  }

  public onSelectProject(projId) {
    this.projId = projId;
  }

  public onClose() {
    this.dialog.close();
  }

  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return false;
  }

}
