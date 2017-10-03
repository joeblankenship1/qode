import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authsvc: AuthService) { }

    canActivate() {
        // If the user is not logged in we'll send them back to the login page
        if (!this.authsvc.isAuthenticated()) {
          this.router.navigate(['']);
          return false;
        }
        return true;
    }

}
