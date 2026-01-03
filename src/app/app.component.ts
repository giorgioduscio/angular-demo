import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import customStyle from '../styles';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `<router-outlet />`,
})
export class AppComponent {
  constructor() {
    customStyle()
  }
  
}
