import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

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
      securityQuestion: [''],
      securityAnswer: ['']
    });
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      const { username, email, password, image, securityQuestion, securityAnswer } = this.registerForm.value;
      this.userService.register(username, email, password, image, securityQuestion, securityAnswer).subscribe(
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
