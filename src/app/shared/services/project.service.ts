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
  private selectedProject: Project = null;
  private selectedProject$ = new BehaviorSubject<Project>(null);
  private url = environment.apiUrl;

  private headers: Headers;
  private options: RequestOptions;

  constructor(private http: AuthHttp) {
    this.headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  getProjects(): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.url + 'project', options)
      .map((data: Response) => {
        const extracted = data.json();
        const projectArray: Project[] = [];
        let project;
        if (extracted._items) {
          for (const element of extracted._items) {
            project = new Project(element);
            projectArray.push(project);
          }
        }
        this.setArrayProyects(projectArray);
        return projectArray;
      });
  }

  setArrayProyects(projectArray: Project[]) {
    this.myProjects = projectArray;
    this.myProjects$.next(this.myProjects);
  }

  getArrayProyects() {
    return this.myProjects$.asObservable();
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

  getSelectedProject() {
    return this.selectedProject$.asObservable();
  }

  getSelectedProjectItem() {
    return this.selectedProject;
  }

  setSelectedProject(proj) {
    this.selectedProject = proj;
    this.selectedProject$.next(this.selectedProject);
  }

  // TO DO -> Tendria que ser llamado despues de cada add/update/delete en alguno de los otros servicios
  updateProjectAttrs(_id, _modified_by, _modified) {
    const proj = this.getProject(_id);
    proj._modified = _modified;
    proj._modified_by = _modified_by;
    this.setArrayProyects(this.myProjects);
  }

  createProject(proj: Project): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(this.url + 'project', proj.getMessageBody())
      .map((data: Response) => {
        const aux = data.json();
        proj.setId(aux._id);
        proj.setEtag(aux._etag);
        proj.setOwner(aux.key.owner);
        proj.setCreated(aux._created);
        proj.setCreatedBy(aux._created_by);
        proj.setModified(aux._modified);
        proj.setModifiedBy(aux._modified_by);
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
        proj.setModified(aux._modified);
        proj.setModifiedBy(aux._modified_by);
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

  saveCollaborators(proj: Project, listCols: Array<{ email: string, role: string }>) {
    const headers = new Headers({ 'Content-Type': 'application/json', 'If-Match': proj._etag });
    const options = new RequestOptions({ headers: headers });
    const projGuardar = proj.getMessageBody();
    projGuardar.collaborators = listCols;
    return this.http.patch(this.url + 'project/' + proj._id, projGuardar, options)
      .map((data: Response) => {
        const aux = data.json();
        proj.setEtag(aux._etag);
        return proj;
      }).catch((err: Response) => {
        const details = err.json();
        return Observable.throw(details);
      });
  }
}
