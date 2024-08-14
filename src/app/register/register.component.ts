import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatError,
    MatLabel,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatFormField,
    MatCardActions,
    MatInput,
    MatButton,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatIcon,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  // TODO: Add validation equivalent to back-end
  errors: string[] = [];
  registerForm = this.fb.group({
    username: [environment.TEST_USERNAME ?? '', [Validators.required, Validators.minLength(2)]],
    email: [environment.TEST_EMAIL ?? '', [Validators.required, Validators.email]],
    password: [environment.TEST_PASSWORD ?? '', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: [environment.TEST_USERNAME ?? '', [Validators.required]],
      email: [environment.TEST_EMAIL ?? '', [Validators.required, Validators.email]],
      password: [environment.TEST_PASSWORD ?? '', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.errors = [];
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
            for (const error of this.authService.getErrors()) {
              this.errors.push(error.toString());
            }
            if (this.errors.length === 0) {
              this.errors.push('Registration failed. No token returned from authentication service.');
            }
          }
        },
        error: (error) => {
          this.errors.push('Registration failed:' + error.toString());
          console.error('Registration failed', error);
        },
      });
    }
  }
}
