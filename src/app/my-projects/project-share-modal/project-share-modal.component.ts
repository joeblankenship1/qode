
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../shared/services/project.service';


export class ProjectModalData extends BSModalContext {
  public project: Project;
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
  @ViewChild('email') emailRef: ElementRef;
  @ViewChild('role') roleRef: ElementRef;

  constructor(public dialog: DialogRef<ProjectModalData>, private projectService: ProjectService) {
    dialog.setCloseGuard(this);
    this.context = dialog.context;
    this.project = dialog.context.project;
    this.listCols = dialog.context.project.collaborators.map(x => Object.assign({}, x));
  }

  ngOnInit() {

  }

  public onAddEmail() {
    const newEmail = this.emailRef.nativeElement.value;
    const newRole = this.roleRef.nativeElement.value;
    if ( newEmail !== '') {
        this.listCols.push({ email: newEmail, role: newRole });
    }
  }

  public onRemoveEmail( i ) {
    this.listCols.splice(i, 1);
  }

  public onSaveCollaborators() {
    this.projectService.saveCollaborators(this.project, this.listCols).subscribe(
      resp => {
        this.project.collaborators = this.listCols;
        this.dialog.close();
      },
      error => {
        this.dialog.close(error);
        console.error(error);
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
