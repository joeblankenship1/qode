import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Code } from '../models/code.model';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Project } from '../models/project.model';
import { ProjectService } from './project.service';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../../environments/environment';
import { WorkSpaceService } from './work-space.service';


@Injectable()
export class CodeService {

  headers: Headers;
  options: RequestOptions;

  public codes: Code[] = [];
  private codes$ = new BehaviorSubject<Code[]>([]);
  private project: Project;

  constructor(private http: AuthHttp, private projectService: ProjectService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' , 'Cache-Control': 'no-cache'});
    this.options = new RequestOptions({ headers: this.headers });
   }

  loadCodes(projectId): Observable<Code[]> {
    return this.http.get(environment.apiUrl + `code?where={"project":"${projectId}"}`, this.options)
      .map((data: Response) => {
        const extracted = data.json();
        const codeArray: Code[] = [];
        let code;
        if (extracted._items) {
          for (const element of extracted._items) {
            code = new Code(element);
            codeArray.push(code);
          }
        }
        this.setCodes(codeArray);
        return codeArray;
      });
  }

  setCodes(codeArray: Code[]) {
    this.codes = codeArray;
    this.codes$.next(this.codes);
  }

  getCodes() {
    return this.codes$.asObservable();
  }

  getCodesById(codes): Code[] {
    const ret = [];
    for (const c of codes){
      const foundCode = this.codes.find( code => code.getId() === c);
      if (foundCode) {
        ret.push(foundCode);
      }
    }
    return ret;
  }

  addCode(code: Code): Observable<any> {
    return this.http.post(environment.apiUrl + 'code', code.getMessageBody(), this.options)
      .map((data: Response) => {
        const extracted = data.json();
        if (extracted._id) {
          code.setId(extracted._id);
        }
        if (extracted._id) {
          code.setEtag(extracted._etag);
        }
        this.codes.push(code);
        this.codes$.next(this.codes);
        return code;
      });
  }

  updateCode(code: Code): Observable<any> {
    const updheaders = new Headers({ 'Content-Type': 'application/json', 'If-Match': code.getEtag()});
    const updoptions = new RequestOptions({ headers: updheaders });
    const index = this.codes.indexOf(code, 0);
    if (index === -1) {
      return this.addCode(code);
    }
    return this.http.patch(environment.apiUrl + 'code/' + code.getId(), code.getMessageBody(), updoptions)
      .map((data: Response) => {
        const extracted = data.json();
        if (extracted._id) {
          code.setEtag(extracted._etag);
        }
        this.codes[index] = code;
        this.codes$.next(this.codes);
        return code;
      });
  }

  deleteCode(code: Code): Observable<any> {
    const delheaders = new Headers({ 'Content-Type': 'application/json', 'If-Match': code.getEtag()});
    const deloptions = new RequestOptions({ headers: delheaders });
    const index = this.codes.indexOf(code, 0);
    if (index === -1) {
      this.codes$.next(this.codes);
      return;
    }
    return this.http.delete(environment.apiUrl + 'code/' + code.getId(), deloptions)
      .map((data: Response) => {
        this.codes.splice(index, 1);
        this.codes$.next(this.codes);
      });
  }

}
