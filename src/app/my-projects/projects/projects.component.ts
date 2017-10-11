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


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  errorMessage = '';
  public projects: Project[];
  public selectedProject: Project;
  @ViewChild('nameProject') nameProjectRef: ElementRef;
  @ViewChild('descProject') descProjectRef: ElementRef;

  constructor(private http: AuthHttp, private projectService: ProjectService) { }

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

    this.projectService.getArrayProyects()
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
    this.errorMessage = '';

    const projName = this.nameProjectRef.nativeElement.value;
    if (projName !== '') {
      const descName = this.descProjectRef.nativeElement.value;
      if (descName.length < 300) {
        const profile = JSON.parse(localStorage.getItem('profile'));
        const projectName = profile.nickname + '/' + projName;
        const owner = profile.name;
        const newProj = new Project({ name: projectName, description: descName, owner: '59dd2ddf3f52c226083a32fe' });

        this.projectService.createProject(new Project(newProj))
          .subscribe(
          proj => {
            this.projectService.addProject(proj);
            this.nameProjectRef.nativeElement.value = '';
            this.descProjectRef.nativeElement.value = '';
          },
          error => {
            if (error._issues.name.includes('is not unique')) {
              this.errorMessage = 'El nombre del proyecto ya existe.';
            } else { this.errorMessage = 'Error'; }
          });
      } else { this.errorMessage = 'La descripcion puede tener hasta 300 caracteres.'; }
    } else { this.errorMessage = 'Debes ingresar un nombre para el nuevo proyecto'; }
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.city.length;
  }

}
