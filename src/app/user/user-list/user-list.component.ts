
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { UserService } from '../service/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() userList: User[] = []; // Esto debería recibir la lista de usuarios desde otro componente

  public sortColumn: keyof User = 'username';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public currentPage: number = 1;
  public itemsPerPage: number = 2;
  public itemsPerPageOptions: number[] = [2, 10, 20, 50];
  public errorMessage: string = '';
  public userToDelete: any = null;
  public selectedUser: any = null;
  public collectionSize: number = 0;
  public isFinalPage: boolean = false;
  public filters: any = {
    username: '',
    email: '',
    role: '',
    status: ''
  };
  filteredUsers: User[] = [];
  public whatis = '';
  public placeholderName = '';
  public placeholderEmail = '';

  public userToActivate: User | null = null;
  public showActivateModal = false;
  showModal = false;
  showDetailsModal = false;
  filterUsername: string = '';
  filterEmail: string = '';
  filterActive: number | null = -1;
  filterDelete: number | null = -1;

  constructor(private userService: UserService,
    private router: Router,
  private translate : TranslateService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.translate.get(['FILTRAR_POR', 'NOMBRE', 'EMAIL'])
      .subscribe(translations => {
        this.placeholderName = `${translations['FILTRAR_POR']} ${translations['NOMBRE']}`;
        this.placeholderEmail = `${translations['FILTRAR_POR']} ${translations['EMAIL']}`;
      });
  }

  applyFilter(): void {
    console.log(`Filtering users with filterUsername: "${this.filterUsername}", filterEmail: "${this.filterEmail}", filterActive: ${this.filterActive}`);

    // Ajustar filterActive si es -1
    const activeFilter = this.filterActive === -1 ? null : this.filterActive;
    const deleteFilter = this.filterDelete === -1 ? null : this.filterDelete;

    this.filteredUsers = this.userList.filter(user =>
      user.username.toLowerCase().includes(this.filterUsername.toLowerCase()) &&
      user.email.toLowerCase().includes(this.filterEmail.toLowerCase()) &&
      (activeFilter === null || user.active === activeFilter) &&
      (deleteFilter === null || user.softDelete === deleteFilter)

    );
  }


  loadUsers(): void {
    this.userService.getUsers()
      .subscribe(
        (data) => {
          this.userList = data;
          this.filteredUsers = this.userList;
          console.log('Users:', this.userList);
          this.sortUsers(); // Ordenar después de recibir los datos si es necesario
          if (this.userList.length === 0) {
            // Si no es la primera página y no hay usuarios, regresar a la página anterior
            if (this.currentPage > 1) {
              this.currentPage--;
              this.loadUsers();
              // Bloquea el botón de siguiente si no hay usuarios
              this.isFinalPage = true;
              return;
            }
            this.errorMessage = 'No se encontraron usuarios';
            console.error('No se encontraron usuarios');
          }
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
  }

  sortUsers(): void {
    this.userList.sort((a, b) => {
      const aValue = this.getProperty(a, this.sortColumn);
      const bValue = this.getProperty(b, this.sortColumn);

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  setSortColumn(column: keyof User): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadUsers();
  }

  firstPage(): void {
    this.currentPage = 1;
    this.userList = [];
    this.isFinalPage = false;
    this.loadUsers();
  }

  nextPage(): void {
    this.currentPage++;
    this.userList = [];
    this.loadUsers();
  }

  lastPage(): void {
    this.currentPage = Math.ceil(this.collectionSize / this.itemsPerPage);
    this.userList = [];
    this.loadUsers();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.userList = [];
      this.isFinalPage = false;
      this.loadUsers();
    }
  }

  applyFilters(): void {
    this.currentPage = 1; // Resetear a la primera página cuando se apliquen los filtros
    this.userList = [];
    this.errorMessage = '';
    this.loadUsers();
  }

  clearFilters(): void {
    this.filterActive = -1;
    this.filterDelete = -1;
    this.filterUsername = '';
    this.filterEmail = '';
    this.errorMessage = '';
    this.applyFilters();
  }

  openDeleteModal(user: any) {
    this.userToDelete = user;
    this.showModal = true;
  }

  closeDeleteModal() {
    this.showModal = false;
    this.userToDelete = null;
  }

  confirmDelete(type : string) {
    // Lógica para eliminar al usuario
    if (this.userToDelete) {
      if(type === 'delete'){
        this.userService.deleteUser(this.userToDelete.id).subscribe(
          (response) => {
            console.log('Usuario eliminado con éxito:', response);
            this.userToDelete = null;
            this.closeDeleteModal();
            this.loadUsers();
          },
          (error) => {
            console.error('Error al eliminar el usuario:', error);
            this.userToDelete = null;
            this.closeDeleteModal();
          }
        );
      }
      this.userService.softDeleteUser(this.userToDelete.id).subscribe(
        (response) => {
          console.log('Usuario eliminado con éxito:', response);
          this.userToDelete = null;
          this.closeDeleteModal();
          this.loadUsers();
        },
        (error) => {
          console.error('Error al eliminar el usuario:', error);
          this.userToDelete = null;
          this.closeDeleteModal();
        }
      );
    }
  }

  viewUserDetails(user: User) {
    this.selectedUser = user;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.selectedUser = null;
    this.showDetailsModal = false;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Resetear a la primera página cuando cambie el número de ítems por página
    this.loadUsers();
  }

  getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }

  openActivateModal(user: User): void {
    this.userToActivate = user;
    this.showActivateModal = true;
    this.whatis = 'activar';
  }

  openDesactivateModal(user: User): void {
    this.userToActivate = user;
    this.showActivateModal = true;
    this.whatis = 'desactivar';
  }

  closeActivateModal(): void {
    this.showActivateModal = false;
    this.userToActivate = null;
  }

  confirmActivate(): void {
    if (this.userToActivate) {
      this.userService.activateUser(this.userToActivate.id).subscribe(
        (response) => {
          this.closeActivateModal();
          this.loadUsers();
          // Actualiza la lista de usuarios o realiza alguna otra acción necesaria
        },
        (error) => {
          this.closeActivateModal();
        }
      );
    }
  }

  canActivate(role : string): boolean {
    console.log('Checking role:', role);
    return this.userService.hasRole(role);
  }
}
