import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArtistService } from '../../services/artists.service';

@Component({
  selector: 'app-artists-form',
  templateUrl: './artists-form.component.html',
  styleUrls: ['./artists-form.component.scss']
})
export class ArtistsFormComponent implements OnInit {
  artistForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private router: Router
  ) {
    this.artistForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      country: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submitForm(): void {
    if (this.artistForm.valid) {
      const formData = this.artistForm.value;
      this.artistService.createArtist(formData).subscribe(
        (response) => {
          this.successMessage = 'Artist created successfully!';
          this.errorMessage = null;
          this.artistForm.reset();
          setTimeout(() => {
            this.router.navigateByUrl('/artists');
          }, 2000); // Redirigir a la lista de artistas después de 2 segundos
        },
        (error) => {
          this.errorMessage = 'Error creating artist. Please try again.';
          this.successMessage = null;
          console.error('Error creating artist:', error);
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
