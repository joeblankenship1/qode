
import { Component, OnInit } from '@angular/core';
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

  constructor(public dialog: DialogRef<ProjectModalData>, private projectService: ProjectService) {
    dialog.setCloseGuard(this);
    this.context = dialog.context;
    this.project = dialog.context.project;
  }

  ngOnInit() {
  }


  public onSaveCollaborators() {
    // console.log();
  }

  public onDeleteCode() {
    // this.projectService.deleteCode(this.code).subscribe(
    //   resp => {
    //     this.dialog.close();
    //   },
    //   error => {
    //     this.dialog.close(error);
    //     console.error(error)
    //   });
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
