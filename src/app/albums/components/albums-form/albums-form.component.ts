import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumService } from '../../services/albums.service';
import { ArtistService } from 'src/app/artists/services/artists.service';
import { Artist } from 'src/app/artists/components/interfaces/artists.interfaces';
import { Album } from '../../components/interfaces/album.interfaces';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';

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
  isEditMode = false;
  albumId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private albumService: AlbumService,
    private artistService: ArtistService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.albumForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      year: ['', Validators.required],
      url: ['', Validators.required],
      artist: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.albumId = id;
          // Primero cargar artistas, luego cargar el álbum
          return this.loadArtists().pipe(
            switchMap(() => this.loadAlbumData(id))
          );
        } else {
          // Si no hay ID, solo cargar los artistas
          return this.loadArtists();
        }
      })
    ).subscribe(
      (album) => {
        if (album) {
          console.log('Album:', album);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  loadArtists(): Observable<Artist[]> {
    return this.artistService.getArtist().pipe(
      tap((data) => {
        this.artists = data;
      })
    );
  }

  loadAlbumData(id: string): Observable<Album> {
    return this.albumService.getAlbumById(id).pipe(
      tap((album) => {
        this.albumForm.patchValue(album);
        if (album.artist) {
          this.selectedArtist = this.artists.find(artist => artist.id === album.artist) || null;
          this.albumForm.patchValue({
            artist: { id: album.artist }
          });
          this.artistInput = this.selectedArtist ? this.selectedArtist.name : '';
        }
      })
    );
  }

  searchArtists(event: any): void {
    const search = event.target.value.toLowerCase();
    this.filteredArtists = this.artists.filter((artist) => artist.name.toLowerCase().includes(search));
  }

  addArtist(artist: Artist): void {
    this.selectedArtist = artist;
    this.albumForm.patchValue({
      artist: { id: artist.id }
    });
    this.artistInput = artist.name;
    this.filteredArtists = [];
  }

  removeArtist(): void {
    this.selectedArtist = null;
    this.albumForm.patchValue({
      artist: null
    });
  }

  submitForm(): void {
    if (this.albumForm.valid) {
      const formData = this.albumForm.value;
      if (this.isEditMode && this.albumId) {
        this.albumService.updateAlbum(this.albumId, formData).subscribe(
          (response) => {
            this.successMessage = 'Album updated successfully!';
            this.errorMessage = null;
            setTimeout(() => {
              this.router.navigateByUrl('/albums');
            }, 2000);
          },
          (error) => {
            this.errorMessage = 'Error updating album. ' + error.error.description;
            this.successMessage = null;
            console.error('Error updating album:', error);
          }
        );
      } else {
        this.albumService.createAlbum(formData).subscribe(
          (response) => {
            this.successMessage = 'Album created successfully!';
            this.errorMessage = null;
            this.albumForm.reset();
            setTimeout(() => {
              this.router.navigateByUrl('/albums');
            }, 2000);
          },
          (error) => {
            this.errorMessage = 'Error creating album. ' + error.error.description;
            this.successMessage = null;
            console.error('Error creating album:', error);
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
