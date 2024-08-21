import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
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
import { ToolbarService } from '../toolbar.service';

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
export class LoginComponent implements AfterViewInit {
  errors: string[] = [];
  loginForm = new FormGroup({
    // TODO: Add validation equivalent to back-end
    password: new FormControl(environment.TEST_PASSWORD ?? '', [Validators.required, Validators.minLength(5)]),
    username: new FormControl(environment.TEST_USERNAME ?? '', [Validators.required, Validators.minLength(2)]),
  });
  @ViewChild('toolbarTemplate', { static: true }) toolbarTemplate!: TemplateRef<never>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toolbarService: ToolbarService,
  ) {}

  ngAfterViewInit() {
    const viewContainerRef = this.toolbarService.getViewContainerRef();
    viewContainerRef.clear();
    viewContainerRef.createEmbeddedView(this.toolbarTemplate);
  }

  onSubmit() {
    this.errors = [];
    this.authService.login(this.loginForm.value.username as string, this.loginForm.value.password as string).subscribe({
      next: () => {
        this.errors = this.authService.getErrors();
        if (this.errors.length === 0) {
          this.router.navigate(['/charts']);
        }
      },
      error: (error) => {
        this.errors.push('Login failed:' + error.toString());
        console.error('Login failed', error);
      },
    });
  }
}
