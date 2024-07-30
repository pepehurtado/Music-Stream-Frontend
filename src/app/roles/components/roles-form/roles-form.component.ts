import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { RoleService } from '../../services/roles.service';
import { Permission, Role } from '../../interfaces/role.interfaces';

@Component({
  selector: 'app-role-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent implements OnInit {
  roleForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  permissions: Permission[] = [
    { id: 1, name: 'write', entity: 'artist' },
    { id: 2, name: 'read', entity: 'artist' },
    { id: 3, name: 'write', entity: 'song' },
    { id: 4, name: 'read', entity: 'song' },
    { id: 5, name: 'write', entity: 'album' },
    { id: 6, name: 'read', entity: 'album' },
    { id: 7, name: 'write', entity: 'genre' },
    { id: 8, name: 'read', entity: 'genre' },
    { id: 9, name: 'write', entity: 'user' },
    { id: 10, name: 'read', entity: 'user' }
  ];
  selectedPermissions: number[] = []; // Array of permission IDs
  isEditMode = false;
  roleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      permissions: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.roleId = id;
          return this.loadRoleData(id);
        } else {
          return [];
        }
      })
    ).subscribe(
      (role: Role) => {
        if (role) {
          this.roleForm.patchValue({
            name: role.name,
            permissions: role.permissions.map(permission => permission.id) // Initialize permissions
          });
          this.selectedPermissions = role.permissions.map(permission => permission.id);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  loadRoleData(id: string) {
    return this.roleService.getRoleById(id).pipe(
      tap((role) => {
        this.roleForm.patchValue({
          name: role.name,
          permissions: role.permissions.map(permission => permission.id)
        });
        this.selectedPermissions = role.permissions.map(permission => permission.id);
      })
    );
  }

  onPermissionChange(permissionId: number, event: any): void {
    if (event.target.checked) {
      this.selectedPermissions.push(permissionId);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
    }
    this.roleForm.patchValue({ permissions: this.selectedPermissions });
  }

  submitForm(): void {
    if (this.roleForm.valid) {
      const formData = this.roleForm.value;

      // Convertir los IDs de permisos en objetos con el formato { id: number }
      const formattedPermissions = this.selectedPermissions.map(id => ({ id }));

      // Añadir los permisos formateados al objeto formData
      formData.permissions = formattedPermissions;

      if (this.isEditMode && this.roleId) {
        this.roleService.updateRole(this.roleId, formData).subscribe(
          (response) => {
            this.successMessage = 'Role updated successfully!';
            this.errorMessage = null;
            setTimeout(() => {
              this.router.navigateByUrl('/roles');
            }, 2000);
          },
          (error) => {
            this.errorMessage = 'Error updating role. ' + error.error.description;
            this.successMessage = null;
            console.error('Error updating role:', error);
          }
        );
      } else {
        this.roleService.createRole(formData).subscribe(
          (response) => {
            this.successMessage = 'Role created successfully!';
            this.errorMessage = null;
            this.roleForm.reset();
            setTimeout(() => {
              this.router.navigateByUrl('/roles');
            }, 2000);
          },
          (error) => {
            this.errorMessage = 'Error creating role. ' + error.error.description;
            this.successMessage = null;
            console.error('Error creating role:', error);
          }
        );
      }
    } else {
      this.errorMessage = 'Please fill out all required fields.';
      this.successMessage = null;
    }
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
