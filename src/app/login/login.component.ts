import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    password: new FormControl('rIcwap-syjtes-vepra0', [
      Validators.required,
      Validators.minLength(6),
    ]),
    username: new FormControl('nik@econtriver.com', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    // TODO: Is <string> the best way to handle this when username/password could be empty or null from user?
    this.authService
      .login(
        this.loginForm.value.username as string,
        this.loginForm.value.password as string,
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
