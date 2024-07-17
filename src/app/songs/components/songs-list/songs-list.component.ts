import { AlbumService } from './../../../albums/services/albums.service';
import { Component, Input, OnInit } from '@angular/core';
import { SongService } from '../../services/songs.service';
import { Song } from '../interfaces/song.interfaces';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html',
  styleUrls: ['./songs-list.component.scss']
})
export class SongsListComponent implements OnInit {
  @Input()
  public songsList: Song[] = [];

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
    this.loadSongs();
  }

  loadSongs(): void {
    console.log('Filters:', this.filters);
    if(this.filters.album != null) {
      this.songService.getSongsByAlbum(this.filters.album).subscribe(
        (data: Song[]) => {
          this.songsList = data; // Asigna los datos de las canciones recibidas
          console.log('Songs:', this.songsList);
        },
        (error) => {
          console.error('Error fetching songs:', error);
        }
      );
    }

    this.songService.getSongs(this.currentPage - 1, this.itemsPerPage, this.sortColumn, this.sortDirection, this.filters)
      .subscribe(
        (data) => {
          // Para cada álbum, busca el álbum por ID en caso de que el álbum no sea null y guarda su atributo title
          data.forEach(song => {
            if (song.album != null) {
              this.albumService.getAlbumById(song.album).subscribe(
                (album) => {
                  song.album_name = album.title;
                },
                (error) => {
                  console.error('Error fetching album:', error);
                  //Volver a cargar
                }
              );
            }
          });
          this.songsList = data;
          this.sortSongs(); // Ordenar después de recibir los datos
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

  sortSongs(): void {
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
    this.loadSongs();
  }

  nextPage(): void {
    this.currentPage++;
    this.loadSongs();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadSongs();
    }
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters are applied
    this.loadSongs();
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
