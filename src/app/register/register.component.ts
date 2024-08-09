import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm = this.fb.group({
    username: ['Sooth', [Validators.required]],
    email: ['nik@perpetuator.com', [Validators.required, Validators.email]],
    password: ['superdood', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const username = this.registerForm.get('username')!.value!;
      const email = this.registerForm.get('email')!.value!;
      const password = this.registerForm.get('password')!.value!;

      this.authService.register(username, email, password).subscribe({
        next: (token) => {
          if (token) {
            console.log('Registration successful', token);
            this.router.navigate(['/charts']);
          } else {
            console.log('Registration failed with no token returned');
          }
        },
        error: (error) => {
          console.error('Registration failed', error);
        },
      });
    }
  }
}
