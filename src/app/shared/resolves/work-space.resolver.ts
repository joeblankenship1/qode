import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { WorkSpaceService } from '../services/work-space.service';
import { QuoteService } from '../services/quote.service';
import { CodeService } from '../services/code.service';
import { DocumentService } from '../services/document.service';
import { Quote } from '../models/quote.model';


@Injectable()
export class WorkSpaceResolver implements Resolve<any> {
  constructor(
    private workspaceService: WorkSpaceService,
    private quotesService: QuoteService,
    private codeService: CodeService,
    private documentService: DocumentService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const projectId = route.params.id;
    return this.codeService.loadCodes(projectId).map(
      codes => {
        this.quotesService.loadQuotes(projectId).subscribe(
          quotes => {
            this.documentService.loadDocuments(projectId).subscribe(
              docs => {
                this.workspaceService.cleanWorkSpace();
                this.workspaceService.initWorkSpace(projectId);
              },
              error => console.error(error)
            );

          },
          error => console.log(error)
        );
      },
      error => console.error(error)
    );
  }
}
