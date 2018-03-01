import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CodeService } from './code.service';
import { Code } from '../models/code.model';

@Injectable()
export class CodeSystemService {


  private codeSystem: any[];
  private codeSystem$ = new BehaviorSubject<any[]>(null);

  constructor(private projectService: ProjectService,
  private codeService: CodeService) { }

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

  setCodeSystem(codeSystem) {
    this.codeSystem = codeSystem;
    this.codeSystem$.next(codeSystem);
  }

  translateCodeSystem(codeSystem) {
    return codeSystem.map(n => {
      return {
        code_id: n.id,
        children: this.translateCodeSystem(n.children)
      };
    });
  }


}
