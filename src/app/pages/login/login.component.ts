import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { initForm, getForm, FormField } from './validation';
import { randomCompiler } from '../../tools/randomCompiler';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ NavbarComponent, ReactiveFormsModule, FormsModule, RouterModule, NgIf, NgFor, ],
  templateUrl: './login.component.html',
})

export class LoginComponent {
  constructor( private usersService :UsersService, private router :Router){
    document.title="Login"
    this.voidForm()
  }
  pageMessages={
    title:'Iscriviti',
    alternativeLinkPath:'/access',
    alternativeLinkLabel:'Accedi',
    alternativeMessage:'Hai già un account?'
  }

  // todo MOSTRA GLI USERS
  users :User[] =[]
  keys :string[] =[]
  form! :FormGroup<any>
  template :FormField[] =[]
  voidForm(){
    this.template = initForm()
    this.form = getForm(this.template)
  }

  //TODO AGGIUNGE UN USER
  onSubmit() {
    const input :User ={
      id: 0,
      email: '',
      username: '',
      password: '',
      imageUrl: '',
      role: 0,
      ...this.form.value,
    }
    this.usersService.addUser({
      id: randomCompiler.number(999999999),
      username: input.username,
      email: input.email,
      imageUrl: randomCompiler.image(),
      password: input.password,
      role: Number(input.role),
    })
    this.voidForm()    
    this.router.navigate(['/access'])
  }



}