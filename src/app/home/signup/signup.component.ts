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

  constructor(
      private router: Router,
      private authService: AuthService) { }

  ngOnInit() {

  }

  signup() {
      this.loading = true;
      this.authService.signup({
        connection: 'Username-Password-Authentication',
        email: this.model.email,
        password: this.model.password
    });
          // .subscribe(
          //     data => {
          //         // set success message and pass true paramater to persist the message after redirecting to the login page
          //        // this.alertService.success('Registration successful', true);
          //         this.router.navigate(['/login']);
          //     },
          //     error => {
          //        // this.alertService.error(error);
          //         this.loading = false;
          //     });
  }

}
