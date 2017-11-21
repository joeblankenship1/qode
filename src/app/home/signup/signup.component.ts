import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  model: any = {};
  loading = false;

  public signupError = '';
  public showError: boolean;

  constructor(
      private router: Router,
      private authService: AuthService) {
        this.showError = false;
      }

  ngOnInit() {
  }

  signup() {
    this.loading = true;
    const data = {
      connection: 'Username-Password-Authentication',
      email: this.model.email,
      password: this.model.password
    };
    this.authService.signup(data).then( (val: any) => {
      const info = {
        realm: val.connection,
        username: val.email,
        password: val.password,
        scope: 'openid profile',
        audience: ''
      };
      this.authService.loginUserPassword(info);
    },
      error => {
      this.decodeError(error);
      this.showError = true;
      this.loading = false;
    }
    );
  }

  private decodeError(error: any) {
    switch (error.code) {
      case 'user_exists': {
         this.signupError = 'Ya existe usuario';
         break;
      }
      case 'invalid_password': {
         this.signupError = 'Contrseña demasiado debil';
         break;
      }
      default: {
         this.signupError = 'Error al realizar registro';
         break;
      }
   }
  }

}
