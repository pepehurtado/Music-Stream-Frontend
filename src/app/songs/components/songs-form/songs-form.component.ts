import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../services/songs.service';
import { Artist } from 'src/app/artists/components/interfaces/artists.interfaces';
import { ArtistService } from 'src/app/artists/services/artists.service';

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

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private router: Router
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

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.loadArtists();
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.songId = +id;
        this.loadSongData(this.songId);
      }
    });
  }

  loadSongData(id: number): void {
    this.songService.getSongById(id).subscribe(
      (song) => {
        this.songForm.patchValue({
          title: song.title,
          time: song.time,
          url: song.url,
          album: song.album || ''
        });
        //Como song.artists es un array de enteros, se debe buscar el objeto artista correspondiente
        this.selectedArtists = song.artists.map((artistId: number) => this.artists.find(artist => artist.id === artistId)!);
        console.log('Selected artists:', this.selectedArtists);
        this.updateArtistsField();
      },
      (error) => {
        this.errorMessage = 'Error loading song data. ' + error.error.description;
        console.error('Error loading song data:', error);
      }
    );
  }

  loadArtists(): void {
    this.artistService.getArtist().subscribe(
      (data) => {
        this.artists = data;
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
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

  addArtist(artist: Artist): void {
    if (!this.selectedArtists.includes(artist)) {
      this.selectedArtists.push(artist);
    }
    this.updateArtistsField();
    this.songForm.get('artistSearch')?.reset();
    this.filteredArtists = [];
  }

  removeArtist(artist: Artist): void {
    this.selectedArtists = this.selectedArtists.filter(a => a !== artist);
    this.updateArtistsField();
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
      if (formData.album === '') {
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
