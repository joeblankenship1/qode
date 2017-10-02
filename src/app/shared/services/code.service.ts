import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Code } from '../models/code.model';
import { Http,  Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Project } from '../models/project.model';
import { ProjectService } from './project.service';


@Injectable()
export class CodeService {
  public codes: Code[] = [];
  private codes$ = new BehaviorSubject<Code[]>([]);
  public url: string = 'http://localhost:5000/code';
  private project: Project;

  constructor(private http: Http,private projectService:ProjectService) {
    this.projectService.getOpenedProject()
    .subscribe(
    project => {
      this.project = project;
      if (project != null){
        this.loadCodes().subscribe(
          resp => {
          },
          error => {
            alert(error);
            console.error(error)});
      }
    },
    error => console.error(error)
    );
   }

  loadCodes(): Observable<Code[]> {
    return this.http.get(this.url + '?where={"project":"' + this.project._id + '"}')
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
        this.codes = codeArray;
        this.codes$.next(codeArray);
        return codeArray;
      });
  }

  setCodes(codeArray: Code[]) {
    this.codes = codeArray;
    this.codes$.next(codeArray);
  }

  getCodes() {
    return this.codes$.asObservable();
  }

  addCode(code:Code): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.url, code.getMessageBody(), options)
               .map((data: Response) => {
                const extracted = data.json();
                if (extracted._id) {
                  code._id = extracted._id;
                }
                if (extracted._id) {
                  code._etag = extracted._etag;
                }
                this.codes.push(code);
                this.codes$.next(this.codes);
                return code;
              });
  }

  updateCode(code:Code): Observable<any> {
    var index = this.codes.indexOf(code, 0);
    if (index == -1) {
       return this.addCode(code);
    }
    let headers = new Headers({ 'Content-Type': 'application/json' , 'If-Match':code._etag });
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(this.url + "/" +code._id, code.getMessageBody(), options)
               .map((data: Response) => {
                const extracted = data.json();
                if (extracted._id) {
                  code._etag = extracted._etag;
                }
                this.codes[index] = code;
                this.codes$.next(this.codes);
                return code;
              });
  }

  deleteCode(code:Code): Observable<any> {
    var index = this.codes.indexOf(code, 0);
    if (index == -1) {
      this.codes$.next(this.codes);
      return;
    }
    let headers = new Headers({ 'Content-Type': 'application/json' , 'If-Match':code._etag });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(this.url + "/" +code._id, options)
               .map((data: Response) => {
                 this.codes.splice(index,1);
                 this.codes$.next(this.codes);
               });
  }


}
