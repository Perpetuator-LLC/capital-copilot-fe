import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  // templateUrl: './login.component.html',
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <label for="username">
        Username:
        <input type="text" id="username" formControlName="username" />
      </label>
      <label for="password">
        Password:
        <input type="password" id="password" formControlName="password" />
      </label>
      <button type="submit">Login</button>
    </form>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = new FormGroup({
    password: new FormControl('rIcwap-syjtes-vepra0', [Validators.required, Validators.minLength(6)]),
    username: new FormControl('nik@econtriver.com', [Validators.required, Validators.minLength(2)]),
  })

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // TODO: Is <string> the best way to handle this when username/password could be empty or null from user?
    this.authService.login(<string>this.loginForm.value.username, <string>this.loginForm.value.password).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
