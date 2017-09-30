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

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
  }

  deleteProject() {
    const id = this.project._id;
    const projToDelete = this.projectService.getProject(id);
    this.projectService.deleteProject( projToDelete )
    .subscribe(
    proj => {
      this.projectService.removeProject(projToDelete);
    },
    error => {
      console.log(error);
    });
  }

}
