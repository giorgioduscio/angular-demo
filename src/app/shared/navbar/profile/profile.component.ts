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
      <div class="d-flex gap-2 align-items-center" 
           role="group" aria-label="Pulsanti profilo utente">
        <button class="p-2 btn btn-secondary rounded-circle overflow-hidden" 
                type="button" routerLink="/user/{{localeUser.key}}">
          <strong>{{labelName}}</strong>
        </button>
        <!-- Bottone di logout -->
        <button type="button" class="btn btn-danger" 
                (click)="onResetLocalUser()" 
                aria-label="Logout">
          <i class="me-2 bi bi-arrow-bar-right d-none d-md-inline"></i>
          <span>Esci</span>
        </button>
      </div>

    }@else {
      <button type="button" 
              class="btn btn-primary" 
              routerLink="/access" 
              aria-label="Pagina di accesso">
        <i class="bi bi-person-fill"></i>
        <span class="ms-2 d-none d-md-inline">Accesso</span>
      </button> 
    }
  `,
})
export class ProfileComponent {
  localeUser :User |undefined =undefined
  labelName =""

  constructor(private authService:AuthService){
    effect(()=>{
      this.localeUser =authService.user()
      this.labelName =this.localeUser?.username
                      .split(' ')
                      .map(parola=> parola.charAt(0))
                      .join('') || ''
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