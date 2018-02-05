import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { NgxRolesService } from 'ngx-permissions';
import { ProjectService } from './project.service';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class UserService {

  constructor(private roleService: NgxRolesService,
    private authService: AuthService,
    private projectService: ProjectService,
    private permissionService: NgxPermissionsService) { }

  lector_permissions = ['search_activated_quotes', 'activate_document', 'activate_code'];
  escritor_permissions = ['importar_docs', 'create_code', 'save_code', 'delete_code',
     'share_project', 'edit_project_description',
    , 'activate_code', 'search_activated_quotes', 'code_menu', 'activate_document',
     'edite_document', 'delete_document', 'save_quote', 'delete_quote', 'coding', 'coding_with_activated_codes'];
  private role = '';
  permissions = <Array<string>>([]);
  permissions$ = new BehaviorSubject<Array<string>>([]);

  getRole() {
    return this.role;
  }

  getRolePermissions() {
    return this.permissions$.asObservable();
  }

  setPermissions( permissions ) {
    this.permissions = permissions;
    this.setRolePermissions();
  }

  setRolePermissions() {
    this.permissions$.next(this.permissions);
  }

  removePermissions() {
    this.permissionService.flushPermissions();
    this.setPermissions([]);
  }

  addRole(role) {
    this.role = role;
    if (role === 'Lector') {
      this.permissionService.flushPermissions();
      this.permissionService.loadPermissions(this.lector_permissions);
      this.setPermissions( this.lector_permissions);
      this.roleService.addRole(role, this.lector_permissions);
    }
    if (role === 'Lector/Escritor') {
      this.permissionService.flushPermissions();
      this.permissionService.loadPermissions(this.lector_permissions.concat(this.escritor_permissions));
      this.setPermissions( this.escritor_permissions);
      this.roleService.addRole(role, this.lector_permissions.concat(this.escritor_permissions));
    }
  }

  removeRole(role) {
    this.roleService.removeRole(role);
    this.role = '';
  }

  removeRoles() {
    this.roleService.flushRoles();
    this.role = '';
  }

  loadRole(projId) {
    this.authService.getEmail().subscribe(
      nick => {
        this.projectService.getSelectedProject().subscribe(
          project => {
            const isOwner = project.getOwner().split('@')[0] === nick;
            const col = project.getCollaborator(nick);
            if (isOwner) {
              this.addRole('Lector/Escritor');
            } else if (col) {
              this.addRole(col.role);
            } else {
              console.error(nick + ' no es owner ni colaborador de ese proyecto.');
            }
          },
          error => console.error(error)
        );
      },
      error => console.error(error)
    );
  }
}
