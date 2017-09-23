import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'UhMrdGno87iwJacMYSZYOq53ImO7IHa6',
    domain: 'nurruty.auth0.com',
    responseType: 'token id_token',
    audience: 'http://localhost:5000/',
    redirectUri: 'http://localhost:4200/',
    scope: 'openid'
  });

  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize({});
  }

  public loginUserPassword(data) {
   this.auth0.client.login(data, (err, authResult) => {
    });
  }

  public loginUserSocial(connection) {
    this.auth0.authorize(connection);
  }

  public signup(data): void {
    this.auth0.signup(data, function (err) {
      if (err) {
        console.error('Error' + err.errorDescription);
      } else { console.log('Success');
    }
    });
    this.router.navigate(['/workspace']);
  }

  public handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['workspace']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('token', authResult.idToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (err) {
        console.error(err);
      } else {
        localStorage.setItem('profile', JSON.stringify(profile));
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = parseInt(localStorage.getItem('expires_at'), 0);
    return new Date().getTime() < expiresAt;
  }

  public getAccessToken() {
    return localStorage.getItem('access_token');
  }

  public getToken() {
    return localStorage.getItem('token');
  }


}
