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
    this.applyFilters();
  }

  navigateToSongs(album: Album): void {
    console.log('Navigating to songs:', album.title);
    this.router.navigate(['/albums/albums-list-songs'], { state: { album: album.title } });
  }
}
