import { Component } from '@angular/core';
import { RoutesComponent } from "./routes/routes.component";
import { RouterModule } from '@angular/router';
import { ProfileComponent } from "./profile/profile.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RoutesComponent, RouterModule, ProfileComponent ],
  template: `
    <nav class="navbar navbar-expand-sm bg-primary sticky-top shadow" 
         data-bs-theme="dark"
         style="z-index: 10;">
      <div class="container">

        <a class="navbar-brand" 
           routerLink="/" 
           routerLinkActive="active" 
           [routerLinkActiveOptions]="{exact: true}" 
           #rla="routerLinkActive" 
           [attr.aria-current]="rla.isActive ? 'page' : null">
          <img alt="Logo dell'applicazione" height="40px" src="assets/angular_logo.png" />
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- COLLAPSE -->
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">

            <app-dropdown></app-dropdown>

          </ul>
        </div>

        <app-profile></app-profile>
      </div>
    </nav>  
  `,
})

export class NavbarComponent {

}