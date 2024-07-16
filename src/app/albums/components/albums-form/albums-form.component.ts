import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlbumService } from '../../services/albums.service';

@Component({
  selector: 'app-albums-form',
  templateUrl: './albums-form.component.html',
  styleUrls: ['./albums-form.component.scss']
})
export class AlbumsFormComponent implements OnInit {
  albumForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private albumService: AlbumService,
    private router: Router
  ) {
    this.albumForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      year: ['', Validators.required],
      url: ['', Validators.required],
      artist_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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
          this.errorMessage = 'Error creating album. Please try again.';
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
