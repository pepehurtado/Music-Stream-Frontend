import { AlbumService } from './../../../albums/services/albums.service';
import { Component, Input, OnInit } from '@angular/core';
import { SongService } from '../../services/songs.service';
import { Song } from '../interfaces/song.interfaces';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, retry } from 'rxjs';
import { HistoryService } from 'src/app/dashboard/service/history.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from 'src/app/shared/ErrorHandlerService';

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
  public itemsPerPage: number = 2;
  public itemsPerPageOptions: number[] = [2, 10, 20, 50];
  public errorMessage: string = '';
  public songToDelete: any = null;
  public collectionSize: number = 0;
  public filters: any = {
    title: '',
    time: '',
    url: '',
    album: ''
  };
  public selectedSong: Song | null = null;
  public safeUrl: SafeResourceUrl | null = null;
  showModal = false;
  placeholderTitle: string = '';
  placeholderTime: string = '';
  placeholderUrl: string = '';
  placeholderAlbum: string  = '';



  constructor(private songService: SongService,
    private albumService: AlbumService,
    private sanitizer: DomSanitizer,
    private historyService : HistoryService,
    private translate : TranslateService,
    private errorHandler : ErrorHandlerService) { }

  ngOnInit(): void {
    this.errorHandler.checkRole('ROLE_USER');
    this.translate.get([
      'FILTRAR_POR',
      'TITULO',
      'DURACION',
      'URL',
      'ALBUM'
    ]).subscribe(translations => {
      this.placeholderTitle = `${translations['FILTRAR_POR']} ${translations['TITULO']}`;
      this.placeholderTime = `${translations['FILTRAR_POR']} ${translations['DURACION']}`;
      this.placeholderUrl = `${translations['FILTRAR_POR']} ${translations['URL']}`;
      this.placeholderAlbum = `${translations['FILTRAR_POR']} ${translations['ALBUM']}`;
    });
    this.loadSongs();
    this.historyService.getCounts().subscribe(
      (data) => {
        this.collectionSize = data.songs;
        console.log('Songs:', this.collectionSize);
      },
      (error) => {
        console.error('Error fetching history:', error);
      }
    );
  }

  loadSongs(): void {
    console.log('Filters:', this.filters);
    if (this.filters.album != null) {
      this.songService.getSongsByAlbum(this.filters.album).subscribe(
        (data: Song[]) => {
          this.songsList = data;
          console.log('Songs:', this.songsList);
          console.log('No songs found');
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
            this.albumService.getAlbumById(song.album.toString())
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
        if (this.songsList.length === 0) {
          this.errorMessage = 'No songs found';
          console.log('No songs found');
        }
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
    this.errorMessage = '';
    this.loadSongs();
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      time: '',
      url: '',
      album: ''
    };
    this.errorMessage = '';
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

openDeleteModal(artist: any) {
  this.songToDelete = artist;
  this.showModal = true;
}

closeDeleteModal() {
  this.showModal = false;
  this.songToDelete = null;
}

confirmDelete() {
  // Lógica para eliminar al artista
  if (this.songToDelete) {
    // Elimina al artista de la lista (o realiza una llamada a un servicio para eliminarlo)
    this.songService.deleteSong(this.songToDelete.id).subscribe(
      (response) => {
        console.log('Song deleted successfully:', response);
        this.songToDelete = null;
        this.closeDeleteModal();
        this.loadSongs();
      },
      (error) => {
        console.error('Error deleting artist:', error);
        this.songToDelete = null;
        this.closeDeleteModal();
      }
    );
    this.songToDelete = null;
    this.closeDeleteModal();
  }
}

onItemsPerPageChange(): void {
  this.currentPage = 1; // Resetear a la primera página cuando cambie el número de ítems por página
  this.loadSongs();
}

onPageChange(page: number): void {
  this.currentPage = page;
  this.loadSongs();
}

}
