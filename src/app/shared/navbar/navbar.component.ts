import { Component, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from "./profile/profile.component";
import { SmartRoute, smartRoutes } from '../../app.routes';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterModule, ProfileComponent ],
  template: `
  <div style="padding-top: 2.8rem;">
    <nav class="p-0 navbar navbar-expand-sm fixed-top shadow bg-dark z-3" data-bs-theme="dark">
      <div class="container">
        <!-- Pulsante per offcanvas (solo mobile) -->
        <button
          class="navbar-toggler d-md-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Logo -->
        <a class="navbar-brand"
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{exact: true}"
          #rla="routerLinkActive"
          [attr.aria-current]="rla.isActive ? 'page' : null">
          <img alt="Logo dell'applicazione" height="40px" src="assets/angular_logo.png" />
        </a>

        <!-- Offcanvas per mobile -->
        <div
          class="offcanvas offcanvas-start bg-dark text-white z-4"
          tabindex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menù</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav flex-grow-1">
              @for (page of pages; track $index) {
                <li class="nav-item">
                  <a
                    class="nav-link text-white"
                    routerLink="/{{page.path}}"
                    routerLinkActive="active"
                    #rla="routerLinkActive"
                    [attr.aria-current]="rla.isActive ? 'page' : null"
                    (click)="closeOffcanvas()">
                    {{ page.title || page.path }}
                  </a>
                </li>
              }
            </ul>
          </div>
        </div>
        <!-- offcanvas -->

        <app-profile></app-profile>

      </div>
    </nav>
  </div>
  `,
})

export class NavbarComponent {
  constructor(public authService:AuthService){
    effect(()=>{
      this.setPages()
    })
  }

  // MOSTRA LE ROTTE SOLO SE L'UTENTE VI PUO' ACCEDERE
  pages :SmartRoute[] =[]
  setPages(){
    let userRole =this.authService.user()?.role
    // SE L'UTENTE NON ESISTE MOSTRA SOLO PAGINE LIBERE
    if(userRole===undefined) this.pages =smartRoutes
      .filter(page=> page.show &&page.auth===undefined);
    // SE L'UTENTE HA UN RUOLO, MOSTRA LE PAGINE ACCESSIBILI 
    else this.pages =smartRoutes .filter(page=> 
      // pagine libere
      (page.show &&page.auth===undefined) ||  
      // pagine auth:[]
      (page.show &&page.auth?.length===0) ||  
      // pagine auth[i]==ruolo
      (page.show &&page.auth?.some(role=> role===userRole)) 
    );
  }

    // Chiudi l'offcanvas quando si clicca su un link
  closeOffcanvas() {
    const offcanvasElement = document.getElementById('offcanvasNavbar');
    if (offcanvasElement) {
      //@ts-ignore
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      offcanvas?.hide();
    }
  }

}