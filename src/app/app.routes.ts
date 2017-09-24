import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login/login.component';
import { SignupComponent } from './home/signup/signup.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'workspace', component: WorkSpaceComponent, canActivate: [AuthGuard] },
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];
