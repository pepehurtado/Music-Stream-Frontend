import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { RoleService } from '../../services/roles.service';
import { Permission, Role } from '../../interfaces/role.interfaces';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { PermissionTranslaterService } from '../../services/permision-translater.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from 'src/app/shared/ErrorHandlerService';

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
  selectedPermissionsFull: Permission[] = [];
  selectedPermissions: number[] = [];
  isEditMode = false;
  roleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private permissionTranslaterService: PermissionTranslaterService,
    private translate: TranslateService,
    private errorHandler: ErrorHandlerService
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      permissions: [[], Validators.required],
    });
  }

  drop(event: CdkDragDrop<Permission[]>): void {
    console.log('Datos anteriores:', event.previousContainer.data);
    console.log('Índice anterior:', event.previousIndex);
    console.log('Datos actuales:', event.container.data);
    console.log('Índice actual:', event.currentIndex);

    if (event.previousContainer === event.container) {
      console.log('No se movió el elemento');
      return;
    } else {
      // Ver el dato que se está moviendo
      console.log('Dato que se está moviendo:', event.previousContainer.data[event.previousIndex]);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Verifica que los datos se han transferido correctamente
      console.log('Datos después de la transferencia:');
      console.log('Permisoss:', this.permissions);
      console.log('Permisos seleccionados:', this.selectedPermissionsFull);

      // Actualiza permisos seleccionados
      //this.updateSelectedPermissions();
    }
  }

  ngOnInit(): void {
    this.errorHandler.checkRole('ROLE_ADMIN');
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
            permissions: role.permissions.map(permission => permission.id)
          });
          this.selectedPermissions = role.permissions.map(permission => permission.id);
          this.selectedPermissionsFull = role.permissions;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.translatePermissions();
  }

  translatePermissions(): void {
      //Para cada permiso, hacer una llamada a la API para obtener los datos de ese permiso
      this.permissions.forEach(permission => {
        this.permissionTranslaterService.getPermissionByLanguageAndPermissionId(permission.id,this.translate.currentLang).subscribe(
          (response) => {
            permission.name = response.translation;
          },
          (error) => {
            console.error('Error obteniendo traducción de permiso:', error);
          }
        );
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
        this.selectedPermissionsFull = role.permissions;
      })
    );
  }

  onPermissionChange(permissionId: number, event: any): void {
    if (event.target.checked) {
      this.selectedPermissions.push(permissionId);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
    }
    this.updateSelectedPermissions();
  }

  updateSelectedPermissions(): void {
    this.selectedPermissionsFull = this.selectedPermissions.map(id =>
      this.permissions.find(permission => permission.id === id)!
    );

    // Actualiza el formulario con los IDs de permisos seleccionados
    this.roleForm.patchValue({ permissions: this.selectedPermissions });

    console.log('Permisos seleccionados actualizados:', this.selectedPermissions);
  }

  submitForm(): void {
    const formData = this.roleForm.value;
    console.log('Permisos seleccionados completos:', this.selectedPermissionsFull);
    const formattedPermissions = this.selectedPermissionsFull.map(permission => {
      return {
        id: permission.id,
        name: permission.name,
        entity: permission.entity
      };
    });
    console.log('Permisos formateados:', formattedPermissions);
    formData.permissions = formattedPermissions;
    this.roleForm.patchValue({ permissions: formattedPermissions });
    if (this.roleForm.valid) {

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
