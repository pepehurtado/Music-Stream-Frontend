import { Component, Input, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artists.service';
import { Artist } from '../interfaces/artists.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {
  @Input() artistList: Artist[] = []; // Esto debería recibir la lista de artistas desde otro componente

  public sortColumn: keyof Artist = 'name';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public errorMessage: string = '';
  public filters: any = {
    name: '',
    age: '',
    country: '',
    dateOfBirth: ''
  };
  showModal = false;
  artistToDelete: any = null;

  constructor(private artistService: ArtistService, private router: Router) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.artistService.getArtists(this.currentPage - 1, this.itemsPerPage, this.sortColumn, this.sortDirection, this.filters)
      .subscribe(
        (data) => {
          this.artistList = data;
          console.log('Artists:', this.artistList);
          this.sortArtists(); // Ordenar después de recibir los datos si es necesario
          if (this.artistList.length === 0) {
            this.errorMessage = 'No artists found';
            console.error('No artists found');
          }
        },
        (error) => {
          console.error('Error fetching artists:', error);
          this.loadArtists(); // Intentar cargar de nuevo en caso de error
        }
      );
  }

  getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }

  sortArtists(): void {
    this.artistList.sort((a, b) => {
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

  setSortColumn(column: keyof Artist): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadArtists();
  }

  nextPage(): void {
    this.currentPage++;
    this.artistList = [];
    this.loadArtists();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.artistList = [];
      this.loadArtists();
    }
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters are applied
    this.artistList = [];
    this.errorMessage = '';
    this.loadArtists();
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      age: '',
      country: '',
      dateOfBirth: ''
    };
    this.errorMessage = '';
    this.applyFilters();
  }

  navigateToSongs(artist: Artist): void {
    console.log('Navigating to songs:', artist.singleSongList);
    this.router.navigate(['/artists/artists-list-songs'], { state: { songsList: artist.singleSongList, artist: artist.name } });
  }


  openDeleteModal(artist: any) {
    this.artistToDelete = artist;
    this.showModal = true;
  }

  closeDeleteModal() {
    this.showModal = false;
    this.artistToDelete = null;
  }

  confirmDelete() {
    // Lógica para eliminar al artista
    if (this.artistToDelete) {
      // Elimina al artista de la lista (o realiza una llamada a un servicio para eliminarlo)
      this.artistService.deleteArtist(this.artistToDelete.id).subscribe(
        (response) => {
          console.log('Artist deleted successfully:', response);
          this.artistToDelete = null;
          this.closeDeleteModal();
          this.loadArtists();
        },
        (error) => {
          console.error('Error deleting artist:', error);
          this.artistToDelete = null;
          this.closeDeleteModal();
        }
      );
      this.artistToDelete = null;
      this.closeDeleteModal();
    }
  }

}
