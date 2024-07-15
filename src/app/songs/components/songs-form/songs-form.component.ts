import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SongService } from '../../services/songs.service';

@Component({
  selector: 'app-songs-form',
  templateUrl: './songs-form.component.html',
  styleUrls: ['./songs-form.component.scss']
})
export class SongsFormComponent implements OnInit {
  songForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private router: Router
  ) {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      time: ['', Validators.required],
      url: ['', Validators.required],
      album_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submitForm(): void {
    if (this.songForm.valid) {
      const formData = this.songForm.value;
      this.songService.createSong(formData).subscribe(
        (response) => {
          this.successMessage = 'Song created successfully!';
          this.errorMessage = null;
          this.songForm.reset();
          setTimeout(() => {
            this.router.navigateByUrl('/songs');
          }, 2000); // Redirigir a la lista de artistas después de 2 segundos
        },
        (error) => {
          this.errorMessage = 'Error creating song. Please try again.';
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
