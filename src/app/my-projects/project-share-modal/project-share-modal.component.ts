
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../shared/services/project.service';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';


export class ProjectModalData extends BSModalContext {
  public project: Project;
  public profile;
}

@Component({
  selector: 'app-project-share-modal',
  templateUrl: './project-share-modal.component.html',
  styleUrls: ['./project-share-modal.component.css']
})

export class ProjectShareModalComponent implements OnInit, CloseGuard, ModalComponent<ProjectModalData> {
  context: ProjectModalData;
  project: Project;
  listCols: Array<{ email: string, role: string }>;
  mail = '';
  role = 'Lector';
  submitted = false;
  active = true;
  profile = null;

  constructor(public dialog: DialogRef<ProjectModalData>, private projectService: ProjectService,
    private notificationsService: NotificationsService, private router: Router) {
    dialog.setCloseGuard(this);
    this.context = dialog.context;
    this.project = dialog.context.project;
    this.profile = dialog.context.profile;
    this.listCols = dialog.context.project.collaborators.map(x => Object.assign({}, x));
  }

  ngOnInit() {

  }

  clearForm() {
    this.mail = '';
    this.role = 'Lector';
    this.active = false;
    setTimeout(() => { this.active = true; });
  }

  public onAddEmail() {
    this.submitted = true;
    const newEmail = this.mail;
    const newRole = this.role;
    if (newEmail === '') {
      this.notificationsService.info('Info', 'Debes ingresar un email valido');
      return;
    }
    if (newEmail === this.project.owner) {
      this.notificationsService.info('Info', 'No puedes compartir el proyecto con su creador');
      return;
    }
    if (this.listCols.find(x => x.email === newEmail)) {
      this.notificationsService.info('Info', 'El usuario ya pertenece en la lista de colaboradores');
      return;
    }
    this.listCols.push({ email: newEmail, role: newRole });
    this.clearForm();
  }

  public onRemoveEmail(i) {
    this.listCols.splice(i, 1);
  }

  public onSaveCollaborators() {
    this.projectService.saveCollaborators(this.project, this.listCols).subscribe(
      resp => {
        this.project.collaborators = this.listCols;
        // If the active user is one of the removed mails, removes the project for the list.
        const isOwner = this.project.owner.split('@')[0] === this.profile.nickname;
        const isCol = this.listCols.find(e => e.email.split('@')[0] === this.profile.nickname);
        if (!isOwner && isCol === undefined) {
          this.projectService.removeProject(this.project);
          this.projectService.setSelectedProject(null);
          console.log(this.router.url.includes('workspace'));
          if (this.router.url.includes('workspace')) {
            this.router.navigate(['myprojects']);
          }
        }
        this.dialog.close();
        this.notificationsService.success('Exito', 'Se actualizaron los colaboradores del proyecto');
      },
      error => {
        this.dialog.close(error);
      });
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
