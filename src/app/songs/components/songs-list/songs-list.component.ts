import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../interfaces/song.interfaces';
import { AlbumService } from './../../../albums/services/albums.service';
import { SongService } from '../../services/songs.service';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html',
  styleUrls: ['./songs-list.component.scss']
})
export class SongsListComponent implements OnInit {
  @Input()
  public songsList: Song[] = []; // Lista de canciones proporcionada desde el componente padre

  public allSongs: Song[] = []; // Variable para almacenar todas las canciones cargadas desde la API
  public sortColumn: keyof Song = 'title';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public filters: any = {
    title: '',
    time: '',
    url: '',
    album: ''
  };

  constructor(private songService: SongService, private albumService: AlbumService) { }

  ngOnInit(): void {
    if (this.songsList.length === 0) {
      // Si no se proporciona ninguna lista de canciones, cargar todas las canciones desde la API
      this.loadAllSongs();
    } else {
      // Si se proporciona una lista de canciones, utilizar esa lista
      this.songsList = [...this.songsList]; // Clonar la lista para evitar mutaciones inesperadas
      this.sortArtists(); // Ordenar después de recibir los datos
    }
  }

  loadAllSongs(): void {
    const rangeStart = (this.currentPage - 1) * this.itemsPerPage;
    const rangeEnd = this.currentPage * this.itemsPerPage - 1;

    this.songService.getSongs().subscribe(
      (data) => {
        this.allSongs = data;
        this.songsList = [...this.allSongs]; // Copiar todas las canciones a la lista mostrada
        this.sortArtists(); // Ordenar después de recibir los datos
        console.log('Songs:', this.songsList);
      },
      (error) => {
        console.error('Error fetching songs:', error);
      }
    );
  }

  getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }

  sortArtists(): void {
    this.songsList.sort((a, b) => {
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

  setSortColumn(column: keyof Song): void {
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
    if (this.songsList.length === 0) {
      this.loadAllSongs();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.songsList.length === 0) {
        this.loadAllSongs();
      }
    }
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters are applied
    if (this.songsList.length === 0) {
      this.loadAllSongs();
    }
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      time: '',
      url: '',
      album: ''
    };
    this.applyFilters();
  }
}
