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

@Component({
  selector: '[app-project-item]',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectItemComponent implements OnInit {
  @Input() project: Project;

  constructor(private projectService: ProjectService, private router: Router, private notificationsService: NotificationsService) { }

  ngOnInit() {
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
    const id = this.project._id;
    const projToDelete = this.projectService.getProject(id);
    this.projectService.deleteProject(projToDelete)
      .subscribe(
      resp => {
        this.notificationsService.success('Exito', 'El proyecto se elimino correctamente');
        this.projectService.removeProject(projToDelete);
      },
      error => {
        this.notificationsService.error('Error', 'Error en la actualizacion del proyecto');
      });
  }

  onAccessProject() {
    this.router.navigate(['workspace', this.project._id]);
  }

}
