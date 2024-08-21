import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToolbarService } from '../toolbar.service';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    MatInput,
    MatFormField,
    MatLabel,
    MatCardActions,
    MatCardTitle,
    MatButton,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements AfterViewInit {
  errors: string[] = [];
  forgotForm = new FormGroup({
    email: new FormControl(environment.TEST_EMAIL ?? '', [Validators.required, Validators.email]),
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
    this.authService.forgot(this.forgotForm.value.email as string).subscribe({
      next: () => {
        this.errors = this.authService.getErrors();
        if (this.errors.length === 0) {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.errors.push('Reset failed ' + error.toString());
        console.error('Reset failed', error);
      },
    });
  }
}
