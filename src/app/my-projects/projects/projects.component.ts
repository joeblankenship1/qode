import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  Http,
  Response,
  RequestOptions,
  Headers
} from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { ProjectService } from '../../shared/services/project.service';
import { Project } from '../../shared/models/project.model';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { WorkSpaceService } from '../../shared/services/work-space.service';
import { SpinnerService } from '../../shared/services/spinner.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  public projects: Project[];
  @ViewChild('nameProject') nameProjectRef: ElementRef;
  @ViewChild('descProject') descProjectRef: ElementRef;

  constructor(private projectService: ProjectService,
    private notificationsService: NotificationsService,
    private workspaceService: WorkSpaceService,
    private spinnerService: SpinnerService) { }

  public filterQuery = '';
  public rowsOnPage = 5;
  public sortBy = 'name';
  public sortOrder = 'asc';
  spinner = false;

  ngOnInit() {
    this.workspaceService.cleanWorkSpace();
    this.spinnerService.getSpinner('projects')
      .subscribe(
      state => {
        this.spinner = state;
      });
    this.spinnerService.setSpinner('projects', true);

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

  onCreateProject() {
    const projName = this.nameProjectRef.nativeElement.value;
    if (projName !== '') {
      if (this.projects == null) {
        this.projects = [];
      }
      if (this.projects.findIndex(p => p.name === projName) === -1) {
        const descName = this.descProjectRef.nativeElement.value;
        if (descName.length < 300) {
          const newProj = new Project({ name: projName, description: descName, owner: 'default' });

          this.projectService.createProject(newProj)
            .subscribe(
            proj => {
              this.projectService.addProject(proj);
              this.notificationsService.success('Exito', 'El proyecto ' + proj.name + ' fue creado.');
              this.nameProjectRef.nativeElement.value = '';
              this.descProjectRef.nativeElement.value = '';
              this.projectService.setSelectedProject(proj);
            },
            error => {
              if (error.message !== null) {
                if (error.message.includes('is not unique')) {
                  this.notificationsService.error('Error', 'El nombre del proyecto ya existe.');
                }
                if (error._issues) {
                  this.notificationsService.error('Error', 'Error');
                }
              }
            });
        } else { this.notificationsService.error('Error', 'La descripcion puede tener hasta 300 caracteres.'); }
      } else { this.notificationsService.error('Error', 'Ya existe un proyecto con el nombre ingresado'); }
    } else { this.notificationsService.error('Error', 'Debes ingresar un nombre para el nuevo proyecto'); }
  }
}
