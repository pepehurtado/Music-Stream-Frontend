import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private artistService: ArtistService, // Ajusta el servicio de artistas según sea necesario
    private router: Router
  ) {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      time: ['', Validators.required],
      url: ['', Validators.required],
      artistSearch: [''],
      album: [''],
      artists: [[]] // Agregar campo artists en el formulario
    });
  }

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.artistService.getArtist().subscribe(
      (data) => {
        this.artists = data;
      },
      (error) => {
        console.error('Error fetching artists:', error);
        this.loadArtists();
      }
    );
  }

  searchArtists(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.trim(); // Asegúrate de usar .trim() para eliminar espacios en blanco
    if (searchTerm === '') {
      this.filteredArtists = []; // Limpiar la lista si no hay término de búsqueda
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
    this.updateArtistsField(); // Actualizar el campo artists en el formulario
    this.songForm.get('artistSearch')?.reset();
    this.filteredArtists = [];
  }

  removeArtist(artist: Artist): void {
    this.selectedArtists = this.selectedArtists.filter(a => a !== artist);
    this.updateArtistsField(); // Actualizar el campo artists en el formulario
  }

  updateArtistsField(): void {
    this.songForm.patchValue({
      artists: this.selectedArtists.map(artist => ({ id: artist.id }))
    });
  }

  submitForm(): void {
    if (this.songForm.valid) {
      const formData = this.songForm.value;
      //Eliminar del formulario el campo artistSearch
      delete formData.artistSearch;
      if(formData.album === '') {
        delete formData.album;
      }
      this.songService.createSong(formData).subscribe(
        (response) => {
          this.successMessage = 'Song created successfully!';
          this.errorMessage = null;
          this.songForm.reset();
          this.selectedArtists = [];
          setTimeout(() => {
            this.router.navigateByUrl('/songs');
          }, 1300);
        },
        (error) => {
          this.errorMessage = 'Error creating song. ' + error.error.description;
          this.successMessage = null;
          console.error('Error creating song:', error);
        }
      );
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
