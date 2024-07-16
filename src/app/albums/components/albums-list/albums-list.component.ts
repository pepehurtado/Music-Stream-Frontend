import { Component, Input, OnInit } from '@angular/core';
import { AlbumService } from '../../services/albums.service';
import { Album } from '../interfaces/album.interfaces';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit {
  @Input()
  public albumsList: Album[] = [];

  public sortColumn: keyof Album = 'title';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public filters: any = {
    title: '',
    description: '',
    year: '',
    url: '',
    artist_id: ''
  };

  constructor(private albumService: AlbumService) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    const rangeStart = (this.currentPage - 1) * this.itemsPerPage;
    const rangeEnd = this.currentPage * this.itemsPerPage - 1;

    this.albumService.getAlbums().subscribe(
      (data) => {
        this.albumsList = data;
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
      title: '',
      description: '',
      year: '',
      url: '',
      artist_id: ''
    };
    this.applyFilters();
  }
}
