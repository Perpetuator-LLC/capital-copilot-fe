import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  private toolbarContent = new BehaviorSubject<string | null>(null);
  public toolbarContent$ = this.toolbarContent.asObservable();

  setToolbarContent(content: string) {
    this.toolbarContent.next(content);
  }

  clearToolbarContent() {
    this.toolbarContent.next(null);
  }
}
