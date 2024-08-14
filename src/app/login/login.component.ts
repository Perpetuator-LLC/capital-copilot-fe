import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { environment } from '../../environments/environment';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  errors: string[] = [];
  loginForm = new FormGroup({
    // TODO: Add validation equivalent to back-end
    password: new FormControl(environment.TEST_PASSWORD ?? '', [Validators.required, Validators.minLength(6)]),
    username: new FormControl(environment.TEST_USERNAME ?? '', [Validators.required, Validators.minLength(2)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    this.errors = [];
    this.authService.login(this.loginForm.value.username as string, this.loginForm.value.password as string).subscribe({
      next: () => {
        this.errors = this.authService.getErrors();
        if (this.errors.length === 0) {
          this.router.navigate(['/']);
        }
        // for (const error of this.authService.getErrors()) {
        //   this.errors.push(error.toString());
        // }
        // this.errors.push('Registration failed. No token returned from authentication service.');
      },
      error: (error) => {
        this.errors.push('Login failed:' + error.toString());
        console.error('Login failed', error);
        // this.errors += error.error.detail;
      },
    });
  }
}
