import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../../shared/models/user.model';

@Injectable()
export class AuthService {

  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  auth0 = new auth0.WebAuth({
    clientID: 'UhMrdGno87iwJacMYSZYOq53ImO7IHa6',
    domain: 'nurruty.auth0.com',
    responseType: 'token id_token',
    audience: 'http://localhost:5000/',
    redirectUri: 'http://localhost:4200/',
    scope: 'openid profile'
  });

  constructor(public router: Router) {
    if (this.isAuthenticated()) {
      this.setLoggedIn(true);
    } else {this.setLoggedIn(false);
    }
  }
  // Login to Auth0 using user and password.
  public loginUserPassword(data) {
    this.auth0.client.login(data, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = 'myprojects';
        this.setSession(authResult);
        this.router.navigate(['myprojects']);
      } else if (err) {
        this.setLoggedIn(false);
        this.router.navigate(['/']);
      }
    });
  }

  // Login to Auth0 using a social connection.
  public loginUserSocial(connection) {
    this.auth0.authorize(connection);
  }

  public logOut() {
    this.clearSession();
    this.auth0.logout({
      clientID: 'UhMrdGno87iwJacMYSZYOq53ImO7IHa6'
    });
  }

  public signup(data): Promise<void> {
    return new Promise<void>((resolve, reject) => {
    this.auth0.signup(data, function(err, rslt)  {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
    });
  }

  // Handle callback from social login
  public handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = 'myprojects';
        this.setSession(authResult);
        this.router.navigate(['myprojects']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  // Returns true if the authenticatio token hasn't expired
  public isAuthenticated(): boolean {
    if (localStorage.getItem('access_token')) {
      const expiresAt = parseInt(localStorage.getItem('expires_at'), 0);
      const a = expiresAt - new Date().getTime();
      return (a > 0);
    }
    return false;
  }

  public getToken() {
    return localStorage.getItem('access_token');
  }

  public getEmail() {
    if (JSON.parse(localStorage.getItem('profile'))) {
      return JSON.parse(localStorage.getItem('profile')).nickname;
    }else {return ''; }
  }

  public isLoggedIn() {
    return this.loggedIn$.asObservable();
  }

  public clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    this.setLoggedIn(false);
  }

  // Update login status subject
  private setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  // Store parameters returned from Auth0 after login
  private setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('token', authResult.idToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.setLoggedIn(true);
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (err) {
        console.error(err);
      } else {
        const user = new User(profile);
        localStorage.setItem('profile', JSON.stringify(user));
      }
    });
  }

}
