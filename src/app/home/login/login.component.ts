import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  loginError = false;
  returnUrl: string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthService) { }

  ngOnInit() {
      this.authenticationService.clearSession();
      this.authenticationService.loggedIn$.subscribe(r => {
        if (!r && this.loading) {
          this.loginError = true;
        }
        this.loading = r;
      });
    }

  login() {
    this.loading = true;
    this.authenticationService.loginUserPassword({
      realm: 'Username-Password-Authentication',
      username: this.model.email,
      password: this.model.password,
      scope: 'openid email',
      audience: ''
    });
  }

  onLoginGoogle() {
    this.authenticationService.loginUserSocial({connection: 'google-oauth2'});
  }

}
