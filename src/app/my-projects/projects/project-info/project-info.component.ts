import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ProjectShareModalComponent } from '../../project-share-modal/project-share-modal.component';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { overlayConfigFactory } from 'angular2-modal';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ProjectService } from '../../../shared/services/project.service';
import { Project } from '../../../shared/models/project.model';
import { AuthHttp } from 'angular2-jwt';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css'],
  providers: [Modal, DatePipe]
})

export class ProjectInfoComponent implements OnInit {
  profile;
  @Input() project: Project;
  @ViewChild('descInfo') descInfoRef: ElementRef;
  editmode;

  constructor(private http: AuthHttp, private authService: AuthService, private projectService: ProjectService, private modal: Modal,
    private notificationsService: NotificationsService, private router: Router ) {
   }

  ngOnInit() {
    this.editmode = false;
    this.authService.getProfile().subscribe(
      profile => {
        this.profile = profile;
      },
      error => console.error(error)
    );

    this.projectService.getSelectedProject().subscribe(
      project => {
        this.project = project;
      },
      error => console.error(error)
    );
  }

  onUpdateDescription() {
    const desc = this.descInfoRef.nativeElement.value;
    this.project.description = desc;
    this.projectService.updateProject(this.project)
      .subscribe(
      resp => {
        this.notificationsService.success('Exito', 'Se actualizo la descripcion del proyecto ' + this.project.name);
        this.project._etag = resp._etag;
        this.project._modified = resp._modified;
        this.project._modified_by = resp._modified_by;
        this.editmode = false;
      },
      error => {
        this.notificationsService.error('Error', 'Error en la actualizacion del proyecto');
      });
  }

  onShareProject() {
    this.modal.open(ProjectShareModalComponent, overlayConfigFactory({ project: this.project, profile : this.profile }, BSModalContext))
      .then((resultPromise) => {
        resultPromise.result.then((result) => {
          if (result != null) {
            this.modal.alert().headerClass('btn-danger').title('Error al guardar').body(result).open();
          }
        });
      });
  }

  onAccessProject() {
    this.router.navigate(['workspace', this.project._id]);
  }

}
