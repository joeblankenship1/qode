import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Project } from '../shared/models/project.model';
import { ProjectService } from '../shared/services/project.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [DatePipe]
})
export class FooterComponent implements OnInit {
  project: Project;

  constructor(private router: Router, private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.getSelectedProject().subscribe(
      project => {
        this.project = project;
      },
      error => console.error(error)
    );
  }

}
