import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import customStyle from '../styles';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  template: `
  <app-navbar />
  <router-outlet />
  `,
})
export class AppComponent {
  constructor() {
    customStyle()
  }
  
}
