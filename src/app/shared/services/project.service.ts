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
// import 'rxjs/Rx';

@Injectable()
export class ProjectService {

  private myProjects: Project[] = [];
  private myProjects$ = new BehaviorSubject<Project[]>([]);

  // Para cambiar proyecto activo,
  // private selectedProject: Project = null;
  // private selectedProject$ = new BehaviorSubject<Project>(null);

  private url = 'http://localhost:5000/project';

  constructor(private http: Http) {
  }

  getProjects(): Observable<any> {
    return this.http.get(this.url)
      .map((data: Response) => {
        const extracted = data.json();
        const projectArray: Project[] = [];
        let project;
        if (extracted._items) {
          for (const element of extracted._items) {
            project = new Project(element);
            projectArray.push(project);
            this.addProject(element);
          }
        }
        return projectArray;
      });
  }

  // Serian para cambiar de proyecto
  // getSelectedProject() {
  //   return this.selectedProject$.asObservable();
  // }

  // setSelectedProject(selectedProject: Project) {
  //   this.selectedProject = selectedProject;
  //   this.selectedProject$.next(selectedProject);
  // }

  addProject(proj: Project) {
    this.myProjects.push(proj);
  }

  quitProject(proj: Project) {
    const indxOf = this.myProjects.findIndex(x => x._id === proj._id);
    this.myProjects.splice(indxOf, 1);
  }

  getProject(id: string) {
    return this.myProjects.find(x => x._id === id);
  }

  createProject(proj: Project): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(this.url, proj.getMessageBody())
      .map((data: Response) => {
        console.log(data);
      }).catch((err: Response) => {
        const details = err.json();
        return Observable.throw(details);
      });
  }

  updateProject(proj: Project): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'If-Match': proj._etag });
    const options = new RequestOptions({ headers: headers });
    return this.http.patch(this.url + '/' + proj._id, proj.getMessageBody(), options)
      .map((data: Response) => { });
  }

  deleteProject(proj: Project): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'If-Match': proj._etag });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(this.url + '/' + proj._id)
      .map((data: Response) => {
        console.log(data);
      });
  }
}
