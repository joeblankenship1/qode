import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Code } from '../../../shared/models/code.model';
import { CodeService } from '../../../shared/services/code.service';

@Component({
  selector: 'app-code-list',
  templateUrl: './code-list.component.html',
  styleUrls: ['./code-list.component.css']
})
export class CodeListComponent implements OnInit {
  public codes: Code[] = [];
  public newCodeName : string = "";
  private project: string = "59c2e0f33f52c231b0161694";

  constructor(private http: Http,private codeService: CodeService) { }

  ngOnInit() {
    this.codeService.getCodes()
    .subscribe(
      codes => {
        this.codes = codes;
      }
    );
    this.codeService.loadCodes().subscribe(resp => {},
      error => {
        alert(error);
        console.error(error)
      });
  }

  onAddCode(){
    if (this.newCodeName == null || this.newCodeName===""){
      return;
    }
    this.codeService.addCode(new Code({"name":this.newCodeName,"description":"","project":this.project}))
    .subscribe(
      resp => {
      },
      error => {
        alert(error);
        console.error(error)});
    this.newCodeName = "";
  }
}
