import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  private viewContainerRef!: ViewContainerRef;

  setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  setToolbarComponent(component: Type<any>): ComponentRef<any> | null {
    if (this.viewContainerRef) {
      this.viewContainerRef.clear();
      return this.viewContainerRef.createComponent(component);
    }
    return null;
  }

  clearToolbarComponent() {
    if (this.viewContainerRef) {
      this.viewContainerRef.clear();
    }
  }
}
