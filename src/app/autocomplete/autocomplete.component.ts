import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, startWith, map } from 'rxjs/operators';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { AsyncPipe, NgForOf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { Apollo, gql } from 'apollo-angular';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';

const AUTOCOMPLETE_QUERY = gql`
  query GetAutocomplete($query: String!) {
    getAutocomplete(query: $query) {
      success
      message
      results {
        symbol
        name
        cik
      }
    }
  }
`;

interface AutocompleteResult {
  symbol: string;
  name: string;
  cik: string;
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    AsyncPipe,
    MatFormField,
    MatAutocomplete,
    MatLabel,
    MatOption,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    NgForOf,
    MatInput,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
    MatCardContent,
    MatTooltip,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent {
  results: AutocompleteResult[] = [];
  tickerControl = new FormControl();
  filteredOptions: Observable<{ symbol: string; name: string; cik: string }[]>;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @Output() optionSelected = new EventEmitter<string>();
  @Output() enterPressed = new EventEmitter<void>();

  constructor(private readonly apollo: Apollo) {
    this.filteredOptions = this.tickerControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value) => this._filter(value || '')),
    );
  }

  private _filter(value: string): Observable<AutocompleteResult[]> {
    if (value.length < 1) {
      return of([]);
    }

    // const filterValue = this.input.nativeElement.value.toLowerCase();
    return this.apollo
      .query({
        query: AUTOCOMPLETE_QUERY,
        variables: { query: value },
      })
      .pipe(map((result: any) => result.data.getAutocomplete.results));
  }

  onOptionSelected(event: any) {
    this.optionSelected.emit(event.option.value);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key press
      this.enterPressed.emit();
    }
  }
}
