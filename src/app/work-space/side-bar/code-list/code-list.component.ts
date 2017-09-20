import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Code } from '../../../shared/models/code.model';

@Component({
  selector: 'app-code-list',
  templateUrl: './code-list.component.html',
  styleUrls: ['./code-list.component.css']
})
export class CodeListComponent implements OnInit {
  public codes: Code[] = [];
  public newCodeName : string = "";
  public url: string = 'http://localhost:5000/code';
  private project: string = "59c2e0f33f52c231b0161694";

  constructor(private http: Http) { }

  ngOnInit() {
    this.loadCodes();
  }

  loadCodes(){
    this.getCodes()
    .subscribe(
      codesList => {
        this.codes = codesList;
      },
      error => console.error(error)
    );
  }

  getCodes(): Observable<Code[]> {
    return this.http.get(this.url)
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
        return codeArray;
      });
  }

  addCode(code:Code): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.url, code, options)
               .map((data: Response) => {});
  }

  onAddCode(){
    if (this.newCodeName == null || this.newCodeName===""){
      return;
    }
    this.addCode(new Code({"name":this.newCodeName,"description":"","project":this.project}))
    .subscribe(
      resp => {
        this.loadCodes();
      },
      error => {
        alert(error);
        console.error(error)});
    this.newCodeName = "";
  }
}
