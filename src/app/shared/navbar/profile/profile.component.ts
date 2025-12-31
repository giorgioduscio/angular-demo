import { Component, effect } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../interfaces/user';
import { RouterModule } from '@angular/router';
import { agree } from '../../../tools/feedbacksUI';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ RouterModule, ],
  template: `
    @if (localeUser){
      <div class="d-flex gap-2 align-items-center" role="group" aria-label="Pulsanti profilo utente">
        <button class="position-relative btn p-0 rounded-circle overflow-hidden" 
                type="button"
                routerLink="/user/{{localeUser.key}}">
          <img [src]="localeUser.imageUrl" [alt]="localeUser.username" style="width:50px; height: 50px;">
        </button>
        <!-- Bottone di logout -->
        <button type="button" class="btn btn-danger" 
                (click)="onResetLocalUser()" aria-label="Logout">Esci</button>
      </div>

    }@else {
      <div class="btn-group">
        <button type="button" 
                class="btn btn-secondary" 
                routerLink="/login" 
                aria-label="Pagina di login">
          <i class="bi bi-person-fill-add"></i>
          <span class="ms-2 d-none d-sm-inline">Registrati</span>
        </button> 

        <button type="button" 
                class="btn btn-primary" 
                routerLink="/access" 
                aria-label="Pagina di accesso">
          <i class="bi bi-box-arrow-in-right"></i>
          <span class="ms-2 d-none d-sm-inline">Accesso</span>
        </button> 
      </div>
    }
  `,
})
export class ProfileComponent {
  localeUser :User |undefined =undefined

  constructor(private authService:AuthService){
    effect(()=>{
      this.localeUser =authService.user()
    })
  }
  //todo RESET
  async onResetLocalUser(){
    if(!await agree('Uscire dal profilo?', 'Esci', 'danger')) return;
    this.authService.resetLocalUser() 
  }

  getLabel(){
    const paroleSeparate = this.localeUser?.username.split(' ')
          ?.map(parola=> parola.charAt(0));
    if(paroleSeparate?.length && paroleSeparate.length<4) return paroleSeparate.join('')
    else return this.localeUser?.username.substring(0,2)
  }
  
}