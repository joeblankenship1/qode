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
import { SpinnerService } from './spinner.service';


@Injectable()
export class CodeService {

  headers: Headers;
  options: RequestOptions;

  public codes: Code[] = [];
  private codes$ = new BehaviorSubject<Code[]>([]);

  private projectId: string;

  private activatedCodes: Code[] = [];
 // private activatedCodes$ = new BehaviorSubject<Code[]>([]);

  constructor(private http: AuthHttp, private projectService: ProjectService,
    private spinnerService: SpinnerService) {
    this.headers = new Headers({'Cache-Control': 'no-cache'});
    this.options = new RequestOptions({ headers: this.headers });
   }

  loadCodes(projectId): Observable<Code[]> {
    this.projectId = projectId;
    this.spinnerService.setSpinner('code_list', true);
    return this.http.get(environment.apiUrl + `code?where={"key.project":"${projectId}"}`, this.options)
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
        this.spinnerService.setSpinner('code_list', false);
        return codeArray;
      }).catch((err: Response) => {
        const details = err.json();
        console.log(details);
        return Observable.throw(details);
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
        foundCode.increaseQuoteCount(1);
        ret.push(foundCode);
      }
    }
    return ret;
  }

  addCode(code: Code): Observable<any> {
    if (this.codes.findIndex(c => c.getName() === code.getName()) !== -1) {
      return Observable.throw('Ya existe un código con ese nombre');
    }
    return this.http.post(environment.apiUrl + 'code', code.getMessageBody(), this.options)
      .map((data: Response) => {
        const extracted = data.json();
        if (extracted._id) {
          code.setId(extracted._id);
        }
        if (extracted._etag) {
          code.setEtag(extracted._etag);
        }
        this.codes.push(code);
        this.codes$.next(this.codes);
        return code;
      });
  }

  updateCode(code: Code): Observable<any> {
    const updheaders = new Headers({'If-Match': code.getEtag()});
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
    const delheaders = new Headers({'If-Match': code.getEtag()});
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

  setActivatedCodes(codes: Code[]) {
    this.activatedCodes = codes;
  }

  setActivatedCode(code: Code) {
    if (this.activatedCodes.indexOf(code) === -1) {
      this.activatedCodes.push(code);
    }
  }

  removeActivatedCode(code: Code) {
    if (this.activatedCodes.indexOf(code) > -1) {
      this.activatedCodes.splice(this.activatedCodes.indexOf(code), 1);
    }
  }

  getActivatedCodes() {
    return this.activatedCodes;
  }

  importCodes(projId: string) {
    return this.http.get(environment.apiUrl + `import-codes?to=${this.projectId}&from=${projId}`,
     this.options).map(
      (data: Response) => {
        const extracted = data.json();
        const codeArray: Code[] = [];
        let code;
        if (extracted.codes) {
          for (const element of JSON.parse(extracted.codes)) {
            code = new Code(element);
            this.codes.push(code);
          }
          this.codes$.next(this.codes);
        }
      }).catch((err: Response) => {
        const details = err.json();
        console.log(details);
        return Observable.throw(JSON.stringify(details));
      });
  }
}
