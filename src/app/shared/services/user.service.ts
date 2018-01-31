import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { NgxRolesService } from 'ngx-permissions';
import { ProjectService } from './project.service';
import { AuthService } from './auth.service';
@Injectable()
export class UserService {

  constructor(private roleService: NgxRolesService,
    private authService: AuthService,
    private projectService: ProjectService,
    private permissionService: NgxPermissionsService) { }

  lector_permissions = ['perm1'];
  escritor_permissions = ['perm2', 'perm3'];

  // addPermission() {
  //   this.permissionService.loadPermissions(['OWNER']);
  // }

  // removePermission() {
  //   this.permissionService.removePermission('OWNER');
  // }

  removePermissions() {
    this.permissionService.flushPermissions();
  }

  addRole(role) {
    if (role === 'Lector') {
      this.permissionService.loadPermissions(this.lector_permissions);
      this.roleService.addRole(role, this.lector_permissions);
    }
    if (role === 'Lector/Escritor') {
      this.permissionService.loadPermissions(this.lector_permissions.concat(this.escritor_permissions));
      this.roleService.addRole(role, this.lector_permissions.concat(this.escritor_permissions));
    }
  }

  removeRole(role) {
    this.roleService.removeRole(role);
  }

  removeRoles() {
    this.roleService.flushRoles();
  }

  loadRole(projId) {
    this.authService.getEmail().subscribe(
      nick => {
        const proj = this.projectService.getProject(projId);
        const isOwner = proj.owner.split('@')[0] === nick;
        const col = proj.getCollaborator(nick);
        if (isOwner) {
          this.addRole('Owner');
          console.log('user sevice: owner');
        } else if (col) {
          this.addRole(col.role);
          console.log('user sevice: cola: ' + col.role);
        } else {
          console.error( nick + ' no es owner ni colaborador de ese proyecto.');
        }
      },
      error => console.error(error)
    );
  }

}
