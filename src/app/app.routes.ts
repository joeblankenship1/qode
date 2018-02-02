import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login/login.component';
import { SignupComponent } from './home/signup/signup.component';
import { ProjectsComponent } from './my-projects/projects/projects.component';
import { WorkSpaceResolver } from './shared/resolves/work-space.resolver';
import { ResetPasswordComponent } from './home/reset-password/reset-password.component';



export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'workspace/:id', component: WorkSpaceComponent,
    canActivate: [AuthGuard],
    resolve: { workspace: WorkSpaceResolver}
  },
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'resetpassword', component: ResetPasswordComponent},
  {path: 'myprojects', component: ProjectsComponent, canActivate: [AuthGuard]},

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];
