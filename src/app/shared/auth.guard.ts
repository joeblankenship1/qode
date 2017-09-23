import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { AuthService } from './services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authsvc: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('access_token') !== undefined) {
            // logged in so return true
            return true;
        }
    // not logged in so redirect to login page with the return url
        this.router.navigate([''], { queryParams: { returnUrl: state.url }});
        return true;
    }

}
