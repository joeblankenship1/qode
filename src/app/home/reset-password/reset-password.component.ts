import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  model: any = {};
  loading = false;
  public showError = false;
  public resetError= '';

  constructor( private router: Router,
    private authenticationService: AuthService,
    private notificationService: NotificationsService) {
    this.showError = false;
   }

  ngOnInit() {
  }

  resetPassword() {
    this.loading = true;
    const data = {
      connection: 'Username-Password-Authentication',
      email: this.model.email,
    };
    this.authenticationService.resetPassword(data).then( (val: any) => {
      this.resetError = 'Te hemos enviado un email para que cambies tu contraseña';
      this.showError = true;
      this.loading = false;
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
      default: {
         this.resetError = 'Error al resetear contraseña';
         break;
      }
   }
  }

}
