import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: Theme = 'dark'; // default theme

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme();
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme(this.currentTheme);
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    this.renderer.removeClass(body, 'light');
    this.renderer.removeClass(body, 'dark');
    this.renderer.addClass(body, `${theme}`);
  }

  private loadTheme(): void {
    const storedTheme = localStorage.getItem('theme') as Theme;
    this.currentTheme = storedTheme || this.currentTheme;
    this.applyTheme(this.currentTheme);
  }
}
