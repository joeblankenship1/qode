import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
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

  constructor(private projectService: ProjectService) { }

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

  createProject() {
    this.errorMessage = '';

    const projName = this.nameProjectRef.nativeElement.value;
    if (projName !== '') {
      const descName = this.descProjectRef.nativeElement.value;
      if (descName.length < 300) {
        const newProj = new Project({ name: projName, description: descName });

        this.projectService.createProject(new Project(newProj))
          .subscribe(
          proj => {
            this.projectService.addProject(newProj);
          },
          error => {
            console.log(error._issues.name);
            if (error._issues.name.includes('is not unique')) {
              this.errorMessage = 'El nombre del proyecto ya existe.';
            } else { this.errorMessage = 'Error'; }
          });
      } else { this.errorMessage = 'La descripcion puede tener hasta 300 caracteres.'; }
    } else { this.errorMessage = 'Debes ingresar un nombre para el nuevo proyecto'; }
  }
}
