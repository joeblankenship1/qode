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

  constructor(private authsvc: AuthService, private router: Router) {
    this.appname = 'libreQDA';
  }

  ngOnInit() {
  }

  login() {
    this.authsvc.login();
  }

  logout() {
    this.authsvc.logout();
  }

}
