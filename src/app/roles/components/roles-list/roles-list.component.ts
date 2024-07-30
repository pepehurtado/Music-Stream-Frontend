import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/roles.service';
import { Role } from '../../interfaces/role.interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Importa el servicio del modal si usas ng-bootstrap
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  roles: Role[] = [];
  filteredRoles: Role[] = [];
  filterText: string = '';
  isSortedAscending: boolean = true;
  errorMessage: string = '';
  selectedRole: Role | null = null;
  deleteModal: boolean = false;

  constructor(
    private roleService: RoleService,
    private modalService: NgbModal, // Usa NgbModal si usas ng-bootstrap
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
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

  applyFilter(): void {
    this.filteredRoles = this.roles.filter(role =>
      role.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
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
    // Lógica para eliminar al artista
    if (this.selectedRole) {
      // Elimina al artista de la lista (o realiza una llamada a un servicio para eliminarlo)
      this.roleService.deleteRole(this.selectedRole.id).subscribe(
        (response) => {
          console.log('Song deleted successfully:', response);
          this.selectedRole = null;
          this.closeDeleteModal();
          this.loadRoles();
        },
        (error) => {
          console.error('Error deleting artist:', error);
          this.selectedRole = null;
          this.closeDeleteModal();
        }
      );
      this.selectedRole = null;
      this.closeDeleteModal();
    }
  }
}

