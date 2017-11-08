import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../shared/services/project.service';
import { ViewEncapsulation } from '@angular/core';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ProjectShareModalComponent } from '../../project-share-modal/project-share-modal.component';
import { overlayConfigFactory } from 'angular2-modal';
import { WorkSpaceService } from '../../../shared/services/work-space.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: '[app-project-item]',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [Modal]
})
export class ProjectItemComponent implements OnInit {
  @Input() project: Project;
  myEmail = '';

  constructor(private projectService: ProjectService, private router: Router, private notificationsService: NotificationsService,
    private modal: Modal, private workspaceService: WorkSpaceService, private authService: AuthService) { }

  ngOnInit() {
    this.myEmail = this.authService.getEmail();
  }

  onUpdateDescription(desc) {
    this.project.description = desc;
    this.projectService.updateProject(this.project)
      .subscribe(
      resp => {
        this.notificationsService.success('Exito', 'Se actualizo la descripcion del proyecto ' + this.project.name);
        this.project._etag = resp._etag;
      },
      error => {
        this.notificationsService.error('Error', 'Error en la actualizacion del proyecto');
      });
  }

  onDeleteProject() {
    const dialogRef = this.modal.confirm().size('lg').isBlocking(true).showClose(true).keyboard(27)
    .okBtn('Confirmar').okBtnClass('btn btn-info').cancelBtnClass('btn btn-danger')
    .title('Eliminar proyecto').body(' Seguro que desea eliminar el proyecto y todos los documentos asociados? ').open();
    dialogRef
    .then( r => {
        r.result
        .then( result => {
          const id = this.project._id;
          const projToDelete = this.projectService.getProject(id);
          this.projectService.deleteProject(projToDelete)
            .subscribe(
            resp => {
              this.notificationsService.success('Exito', 'El proyecto se elimino correctamente');
              this.projectService.removeProject(projToDelete);
            },
            error => {
              this.notificationsService.error('Error', 'Error en el borrado del proyecto');
            });
        })
        .catch( error =>
          console.log(error)
        );
    });
  }

  onAccessProject() {
    this.router.navigate(['workspace', this.project._id]);
  }

  onShareProject() {
    const project = this.workspaceService.getProjectId();
    this.modal.open(ProjectShareModalComponent, overlayConfigFactory({project: this.project}, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => {
          if (result != null) {
            this.modal.alert().headerClass('btn-danger').title('Error al guardar').body(result).open();
          }
        });
      });
  }
}
