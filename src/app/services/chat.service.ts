import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Chat } from '../interfaces/chat';
import { FirebaseMapper } from '../tools/firebaseMapper';

@Injectable({  providedIn: 'root' })
export class ChatService {
  constructor(private http:HttpClient){}


  private url ='https://chat-d4bba-default-rtdb.europe-west1.firebasedatabase.app/chat'
  chats =signal<Chat[]>([])
  getChats(){
    // RECUPERA L'UTENTE DAL LOCAL STORAGE
    let exist =localStorage.getItem('user')
    let userId =exist ?Number(exist.split('/')[0]) :null

    if(userId) this.http.get<{[k:string]:Chat}>(this.url+".json")
    .subscribe(res=>{
      // recupera solo le chat che includono l'utente
      let mappedChats :Chat[] =!res ?[] :FirebaseMapper(res).filter((chat:Chat)=>
        chat.usersId.some(id=> id===userId)
      )

      // controllo profondo tra res e messages()
      let isEqual =JSON.stringify(mappedChats) ===JSON.stringify(this.chats())
      if(!isEqual) this.chats.set(mappedChats)
      // console.log('getChat', isEqual ?'uguali':'diverse');
    })
  }
  addChat(newChat:Chat){
    this.http.post(this.url+".json", newChat).subscribe(r=>{
      this.getChats()
      setTimeout(()=>console.log('addChat',this.chats()[ this.chats().length-1 ]), 1000);
    })
  }
  deleteChat(key:string){
    this.http.delete(`${this.url}/${key}.json`).subscribe(r=>{
      this.getChats()
      setTimeout(()=>console.log('deleteChat',this.chats()), 1000);
    })
  }
  patchChat(chatKey:string, newChat:Chat){
    this.http.patch(`${this.url}/${chatKey}.json`,newChat).subscribe(r=>{
      this.getChats()
      setTimeout(()=>console.log('patchChat',this.chats()), 1000);
    })
  }


}
