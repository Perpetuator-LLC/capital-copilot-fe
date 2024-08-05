import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-eula',
  standalone: true,
  imports: [MatCard, MatDivider, MatCardSubtitle, MatCardTitle, MatCardContent],
  templateUrl: './eula.component.html',
  styleUrl: './eula.component.scss',
})
export class EulaComponent {}
