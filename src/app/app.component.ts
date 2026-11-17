import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import customStyle from '../styles';
import { ui_addCopyFeedback } from './tools/feedbacksUI';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  template: `
    <router-outlet />
  `,
})
export class AppComponent {
  constructor() {
    customStyle()

    // aggiunge feedback icona copia
    document.addEventListener('click', (e) => {
      ui_addCopyFeedback(e)
    })
  }
  
}
