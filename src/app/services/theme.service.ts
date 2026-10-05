import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = false;

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const saved = localStorage.getItem('dam2-theme');
    if (saved) {
      this.isDarkMode = saved === 'dark';
    } else {
      this.isDarkMode = false; // Arranca en Modo Claro por defecto para disfrutar del fondo crema
    }
    this.applyTheme();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('dam2-theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    document.body.classList.toggle('dark', this.isDarkMode);
    document.body.classList.toggle('ion-palette-dark', this.isDarkMode);
  }
}
