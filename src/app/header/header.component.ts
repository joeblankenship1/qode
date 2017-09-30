import { Component, OnInit } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CodeModalComponent } from './code-modal/code-modal.component';
import { overlayConfigFactory } from 'angular2-modal';
import { Code } from '../shared/models/code.model';
import { AuthService } from '../shared/services/auth.service';
import { Routes, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [Modal]
})
export class HeaderComponent implements OnInit {
appname = '';
show: boolean;

  constructor(private authsvc: AuthService, private router: Router,private modal: Modal) {
    this.appname = 'libreQDA';
  }

  ngOnInit() {
   this.authsvc.loggedIn$.subscribe( s => {
     this.show = s;
   });
  }

  logout() {
    this.authsvc.logOut();
  }

  onNewCode(){
    let newCode = new Code({name:"",project:"59c2e0f33f52c231b0161694"});
    this.modal.open(CodeModalComponent, overlayConfigFactory({ code: newCode, mode: 'new' }, BSModalContext ))
    .then((resultPromise) => {
      resultPromise.result.then((result) => {
        if (result != null){
          this.modal.alert().headerClass("btn-danger").title("Error al guardar").body(result).open();
        }});
    });
  }

}
