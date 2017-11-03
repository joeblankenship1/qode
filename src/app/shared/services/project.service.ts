import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  RequestOptions,
  Headers
} from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProjectService {

  private myProjects: Project[] = [];
  private myProjects$ = new BehaviorSubject<Project[]>([]);

  private openedProject: Project;
  private openedProject$ = new BehaviorSubject<Project>(null);

  private url = environment.apiUrl;

  constructor(private http: AuthHttp) {
  }

  getOpenedProject() {
    return this.openedProject$.asObservable();
  }

  setOpenedProject(proj: Project) {
    this.openedProject = proj;
    this.openedProject$.next(proj);
  }

  getProjects(): Observable<any> {
    return this.http.get(this.url + 'project')
      .map((data: Response) => {
        const extracted = data.json();
        const projectArray: Project[] = [];
        let project;
        if (extracted._items) {
          for (const element of extracted._items) {
            project = new Project(element);
            projectArray.push(project);
            this.addProject(project);
          }
        }
        return projectArray;
      });
  }

  getArrayProyects() {
    return this.myProjects$.asObservable();
  }

  setArrayProyects(projectArray: Project[]) {
    this.myProjects = projectArray;
    this.myProjects$.next(this.myProjects);
  }

  addProject(proj: Project) {
    this.myProjects.push(proj);
    this.setArrayProyects(this.myProjects);
  }

  removeProject(proj: Project) {
    const indxOf = this.myProjects.findIndex(x => x._id === proj._id);
    this.myProjects.splice(indxOf, 1);
    this.setArrayProyects(this.myProjects);
  }

  getProject(id: string) {
    return this.myProjects.find(x => x._id === id);
  }

  createProject(proj: Project): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' , 'Cache-Control': 'no-cache' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(this.url + 'project', proj.getMessageBody())
      .map((data: Response) => {
        const aux = data.json();
        proj.setId(aux._id);
        proj.setEtag(aux._etag);
        proj.setOwner(aux.key.owner);
        return proj;
      }).catch((err: Response) => {
        const details = err.json();
        return Observable.throw(details);
      });
  }

  updateProject(proj: Project): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'If-Match': proj._etag });
    const options = new RequestOptions({ headers: headers });
    return this.http.patch(this.url + 'project/' + proj._id, proj.getMessageBody(), options)
      .map((data: Response) => {
        const aux = data.json();
        proj.setEtag(aux._etag);
        return proj;
      }).catch((err: Response) => {
        const details = err.json();
        return Observable.throw(details);
      });
  }

  deleteProject(proj: Project): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'If-Match': proj._etag });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(this.url + 'project/' + proj._id, options)
      .map((data: Response) => {
        return 'OK';
      }).catch((err: Response) => {
        const details = err.json();
        return Observable.throw(details);
      });
  }
}
