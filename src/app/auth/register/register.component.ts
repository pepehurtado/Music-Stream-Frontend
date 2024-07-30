import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  selectedFile: File | null = null;
  readonly maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      image: [''],
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (file.size > this.maxSizeInBytes) {
        this.errorMessage = 'File size should not exceed 2 MB.';
        this.selectedFile = null;
      } else if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
        this.selectedFile = file;
        this.errorMessage = null;
      } else {
        this.errorMessage = 'Only PNG, JPG, and JPEG files are allowed.';
        this.selectedFile = null;
      }
    }
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = (reader.result as string).split(',')[1];
          this.userService.register(username, email, password, base64Image).subscribe(
            () => {
              this.router.navigate(['/user/login']);
            },
            error => {
              this.errorMessage = 'Registration failed';
              console.error('Error registering:', error);
            }
          );
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        this.userService.register(username, email, password, "null").subscribe(
          () => {
            this.router.navigate(['/user/login']);
          },
          error => {
            this.errorMessage = 'Registration failed';
            console.error('Error registering:', error);
          }
        );
      }
    }
  }
}
