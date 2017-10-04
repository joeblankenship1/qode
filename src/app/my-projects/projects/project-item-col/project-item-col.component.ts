import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { Project } from '../../../shared/models/project.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-item-col',
  templateUrl: './project-item-col.component.html',
  styleUrls: ['./project-item-col.component.css']
})
export class ProjectItemColComponent implements OnInit {
  @Input() project: Project;

  constructor( private router: Router) { }

  ngOnInit() {
  }

  onAccessProject() {
    this.router.navigate(['workspace', this.project._id]);
  }
}
