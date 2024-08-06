import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/roles.service';
import { Role, Permission } from '../../interfaces/role.interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Importa el servicio del modal si usas ng-bootstrap
import { Router } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { TranslateService } from '@ngx-translate/core';
import { PermissionTranslaterService } from '../../services/permision-translater.service';
import { PermissionTranslater } from '../../interfaces/permission-translater.interfaces';

@Component({
  selector: 'app-role-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  roles: Role[] = [];
  filteredRoles: Role[] = [];
  allPermissions: Permission[] = []; // Permisos disponibles para seleccionar
  filterText: string = '';
  selectedPermissionIds: number[] = []; // IDs de permisos seleccionados en el checkbox
  isSortedAscending: boolean = true;
  errorMessage: string = '';
  selectedRole: Role | null = null;
  deleteModal: boolean = false;
  isDropdownOpen: boolean = false;
  placeholderName: string = '';
  allTranslations: PermissionTranslater[] = [];

  constructor(
    private roleService: RoleService,
    private modalService: NgbModal, // Usa NgbModal si usas ng-bootstrap
    private router: Router,
    private permissionService: PermissionService,
    private permissionTranslaterService   : PermissionTranslaterService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions(); // Cargar permisos disponibles
    this.loadTranslatedPermission(); // Cargar permisos traducidos
    this.translate.get(['FILTRAR_POR', 'NOMBRE'])
      .subscribe(translations => {
        this.placeholderName = `${translations['FILTRAR_POR']} ${translations['NOMBRE']}`;
      });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  loadRoles(): void {
    this.roleService.getRole().subscribe(
      (roles: Role[]) => {
        this.roles = roles;
        this.applyFilter();
      },
      (error) => {
        this.errorMessage = 'Error loading roles: ' + error.message;
      }
    );
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe(
      (permissions: Permission[]) => {
        this.allPermissions = permissions;
      },
      (error) => {
        this.errorMessage = 'Error loading permissions: ' + error.message;
      }
    );
  }

  loadTranslatedPermission() : void {
    this.permissionTranslaterService.getPermissionsByLanguage(this.translate.currentLang).subscribe(
      (permissions: PermissionTranslater[]) => {
        this.allTranslations = permissions;
      },
      (error) => {
        this.errorMessage = 'Error loading permissions: ' + error.message;
      }
    );
  }

  applyFilter(): void {
    this.filteredRoles = this.roles.filter(role =>
      role.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
      (this.selectedPermissionIds.length === 0 ||
        this.selectedPermissionIds.every(permissionId =>
          role.permissions.some(permission => permission.id === permissionId)
        )
      )
    );
    this.toggleSort(); // Para asegurar que el sorting se aplique después del filtrado
  }

  onPermissionChange(event: any): void {
    const permissionId = Number(event.target.value);
    console.log('Permission changed:', permissionId, event.target.checked);
    if (event.target.checked) {
      this.selectedPermissionIds.push(permissionId);
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter(id => id !== permissionId);
    }
    this.applyFilter(); // Aplicar filtro después de cambiar la selección
  }

  toggleSort(): void {
    this.isSortedAscending = !this.isSortedAscending;
    this.filteredRoles.sort((a, b) =>
      this.isSortedAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }

  openDeleteModal(role: any) {
    this.selectedRole = role;
    this.deleteModal = true;
  }

  closeDeleteModal() {
    this.deleteModal = false;
    this.selectedRole = null;
  }

  confirmDelete() {
    if (this.selectedRole) {
      this.roleService.deleteRole(this.selectedRole.id).subscribe(
        (response) => {
          console.log('Role deleted successfully:', response);
          this.selectedRole = null;
          this.closeDeleteModal();
          this.loadRoles();
        },
        (error) => {
          console.error('Error deleting role:', error);
          this.selectedRole = null;
          this.closeDeleteModal();
        }
      );
      this.selectedRole = null;
      this.closeDeleteModal();
    }
  }

  clearFilters(): void {
    this.filterText = '';
    this.selectedPermissionIds = [];
    this.applyFilter();
  }

  getTranslatedPermissionName(permissionId: number): string {
    const permission = this.allTranslations.find(p => p.permission.id === permissionId);
    return permission ? permission.translation : 'Unknown Permission'; // Fallback en caso de que no se encuentre
  }
}
