import { Component, Input } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { randomCompiler } from '../../../tools/randomCompiler';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chat } from '../../../interfaces/chat';
import { UsersService } from '../../../services/users.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ModalComponent } from '../../../shared/modal/modal.component';

@Component({
  selector: 'modal-chatModals',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, ModalComponent, NavbarComponent],
  styleUrl:'./chatModals.component.css',
  templateUrl:`./chatModals.component.html`,
})
export class ChatModalsComponent {
  constructor(private usersService:UsersService, private chatService:ChatService){}
  ngOnInit(): void {
    this.initForm()
  }

  // DATI INERENTI AL FORM
  @Input() chat! :Chat
  form! :Chat
  initForm(){
    // se c'è un input, indirizza il form
    if(this.chat){ 
      this.form =JSON.parse(JSON.stringify(this.chat))
      this.addedUsers =this.form.usersId.map(id=>{
        let match =this.usersService.users() .find(u=> u.id==id)?.email
        return match ?match :''
      })

    // altrimenti azzera tutto
    }else{
      this.form ={
        idChat: 0,
        titleChat: '',
        imageUrl: '',
        usersId: [],
        messages: [],
      }
      this.addedUsers =[]
    }
  }
  // AGGIUNGE NUOVI UTENTI
  addedUsers :string[] =[]
  errorMessagge =''
  addUser(e:Event){
    let element =e.target as HTMLInputElement
    let {value} =element
    // se l'input è vuoto, non è una email
    if(!value.includes('@') ||value==='') return null

    // se l'utente non esistente, mostra feedback
    let match =this.usersService.users().find(u=> u.email===value)
    if(match){
      element!.classList.remove('ng-invalid', 'ng-touched')
      this.errorMessagge =''
    }
    else{ 
      element!.classList.add('ng-invalid', 'ng-touched')
      this.errorMessagge ='Utente non trovato'
    }
    // l'utente esiste ed è nuovo
    let isRepeated =this.addedUsers.some(mail=> mail===match?.email)
    if(match && !isRepeated){
      // unshift
      this.addedUsers.unshift(match.email);
      this.form.usersId.unshift(match.id);
      // reset input
      (e.target as HTMLInputElement).value=''
    } return null
  }
  // ELIMINA UTENTI ESISTENTI 
  deleteUser(i:number){
    this.addedUsers.splice(i,1)
    this.form.usersId.splice(i,1)
  }
  // CONDIZIONI PER DISABILITARE IL SUBMIT
  isDisabled(){
    // nuovo gruppo: i valori sono vuoti
    if (this.form.idChat===0)
      return !this.form.titleChat || !this.form.usersId.length
    // aggiorna gruppo: i valori sono uguali a quelli di prima
    else return JSON.stringify(this.form) ===JSON.stringify(this.chat)
  }
  // AGGIUNGE O SOVRASCRIVE UNA CHAT
  onSubmit(){
    // nuova chat
    if(this.form.idChat===0){
      if(confirm('Aggiungere il nuovo gruppo?')){
        // inizializzaimmagine e id
        this.form.imageUrl =randomCompiler.image()
        this.form.idChat =randomCompiler.number(999999999)
        // aggiunge l'id di chi ha creato il gruppo
        let exist =localStorage.getItem('user')
        let userId =exist ?Number(exist.split('/')[0]) :null
        if(userId){ 
          this.form.usersId.push(userId)
          this.chatService.addChat(this.form)
        }
        // reset
        this.initForm()
      }
    // aggiorna chat
    }else if(this.form.idChat!==0 &&confirm('Modificare il gruppo?')){
      this.chatService.patchChat(this.form.key!, this.form)
    }
  }
}