import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.userService.login(username, password).subscribe(
        //Si la respuesta es correcta, se guarda el token en localStorage y se redirige a la página principal
        (response: any) => {
          console.log("response", response);
          localStorage.setItem('jwt', response.token);
          this.router.navigate(['/dashboard']);
        },
        //Si la respuesta es incorrecta, se muestra un mensaje de error
        error => {
          this.errorMessage = 'Invalid username or password';
          console.error('Error logging in:', error);
        }
      );
    }
  }
}
