import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { UtentiComponent } from './pages/utenti/utenti.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    HomeComponent,
    UtentiComponent,
  ],
  template: `<router-outlet />`,
})
export class AppComponent {
  title ='ggg-ng';
  onCatchData(value: string){
    this.title =value
  }
  
}
