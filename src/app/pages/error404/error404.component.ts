import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.css'
})
export class Error404Component {
  image={
    url:'https://img.freepik.com/vettori-premium/icona-di-sonno-procione-pigro_42750-46.jpg?w=740',
    alt:'lazy racoon'
  }
}
