import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlbumService } from '../../services/albums.service';
import { ArtistService } from 'src/app/artists/services/artists.service';
import { Artist } from 'src/app/artists/components/interfaces/artists.interfaces';

@Component({
  selector: 'app-albums-form',
  templateUrl: './albums-form.component.html',
  styleUrls: ['./albums-form.component.scss']
})
export class AlbumsFormComponent implements OnInit {
  albumForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  artists: Artist[] = [];
  selectedArtist: Artist | null = null;
  filteredArtists: Artist[] = [];
  artistInput: string = '';

  constructor(
    private fb: FormBuilder,
    private albumService: AlbumService,
    private router: Router,
    private artistService: ArtistService
  ) {
    this.albumForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      year: ['', Validators.required],
      url: ['', Validators.required],
      artist: ['', Validators.required],
      number_of_songs: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadArtists();
  }

  removeArtist(): void {
    this.selectedArtist = null;
    this.albumForm.patchValue({
      artist: null
    });
  }

  searchArtists(event: any): void {
    const search = event.target.value.toLowerCase();
    this.filteredArtists = this.artists.filter((artist) => artist.name.toLowerCase().includes(search));
  }


  addArtist(artist: Artist): void {
    this.selectedArtist = artist;
    this.albumForm.patchValue({
      artist: artist // Cambiado a un objeto con id
    });
    this.artistInput = artist.name;
    this.filteredArtists = [];
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

  submitForm(): void {
    if (this.albumForm.valid) {
      const formData = this.albumForm.value;
      this.albumService.createAlbum(formData).subscribe(
        (response) => {
          this.successMessage = 'Album created successfully!';
          this.errorMessage = null;
          this.albumForm.reset();
          setTimeout(() => {
            this.router.navigateByUrl('/albums');
          }, 2000); // Redirigir a la lista de artistas después de 2 segundos
        },
        (error) => {
          this.errorMessage = 'Error creating album.' + error.error.description;
          this.successMessage = null;
          console.error('Error creating album:', error);
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
