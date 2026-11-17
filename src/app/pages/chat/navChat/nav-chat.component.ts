import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditModeService } from '../edit-mode.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav-chat',
  standalone: true,
  imports: [RouterModule, NgIf, NavbarComponent],
  templateUrl: './nav-chat.component.html',
  styleUrls: ['../styles/navChat.css']
})

export class NavChatComponent {
  constructor(public ems:EditModeService){}
}