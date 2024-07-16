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
  public filters: any = {
    name: '',
    age: '',
    country: '',
    dateOfBirth: ''
  };

  constructor(private artistService: ArtistService, private router: Router) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    const rangeStart = (this.currentPage - 1) * this.itemsPerPage;
    const rangeEnd = this.currentPage * this.itemsPerPage - 1;

    this.artistService.getArtists().subscribe(
      (data) => {
        this.artistList = data;
        console.log('Artists:', this.artistList);
        this.sortArtists(); // Ordenar después de recibir los datos
      },
      (error) => {
        console.error('Error fetching artists:', error);
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
    this.sortArtists();
  }

  nextPage(): void {
    this.currentPage++;
    this.loadArtists();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadArtists();
    }
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters are applied
    this.loadArtists();
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      age: '',
      country: '',
      dateOfBirth: ''
    };
    this.applyFilters();
  }

  navigateToSongs(artist: Artist): void {
    // Navegar a la ruta de canciones con el identificador de lista de canciones del artista
    // Esto asume que artist.singleSongList contiene la lista de canciones del artista
    // Si artist.singleSongList es un array de IDs de canciones, deberás cargar esas canciones primero
    console.log('Navigating to songs:', artist.singleSongList);
    this.router.navigate(['/artists/artists-list-songs'], { state: { songsList: artist.singleSongList } });
  }
}
