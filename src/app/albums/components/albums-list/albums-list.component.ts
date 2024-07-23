import { Component, Input, OnInit } from '@angular/core';
import { AlbumService } from '../../services/albums.service';
import { Album } from '../interfaces/album.interfaces';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit {
  @Input()
  public albumsList: Album[] = [];
  public albumToDelete: Album | null = null;
  public sortColumn: keyof Album = 'title';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public errorMessage: string = '';
  public filters: any = {
    title: '',
    description: '',
    year: '',
    url: '',
    artist_id: ''
  };
  public showModal : boolean = false;

  constructor(private albumService: AlbumService, private router: Router) { }

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.albumService.getAlbums(this.currentPage - 1, this.itemsPerPage, this.sortColumn, this.sortDirection, this.filters)
    .pipe(
      retry(12),
      catchError(error => {
        console.error('Error fetching songs after retries:', error);
        return [];
      })
    )
      .subscribe(
        (data) => {
          this.albumsList = data;
          this.sortAlbums(); // Ordenar después de recibir los datos
          console.log('Albums:', this.albumsList);
          if (this.albumsList.length === 0) {
            this.errorMessage = 'No albums found';
            console.error('No albums found');
          }
        },
        (error) => {
          console.error('Error fetching albums:', error);
        }
      );
  }

  getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }

  sortAlbums(): void {
    this.albumsList.sort((a, b) => {
      const aValue = this.getProperty(a, this.sortColumn) ?? '';
      const bValue = this.getProperty(b, this.sortColumn) ?? '';

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  setSortColumn(column: keyof Album): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadAlbums();
  }

  nextPage(): void {
    this.currentPage++;
    this.albumsList = [];
    this.loadAlbums();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.albumsList = [];
      this.loadAlbums();
    }
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters are applied
    this.albumsList = [];
    this.errorMessage = '';
    this.loadAlbums();
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      description: '',
      year: '',
      url: '',
      artist_id: ''
    };
    this.errorMessage = '';
    this.applyFilters();
  }

  navigateToSongs(album: Album): void {
    console.log('Navigating to songs:', album.title);
    this.router.navigate(['/albums/albums-list-songs'], { state: { album: album.title } });
  }

  openDeleteModal(album: Album) {
    this.albumToDelete = album;
    this.showModal = true;
  }

  closeDeleteModal() {
    this.showModal = false;
    this.albumToDelete = null;
  }

  confirmDelete() {
    // Lógica para eliminar al artista
    if (this.albumToDelete) {
      // Elimina al artista de la lista (o realiza una llamada a un servicio para eliminarlo)
      this.albumService.deleteAlbum(this.albumToDelete.id.toString()).subscribe(
        (response) => {
          console.log('Artist deleted successfully:', response);
          this.albumToDelete = null;
          this.closeDeleteModal();
          this.loadAlbums();
        },
        (error) => {
          console.error('Error deleting artist:', error);
          this.albumToDelete = null;
          this.closeDeleteModal();
        }
      );
      this.albumToDelete = null;
      this.closeDeleteModal();
    }
  }


}
