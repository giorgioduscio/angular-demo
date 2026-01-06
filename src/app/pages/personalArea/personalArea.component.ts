import { Component, effect } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../interfaces/user';
import { siteActions } from './siteActions';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule, NgIf, ],
  templateUrl: './personalArea.component.html',
  styleUrl: './personalArea.component.css'
})
export class PersonalAreaComponent {
  constructor(public authService:AuthService, private ar:ActivatedRoute){
    effect(()=>{
      this.user =authService.user()
      this.ar.params.subscribe(p=> this.userKey =p['userKey'])
      this.cards =siteActions()
    })
  }

  user :User | undefined
  userKey :string =''
  
  // AZIONI DEL SITO
  cards =siteActions()
  showCard(i:number){
    const requestedRoles =this.cards[i].auth    
    // se non sono richiesti ruoli o solo autenticazione
    if(requestedRoles===undefined ||requestedRoles.length===0) return true
    // se l'azione richiede dei ruoli
    else{
      let isVisible =requestedRoles.some(role=> role===this.user?.role)
      return isVisible
    }
  }

}
