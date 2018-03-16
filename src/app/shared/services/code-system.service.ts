import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CodeService } from './code.service';
import { Code } from '../models/code.model';
import { WorkSpaceService } from './work-space.service';
import { QuoteService } from './quote.service';
import { SpinnerService } from './spinner.service';
import { environment } from '../../../environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { RequestOptions, Headers, Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CodeSystemService {

  headers: Headers;
  options: RequestOptions;

  private codeSystem: any[] = [];
  private codeSystem$ = new BehaviorSubject<any[]>(null);
  spinner = false;

  constructor(private projectService: ProjectService,
    private http: AuthHttp,
    private codeService: CodeService,
    private workspaceService: WorkSpaceService,
    private quoteService: QuoteService,
    private spinnerService: SpinnerService) {
    this.headers = new Headers({ 'Cache-Control': 'no-cache' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  addNodeCodeSystem(code: Code) {
    const node = {
      name: code.getName(),
      id: code.getId(),
      data: code,
      children: []
    };
    this.codeSystem.push(node);
    this.codeSystem$.next(this.codeSystem);
    this.updateCodeSystem(this.codeSystem);
  }

  createTreeNodes(cs) {
    if (cs) {
      const ids = [];
      cs.map(n => {
        ids.push(n.code_id);
      });
      const codes: Code[] = this.codeService.getCodesById(ids);
      return codes.map((c, i) => {
        const children = cs[i] ? this.createTreeNodes(cs[i].children) : [];
        return {
          name: c.getName(),
          id: c.getId(),
          data: c,
          children: children
        };
      });
    } else { return []; }
  }

  cleanCodeSystem() {
    this.codeSystem = [];
    this.codeSystem$.next([]);
  }

  getCodeSystem() {
    return this.codeSystem$.asObservable();
  }

  importCodes(projId: string) {
    const projectId = this.projectService.getSelectedProjectItem()._id;
    return this.http.get(environment.apiUrl + `import-codes?to=${projectId}&from=${projId}`,
      this.options).map(
        (data: Response) => {
          const extracted = data.json();
          this.codeService.loadCodes(projectId).subscribe(c => {
            const newCodeSystem = this.createTreeNodes(JSON.parse(extracted.code_system));
            this.setCodeSystem(newCodeSystem);
            this.spinnerService.setSpinner('code_system', false);
          });
        }).catch((err: Response) => {
          const details = err.json();
          console.log(err);
          return Observable.throw(JSON.stringify(err));
        });
  }

  loadCodeSystem() {
    const cs = this.createTreeNodes(this.projectService.getSelectedProjectCodeSystem());
    this.setCodeSystem(cs);
    this.spinnerService.setSpinner('code_system', false);
  }


  removeNodeCodeSystem(code_id) {
    const deleted = this.removeNode(code_id, this.codeSystem);
    if (deleted) {
      this.codeSystem$.next(this.codeSystem);
      this.codeService.loadCodes(this.projectService.getSelectedProjectItem()._id)
      .subscribe().unsubscribe();
      this.spinnerService.setSpinner('code_system', false);
    }
  }

  setCodeSystem(codeSystem) {
    this.codeSystem = codeSystem;
    this.codeSystem$.next(codeSystem);
  }

  updateCodeSystem(codeSystem) {
    this.projectService.updateCodeSystem(this.translateCodeSystem(codeSystem));
  }

  private translateCodeSystem(codeSystem) {
    return codeSystem.map(n => {
      return {
        code_id: n.id,
        children: this.translateCodeSystem(n.children)
      };
    });
  }

  private removeNode(id, nodes) {
    let deleted = false;
    let i = nodes.length;
    while (!deleted && i > 0) {
      if (nodes[i - 1].id === id) {
        this.removeCodesFromNodes(nodes[i - 1].children);
        nodes.splice(i - 1, 1);
        return true;
      } else {
        const children = nodes[i - 1].children;
        deleted = this.removeNode(id, children);
      }
      i--;
    }
    return deleted;
  }

  private removeCodesFromNodes(nodes) {
    nodes.map(node => {
      this.removeCodesFromNodes(node.children);
      this.workspaceService.removeQuotesInDocumentContent(node.data);
      if (this.quoteService.removeCodeFromQuotes(node.data.getId())) {
        this.workspaceService.updateDocumentContent();
      }
    });
  }


}
