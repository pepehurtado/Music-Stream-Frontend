import { AlbumService } from './../../../albums/services/albums.service';
import { Component, Input, OnInit } from '@angular/core';
import { SongService } from '../../services/songs.service';
import { Song } from '../interfaces/song.interfaces';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, retry } from 'rxjs';

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
  public selectedSong: Song | null = null;
  public safeUrl: SafeResourceUrl | null = null;

  constructor(private songService: SongService, private albumService: AlbumService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    console.log('Filters:', this.filters);
    if (this.filters.album != null) {
      this.songService.getSongsByAlbum(this.filters.album).subscribe(
        (data: Song[]) => {
          this.songsList = data;
          console.log('Songs:', this.songsList);
        },
        (error) => {
          console.error('Error fetching songs:', error);
        }
      );
    }

    this.songService.getSongs(this.currentPage - 1, this.itemsPerPage, this.sortColumn, this.sortDirection, this.filters)
    .pipe(
      retry(12),
      catchError(error => {
        console.error('Error fetching songs after retries:', error);
        return [];
      })
    ).subscribe(
      (data) => {
        data.forEach(song => {
          if (song.album != null) {
            this.albumService.getAlbumById(song.album)
            .pipe(
              retry(12),
              catchError(error => {
                console.error('Error fetching album after retries:', error);
                return [];
              })
            ).subscribe(
              (album) => {
                song.album_name = album.title;
              },
              (error) => {
                console.error('Error fetching album:', error);
              }
            );
          }
        });
        this.songsList = data;
        this.sortSongs();
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
    this.songsList = [];
    this.loadSongs();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.songsList = [];
      this.loadSongs();
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.songsList = [];
    this.selectedSong = null;
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

  selectSong(song: Song): void {
    this.selectedSong = song;

    // Expresión regular para extraer el ID de la canción de Spotify
    const regex = /\/track\/([a-zA-Z0-9]+)/;
    const match = song.url ? song.url.match(regex) : null;

        const songId = match ? match[1] : null;

        // Construir la URL segura usando el ID de la canción
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://open.spotify.com/embed/track/${songId}?utm_source=generator&autoplay=1`);
}
}
