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
    this.headers = new Headers({ 'Cache-Control': 'no-cache' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  getProjects(): Observable<any> {
    return this.http.get(this.url + 'project', this.options)
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

  loadSelectedProject(projId): Observable<Project> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.url + `project?where={"_id": "${projId}"}`, options)
      .map((data: Response) => {
        const extracted = data.json();
        const proj = new Project(extracted._items[0]);
        if (proj) {
          this.setSelectedProject(proj);
          return proj;
        } else {
          console.log('Error al cargar el proyecto');
          return Observable.throw(null);
        }
      }).catch((err: Response) => {
        const details = err.json();
        console.log(details);
        return Observable.throw(details);
      });
  }

  setArrayProyects(projectArray: Project[]) {
    this.myProjects = projectArray;
    this.myProjects$.next(this.myProjects);
    const s = this.getSelectedProjectItem();
    if (s) {
      const p = this.getProject(s._id);
      this.setSelectedProject(p);
    }
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

  getSelectedProjectCodeSystem() {
    return this.selectedProject.getCodeSystem();
  }

  setSelectedProjectCodeSystem(codeSystem) {
    this.selectedProject.setCodeSystem(codeSystem);
  }

  setSelectedProject(proj) {
    this.selectedProject = proj;
    this.selectedProject$.next(this.selectedProject);
  }

  updateProjectAttrs(_id, _modified_by, _modified) {
    const proj = this.getProject(_id);
    proj.setModified(_modified);
    proj.setModifiedBy(_modified_by);
    this.setArrayProyects(this.myProjects);
  }

  updateCodeSystem(codeSystem) {
    this.selectedProject.setCodeSystem(codeSystem);
    this.updateProject(this.selectedProject).subscribe(
      proj => {
        this.setSelectedProject(proj);
      }
    );
  }

  createProject(proj: Project): Observable<any> {
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
    const headers = new Headers({'If-Match': proj._etag });
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
    const headers = new Headers({ 'If-Match': proj._etag });
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
    const headers = new Headers({'If-Match': proj._etag });
    const options = new RequestOptions({ headers: headers });
    const projGuardar = proj.getMessageBody();
    projGuardar.collaborators = listCols;
    return this.http.patch(this.url + 'project/' + proj._id, projGuardar, options)
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
}
