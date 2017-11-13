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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  public projects: Project[];
  public selectedProject: Project;
  @ViewChild('nameProject') nameProjectRef: ElementRef;
  @ViewChild('descProject') descProjectRef: ElementRef;

  constructor(private http: AuthHttp, private projectService: ProjectService, private notificationsService: NotificationsService) { }

  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'name';
  public sortOrder = 'asc';

  ngOnInit() {

    this.projectService.getProjects()
      .subscribe(
      projects => {
        this.projects = projects;
      },
      error => console.error(error)
      );
  }

  onProjectSelected(project: Project) {
    this.selectedProject = project;
  }

  onCreateProject() {
    const projName = this.nameProjectRef.nativeElement.value;
    if (projName !== '') {
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
          },
          error => {
            if (error._issues) {
              if (error._issues.name) {
                if (error._issues.name.includes('is not unique')) {
                  this.notificationsService.error('Error', 'El nombre del proyecto ya existe.');
                } else { this.notificationsService.error('Error', 'Error'); }
              } else { this.notificationsService.error('Error', 'Error'); }
            } { this.notificationsService.error('Error', 'Error'); }
          });
      } else { this.notificationsService.error('Error', 'La descripcion puede tener hasta 300 caracteres.'); }
    } else { this.notificationsService.error('Error', 'Debes ingresar un nombre para el nuevo proyecto'); }
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.city.length;
  }

}
