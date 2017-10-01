import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../shared/services/project.service';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css']
})
export class ProjectItemComponent implements OnInit {
  @Input() project: Project;
  editableText = 'myText';

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
  }

  updateDescription(desc) {
    this.project.description = desc;
    this.projectService.updateProject(this.project)
      .subscribe(
      resp => {
        console.log('UPDATE:' + resp);
      },
      error => {
        console.error(error);
      });
  }

  deleteProject() {
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

}
