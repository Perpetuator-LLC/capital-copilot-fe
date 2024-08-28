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
import { MessageComponent } from '../message/message.component';
import { MessageService } from '../message.service';

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
    MessageComponent,
  ],
  templateUrl: './resend-verification.component.html',
  styleUrl: './resend-verification.component.scss',
})
export class ResendVerificationComponent implements AfterViewInit {
  resendForm = new FormGroup({
    email: new FormControl(environment.TEST_EMAIL ?? '', [Validators.required, Validators.email]),
  });
  @ViewChild('toolbarTemplate', { static: true }) toolbarTemplate!: TemplateRef<never>;

  constructor(
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

  onSubmit() {
    this.messageService.clearMessages();
    this.authService.resend(this.resendForm.value.email as string).subscribe({
      next: () => {
        // this.errors = this.authService.getErrors();
        // if (this.errors.length === 0) {
        //   this.router.navigate(['/login']);
        // }
      },
      error: (error) => {
        this.messageService.addMessage({
          type: 'error',
          text: 'Resending verification failed: ' + error.toString(),
          dismissible: true,
        });
        console.error('Reset failed', error);
      },
    });
  }
}
