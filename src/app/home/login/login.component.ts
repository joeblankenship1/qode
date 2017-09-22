import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthService) { }

  ngOnInit() {
      // reset login status
      this.authenticationService.logout();

      // get return url from route parameters or default to '/'
     // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
     this.returnUrl = 'workspace';
  }

  login() {
    this.loading = true;
    this.authenticationService.loginUserPassword({
      realm: 'Username-Password-Authentication',
      username: this.model.email,
      password: this.model.password,
      scope: 'openid profile',
      audience: ''
    });
  }

  onLoginGoogle() {
    this.authenticationService.loginUserSocial({connection: 'google-oauth2'});
  }

}
