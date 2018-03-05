import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CodeService } from './code.service';
import { Code } from '../models/code.model';
import { WorkSpaceService } from './work-space.service';

@Injectable()
export class CodeSystemService {


  private codeSystem: any[];
  private codeSystem$ = new BehaviorSubject<any[]>(null);

  constructor(private projectService: ProjectService,
  private codeService: CodeService,
  private workspaceService: WorkSpaceService) { }

  addNodeCodeSystem(code: Code, parent?) {
    const node = {
      name: code.getName(),
      id: code.getId(),
      data: code,
      children: []
    };
    if (parent) {

    } else {
      this.codeSystem.push(node);
      this.codeSystem$.next(this.codeSystem);
      this.projectService.updateCodeSystem(this.translateCodeSystem(this.codeSystem));
    }
  }

  createTreeNodes(cs) {
    if (cs) {
      const ids = [];
      cs.map(n => {
        ids.push(n.code_id);
      });
      const codes: Code[] = this.codeService.getCodesById(ids);
      return codes.map(c => {
        const children = this.createTreeNodes(cs.children);
        return {
          name: c.getName(),
          id: c.getId(),
          data: c,
          children: children
        };
      });
    } else { return []; }
  }

  getCodeSystem() {
    return this.codeSystem$.asObservable();
  }

  loadCodeSystem() {
    const cs = this.createTreeNodes(this.projectService.getSelectedProjectCodeSystem());
    this.setCodeSystem(cs);
  }

  removeNodeCodeSystem(code_id) {
    const deleted = this.removeNode(code_id, this.codeSystem);
    if (deleted) {
      this.codeSystem$.next(this.codeSystem);
    }
  }

  setCodeSystem(codeSystem) {
    this.codeSystem = codeSystem;
    this.codeSystem$.next(codeSystem);
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
    while ( !deleted && i > 0) {
      if (nodes[i - 1].id === id) {
        this.removeCodesFromNodes(nodes[ i - 1 ].children);
        nodes.splice(i - 1, 1);
        return true;
      } else {
        const children = nodes[i - 1].children;
        deleted = this.removeNode(id, children);
      }
      i --;
    }
    return deleted;
  }

  private removeCodesFromNodes(nodes) {
    nodes.map( node => {
      this.removeCodesFromNodes( node.children );
      this.codeService.deleteCode( node.data ).subscribe( resp => {
        this.workspaceService.removeQuotesInDocumentContent(node.data);
      });
    } );
  }


}
