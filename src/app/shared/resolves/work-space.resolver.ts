import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { WorkSpaceService } from '../services/work-space.service';
import { QuoteService } from '../services/quote.service';
import { CodeService } from '../services/code.service';
import { DocumentService } from '../services/document.service';
import { Quote } from '../models/quote.model';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { QuotesRetrievalService } from '../services/quotes-retrieval.service';
import { ProjectService } from '../services/project.service';
import { CodeSystemService } from '../services/code-system.service';


@Injectable()
export class WorkSpaceResolver implements Resolve<any> {
  constructor(
    private workspaceService: WorkSpaceService,
    private quotesService: QuoteService,
    private codeService: CodeService,
    private documentService: DocumentService,
    private projectService: ProjectService,
    private router: Router,
    private notificationsService: NotificationsService,
    private quotesRetrievalService: QuotesRetrievalService,
    private codeSystemService: CodeSystemService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const projectId = route.params.id;
    return this.codeService.loadCodes(projectId).map(
      codes => {
        this.codeSystemService.loadCodeSystem();
        this.quotesService.loadQuotes(projectId).subscribe(
          quotes => {
            this.quotesRetrievalService.initQuotesRetrieval();
            this.documentService.loadDocuments(projectId).subscribe(
              docs => {
                this.projectService.loadSelectedProject(projectId).subscribe(
                  proj => {
                    this.workspaceService.initWorkSpace(projectId);
                  }, error => {
                    this.router.navigate(['myprojects']);
                    this.notificationsService.error('Error', 'No tienes permisos para acceder a ese proyecto');
                  });
              },
              error => {
                this.router.navigate(['myprojects']);
                this.notificationsService.error('Error', 'No tienes permisos para acceder a ese proyecto');
              });
          },
          error => {
            this.router.navigate(['myprojects']);
            this.notificationsService.error('Error', 'No tienes permisos para acceder a ese proyecto');
           });
      }).catch(error => {
        this.router.navigate(['myprojects']);
        this.notificationsService.error('Error', 'No tienes permisos para acceder a ese proyecto');
        return Observable.of(null);
      });
  }
}
