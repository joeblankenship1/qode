import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Routes, Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
appname = '';
show: boolean;

  constructor(private authsvc: AuthService, private router: Router) {
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

}
