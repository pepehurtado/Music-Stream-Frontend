import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../services/songs.service';
import { Artist } from 'src/app/artists/components/interfaces/artists.interfaces';
import { ArtistService } from 'src/app/artists/services/artists.service';
import { Album } from 'src/app/albums/components/interfaces/album.interfaces';
import { AlbumService } from 'src/app/albums/services/albums.service';
import { forkJoin, Observable, tap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ErrorHandlerService } from 'src/app/shared/ErrorHandlerService';


@Component({
  selector: 'app-songs-form',
  templateUrl: './songs-form.component.html',
  styleUrls: ['./songs-form.component.scss']
})
export class SongsFormComponent implements OnInit {
  songForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  artists: Artist[] = [];
  filteredArtists: Artist[] = [];
  selectedArtists: Artist[] = [];
  isEditMode = false;
  songId: number | null = null;
  albums: Album[] = [];
  filteredAlbums: Album[] = [];
  selectedAlbum: Album | null = null;
  albumInput  = '';

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private route: ActivatedRoute,
    private router: Router,
    private translate : TranslateService,
    private errorHandler : ErrorHandlerService
  ) {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      time: ['', Validators.required],
      url: ['', Validators.required],
      artistSearch: [''],
      album: [''],
      artists: [[]] // Campo para los artistas seleccionados
    });
  }

loadAlbums(): Observable<Album[]> {
  return this.albumService.getAlbum().pipe(
    tap({
      next: (albums) => this.albums = albums,
      error: (error) => console.error('Error fetching albums:', error)
    })
  );
}

ngOnInit(): void {
  this.errorHandler.checkRole('ROLE_ADMIN');
  this.route.paramMap.subscribe(params => {
    // Usamos forkJoin para cargar artistas y álbumes en paralelo
    forkJoin([this.loadArtists(), this.loadAlbums()]).subscribe({
      next: ([artists, albums]) => {
        this.artists = artists;
        this.albums = albums;
        const id = params.get('id');
        if (id) {
          console.log('Edit mode:', id);
          this.isEditMode = true;
          this.songId = +id;
          this.loadSongData(this.songId);
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  });
}

  loadSongData(id: number): void {
    this.songService.getSongById(id).subscribe(
      (song) => {
        console.log('Song data:', song);
        this.songForm.patchValue({
          title: song.title,
          time: song.time,
          url: song.url,
          album: song.album || '',
        });
        console.log('Artists:', song.artists);

        console.log('Total artists:', this.artists);
        //Como song.artists es un array de enteros, se debe buscar el objeto artista correspondiente
        this.selectedArtists = song.artists.map((artistId: number) => this.artists.find(artist => artist.id === artistId)!);
        //Poner el nombre del album en el campo de texto buscando el objeto correspondiente de albums por id
        this.selectedAlbum = song.album ? this.albums.find(album => album.id === song.album)! : null;
        this.albumInput = this.selectedAlbum ? this.selectedAlbum.title : '';
        this.songForm.patchValue({
          album: { id: song.album }
        });
        console.log('Selected artists:', this.selectedArtists);
        this.updateArtistsField();
      },
      (error) => {
        this.errorMessage = 'Error loading song data. ' + error.error.description;
        console.error('Error loading song data:', error);
      }
    );
  }

  loadArtists(): Observable<Artist[]> {
    return this.artistService.getArtist().pipe(
      tap({
        next: (artists) => this.artists = artists,
        error: (error) => console.error('Error fetching artists:', error)
      })
    );
  }

  searchArtists(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.trim();
    if (searchTerm === '') {
      this.filteredArtists = [];
      return;
    }
    this.filteredArtists = this.artists.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  searchAlbum(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.trim();
    if (searchTerm === '') {
      this.filteredAlbums = [];
      return;
    }
    this.filteredAlbums = this.albums.filter(album =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  addArtist(artist: Artist): void {
    if (!this.selectedArtists.includes(artist)) {
      this.selectedArtists.push(artist);
    }
    this.updateArtistsField();
    this.songForm.get('artistSearch')?.reset();
    this.filteredArtists = [];
  }

  addAlbum(album: Album): void {
    this.selectedAlbum = album;
    this.songForm.patchValue({
      album: { id: album.id }
    });
    this.albumInput = album.title;
    this.filteredAlbums = [];
  }

  removeArtist(artist: Artist): void {
    this.selectedArtists = this.selectedArtists.filter(a => a !== artist);
    this.updateArtistsField();
  }

  removeAlbum(): void {
    this.selectedAlbum = null;
    this.songForm.patchValue({
      album: ''
    });
  }

  updateArtistsField(): void {
    this.songForm.patchValue({
      artists: this.selectedArtists.map(artist => ({ id: artist.id }))
    });
  }

  submitForm(): void {
    if (this.songForm.valid) {
      const formData = this.songForm.value;
      delete formData.artistSearch;
      console.log('Form data:', formData);
      if (formData.album.id === null || formData.album === '') {
        delete formData.album;
      }
      if (this.isEditMode && this.songId) {
        this.songService.updateSong(this.songId, formData).subscribe(
          (response) => {
            this.successMessage = 'Song updated successfully!';
            this.errorMessage = null;
            setTimeout(() => {
              this.router.navigateByUrl('/songs');
            }, 2000);
          },
          (error) => {
            this.errorMessage = 'Error updating song. ' + error.error.description;
            this.successMessage = null;
            console.error('Error updating song:', error);
          }
        );
      } else {
        this.songService.createSong(formData).subscribe(
          (response) => {
            this.successMessage = 'Song created successfully!';
            this.errorMessage = null;
            this.songForm.reset();
            this.selectedArtists = [];
            setTimeout(() => {
              this.router.navigateByUrl('/songs');
            }, 2000);
          },
          (error) => {
            this.errorMessage = 'Error creating song. ' + error.error.description;
            this.successMessage = null;
            console.error('Error creating song:', error);
          }
        );
      }
    } else {
      this.errorMessage = 'Please fill out all required fields.';
      this.successMessage = null;
    }
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
