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

  constructor(private songService: SongService, private albumService : AlbumService) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    const rangeStart = (this.currentPage - 1) * this.itemsPerPage;
    const rangeEnd = this.currentPage * this.itemsPerPage - 1;

    this.songService.getSongs().subscribe(
      (data) => {
        //Para cada album quiero que busque el album por id en caso de que el album no sea null y guarde su atributo title
        data.forEach(song => {
          if(song.album != null){
            this.albumService.getAlbumById(song.album).subscribe(
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
        this.sortArtists(); // Ordenar después de recibir los datos
        console.log('Songs:', this.songsList);
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
}
