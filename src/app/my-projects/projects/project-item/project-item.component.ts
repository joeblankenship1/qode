import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../shared/services/project.service';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: '[app-project-item]',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectItemComponent implements OnInit {
  @Input() project: Project;
  editableText = 'myText';

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit() {
  }

  onUpdateDescription(desc) {
    this.project.description = desc;
    this.projectService.updateProject(this.project)
      .subscribe(
      resp => {
        console.log('UPDATE:' + resp);
        this.project._etag = resp._etag;
      },
      error => {
        console.error(error);
      });
  }

  onDeleteProject() {
    const id = this.project._id;
    const projToDelete = this.projectService.getProject(id);
    this.projectService.deleteProject(projToDelete)
      .subscribe(
      resp => {
        console.log('DELETE:' + resp);
        this.projectService.removeProject(projToDelete);
      },
      error => {
        console.error(error);
      });
  }

  onAccessProject() {
    this.router.navigate(['workspace', this.project._id]);
  }

}
