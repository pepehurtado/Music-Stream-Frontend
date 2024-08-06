import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artists.service';
import { ErrorHandlerService } from 'src/app/shared/ErrorHandlerService';

@Component({
  selector: 'app-artists-form',
  templateUrl: './artists-form.component.html',
  styleUrls: ['./artists-form.component.scss']
})
export class ArtistsFormComponent implements OnInit {
  artistForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isEditMode = false;
  artistId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService
  ) {
    this.artistForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      country: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    //Si tiene el rol de administrador, podrá acceder a la vista de creación de artistas. Extraer el rol del jwt almacenado en el localStorage.
    const token = localStorage.getItem('jwt');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log(tokenPayload);
      //si el array de roles no contiene el rol de administrador, se redirige a la página de inicio.
      if (!tokenPayload.roles.includes('ROLE_ADMIN')) {
        this.errorHandler.handleError({ status: 403 });
      }
    } else {
      this.errorHandler.handleError({ status: 403 });
    }
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.artistId = id;
        this.loadArtistData(id);
      }
    });
  }

  loadArtistData(id: string): void {
    this.artistService.getArtistById(id).subscribe(
      (artist) => {
        this.artistForm.patchValue(artist);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = 'Error loading artist data.' + error.error.description;
        console.error('Error loading artist data:', error);
      }
    );
  }

  submitForm(): void {
    if (this.artistForm.valid) {
      const formData = this.artistForm.value;
      if (this.isEditMode && this.artistId) {
        this.artistService.updateArtist(this.artistId, formData).subscribe(
          (response) => {
            this.successMessage = 'Artist updated successfully!';
            this.errorMessage = null;
            setTimeout(() => {
              this.router.navigateByUrl('/artists/list');
            }, 2000);
          },
          (error) => {
            this.errorMessage = 'Error updating artist.' + error.error.description;
            this.successMessage = null;
            console.error('Error updating artist:', error);
          }
        );
      } else {
        this.artistService.createArtist(formData).subscribe(
          (response) => {
            this.successMessage = 'Artist created successfully!';
            this.errorMessage = null;
            this.artistForm.reset();
            setTimeout(() => {
              this.router.navigateByUrl('/artists/list');
            }, 2000);
          },
          (error) => {
            this.errorMessage = 'Error creating artist.' + error.error.description;
            this.successMessage = null;
            console.error('Error creating artist:', error);
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
