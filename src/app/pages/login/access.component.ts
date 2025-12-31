import { Component, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../interfaces/user';
import { AuthService } from '../../auth/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { NgIf } from '@angular/common';
import { initForm, getForm } from './validation';

@Component({
  selector: 'app-access',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule, NavbarComponent, NgIf],
  templateUrl: './login.component.html',
})
export class AccessComponent {
  constructor(private router: Router, private authService:AuthService, ){
    document.title ='Access'
    this.voidForm()
  }
  pageMessages={
    title:'Accesso',
    alternativeMessage:'Non hai ancora un account?',
    alternativeLinkPath:'/login',
    alternativeLinkLabel:'Login'
  }

  showcomponent =signal({error:false, password:false})
  form! :FormGroup<any>
  template :any[] =[]
  voidForm(){
    const formConfig = initForm().filter(f=>f.key==='password'||f.key==='email');
    this.form = getForm(formConfig);
    this.template = formConfig;
  }

  // TODO SUBMIT
  onSubmit(){
    const userToVerify :User ={
      id: 0,
      email: this.form.value.email,
      username: '',
      password: this.form.value.password,
      imageUrl: '',
      role: 0,
    }
    // SE VI E' UN RISCONTRO DELL'UTENTE
    if(this.authService.verifyLocalUser(userToVerify)){ 
      let userKey =this.authService.user()?.key
      this.router.navigate(['/user/'+userKey])
      this.voidForm()
    }else console.log('le credenziali non hanno riscontrato risultati')
  }
}
