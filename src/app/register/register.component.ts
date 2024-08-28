import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { ToolbarService } from '../toolbar.service';
import { MessageService } from '../message.service';
import { MessageComponent } from '../message/message.component';

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
    MatCheckbox,
    MessageComponent,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, AfterViewInit {
  // TODO: Add validation equivalent to back-end
  registerForm = this.fb.group({
    email: [environment.TEST_EMAIL ?? '', [Validators.required, Validators.email]],
    password: [environment.TEST_PASSWORD ?? '', [Validators.required, Validators.minLength(6)]],
    acceptTerms: [false, Validators.requiredTrue],
  });
  @ViewChild('toolbarTemplate', { static: true }) toolbarTemplate!: TemplateRef<never>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toolbarService: ToolbarService,
    private messageService: MessageService,
  ) {}

  ngAfterViewInit() {
    const viewContainerRef = this.toolbarService.getViewContainerRef();
    viewContainerRef.clear();
    viewContainerRef.createEmbeddedView(this.toolbarTemplate);
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: [environment.TEST_EMAIL ?? '', [Validators.required, Validators.email]],
      password: [environment.TEST_PASSWORD ?? '', [Validators.required, Validators.minLength(6)]],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  onSubmit(): void {
    this.messageService.clearMessages();
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')!.value!;
      const password = this.registerForm.get('password')!.value!;

      this.authService.register(email, password).subscribe({
        next: (token) => {
          if (token) {
            console.debug('Registration successful');
            this.messageService.addMessage({
              type: 'success',
              text: 'Registration successful! Check your email for a verification link.',
              dismissible: true,
            });
            this.router.navigate(['/charts']);
          } else {
            // console.error('Registration failed while authenticating:', this.authService.getErrors());
            // const authErrors = this.authService.getErrors();
            // for (const error of authErrors) {
            //   this.messageService.addMessage({
            //     type: 'error',
            //     text: 'Registration failed while authenticating: ' + error.toString(),
            //     dismissible: true,
            //   });
            // }
            // if (authErrors.length === 0) {
            // Expect a message when no token is returned, but if not then add one
            if (this.messageService.messageCount === 0) {
              this.messageService.addMessage({
                type: 'error',
                text: 'Registration failed with no token returned.',
                dismissible: true,
              });
            }
          }
        },
        error: (error) => {
          this.messageService.addMessage({
            type: 'error',
            text: 'Registration failed: ' + error.toString(),
            dismissible: true,
          });
          console.error('Registration failed', error);
        },
      });
    }
  }
}
