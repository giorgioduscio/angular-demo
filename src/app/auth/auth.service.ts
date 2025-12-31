import { effect, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { UsersService } from '../services/users.service';

@Injectable({  providedIn: 'root' })
export class AuthService {
  constructor(private usersService:UsersService){
    effect(()=>{
      this.setByStorage()
    }, {allowSignalWrites:true})
  }

  // QUANDO SI CARICA LA PAGINA, CERCA L'ID NEL LOCAL STORAGE 
  user =signal<User |undefined>(undefined)
  setByStorage(){
    let exist =localStorage.getItem('user')
    let userId =exist ?Number(exist.split('/')[0]) :null

    // ID TROVATO
    if(userId){
      let match =this.usersService.users().find(u=> u.id ===userId)
      this.user.set(match)
    }
  }

  // CONTROLLA EMAIL E PASSWORD DI UN PARAMETRO USER 
  verifyLocalUser(userToVerify:User){
    // controlla credenziali
    let match =this.usersService.users().find(u=>
      u.email ===userToVerify.email &&
      u.password ===userToVerify.password
    )
    // aggiorna l'utente
    if (match){
      this.user.set(match)
      localStorage.setItem('user', `${match.id}/${match.role}`)
      return true

    }else return false
  }

  // RIMUOVE TUTTO RIGUARDO L'UTENTE PRECEDENTE
  resetLocalUser(){
    this.user.set(undefined)
    localStorage.removeItem('user')
    setTimeout(()=> location.href ='', 50)
  }  

}
