import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ListComponent } from './pages/list/list.component';
import { HierarchyComponent } from './pages/hierarchy/hierarchy.component';
import { LoginComponent } from './pages/login/login.component';
import { AccessComponent } from './pages/login/access.component';
import { ChatComponent } from './pages/chat/chat.component';
import { MessagesComponent } from './pages/chat/messages/messages.component';
import { Error404Component } from './pages/error404/error404.component';
import { PersonalAreaComponent } from './pages/personalArea/personalArea.component';
import { DndComponent } from './pages/dnd/dnd.component';
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export interface SmartRoute{
  path:string
  component?:any
  redirectTo?:string
  pathMatch?: 'full' |'prefix'
  canActivate?:any[]

  title?:string
  auth?:number[]
  show?:boolean
}

export function buildSmartRouter(newSmartRoutes: SmartRoute[]){
  const smartRoutes = newSmartRoutes.map(route => ({ ...route }))
  const routes: Routes = smartRoutes.map(route => {
    const newRoute = { ...route }
    if(newRoute.auth!==undefined) newRoute.canActivate =[authGuard]

    delete newRoute.title;
    delete newRoute.auth;
    delete newRoute.show;
    return newRoute;
  });
  return { smartRoutes, routes };
}

export const { routes, smartRoutes } =buildSmartRouter([
  { title: 'Home', path: 'home', component: HomeComponent },
  { title: 'Errore', path: 'error', component: Error404Component },
  { title: 'Reattività', show:true, path: 'hierarchy', component: HierarchyComponent },
  { title: 'Lista', show:true, path: 'list', component: ListComponent },
  { title: 'Area personale', path: 'user/:userKey', component: PersonalAreaComponent, auth:[] },
  { title: 'Lista utenti', show:true, path: 'dashboard', component: DashboardComponent, auth:[0] },
  { title:'Schede D&D', show:true, path: 'dnd', component: DndComponent },

  // LOGIN
  { title:'Registrazione', path: 'login', component: LoginComponent },
  { title:'Accessso', path: 'access', component: AccessComponent },
  // CHAT
  { title:'Chat', path: 'chat', component: ChatComponent, auth:[] },
    { path: 'chat/:chatKey', component: MessagesComponent, auth:[] },
    
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/error', pathMatch: 'full' },
])