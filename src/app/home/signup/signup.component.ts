import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
<<<<<<< HEAD
import { environment } from '../../../environments/environment.prod';
=======
import { EqualValidatorDirective } from '../../shared/directives/equal-validator.directive';
>>>>>>> ed850dcbda7c165f49f4cf559c86d8597948c7d5

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

  public user;

  constructor(
    private router: Router,
    private authService: AuthService) {
    this.showError = false;
    this.user = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
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
        realm: data.connection,
        username: data.email,
        password: data.password,
        scope: 'openid profile',
        audience: environment.apiUrl
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
