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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatePipe } from '@angular/common';

@Component({
  selector: '[app-project-item]',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [Modal, DatePipe]
})
export class ProjectItemComponent implements OnInit {
  @Input() project: Project;
  public myNick = '';
  public myNick$ = new BehaviorSubject<string>('');

  constructor(private projectService: ProjectService, private router: Router, private notificationsService: NotificationsService,
    private modal: Modal, private workspaceService: WorkSpaceService, private authService: AuthService, private datePipe: DatePipe,
    ) { }

  ngOnInit() {

    this.authService.getEmail().subscribe(
      nick => {
        this.myNick = nick;
      },
      error => console.error(error)
    );
  }

  onDeleteProject() {
    const dialogRef = this.modal.confirm().size('lg').isBlocking(true).showClose(true).keyboard(27)
      .okBtn('Confirmar').okBtnClass('btn btn-info').cancelBtnClass('btn btn-danger')
      .title('Eliminar proyecto').body(' ¿Seguro que desea eliminar el proyecto y todos los documentos asociados? ').open();
    dialogRef
      .then(r => {
        r.result
          .then(result => {
            const id = this.project._id;
            const projToDelete = this.projectService.getProject(id);
            this.projectService.deleteProject(projToDelete)
              .subscribe(
              resp => {
                this.notificationsService.success('Exito', 'El proyecto se elimino correctamente');
                this.projectService.removeProject(projToDelete);
                const selectedProjItem = this.projectService.getSelectedProjectItem();
                if (selectedProjItem._id === id) {
                  this.projectService.setSelectedProject(null);
                }
              },
              error => {
                this.notificationsService.error('Error', 'Error en el borrado del proyecto');
              });
          })
          .catch(error =>
            console.log(error)
          );
      });
  }

  onSelectedProject() {
    this.projectService.setSelectedProject(this.project);
  }

  onAccessProject() {
    this.router.navigate(['workspace', this.project._id]);
  }
}
