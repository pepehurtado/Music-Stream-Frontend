import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { retry } from 'rxjs';
import { Song } from 'src/app/songs/components/interfaces/song.interfaces';
import { SongService } from 'src/app/songs/services/songs.service';

@Component({
  selector: 'app-albums-list-songs',
  templateUrl: './albums-list-songs.component.html',
  styleUrls: ['./albums-list-songs.component.scss']
})
export class AlbumsListSongsComponent implements OnInit {

  album : string = '';
  songs: Song[] = []; // Ajusta la estructura según la interfaz de canción que tengas

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
  ) { }

  ngOnInit(): void {
    const state = window.history.state;
    if (state && state.album) {
      this.album = state.album;
      this.fetchSongsByAlbum(this.album);
    } else {
      console.error('No album name found in navigation state');
    }
  }

  fetchSongsByAlbum(albumName: string): void {
    this.songService.getSongsByAlbum(albumName)
    .pipe(
      retry(12)
    )
    .subscribe(
      (data: Song[]) => {
        this.songs = data; // Asigna los datos de las canciones recibidas
        console.log('Songs:', this.songs);
      },
      (error) => {
        console.error('Error fetching songs:', error);
      }
    );
  }
}
