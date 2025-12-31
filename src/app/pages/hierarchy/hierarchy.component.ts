import { HierarchyBComponent } from "./hierarchyB.component";
import { Component, effect } from "@angular/core";
import { ListItem } from "../../interfaces/list";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { HierarchyService } from "./hierarchy.service";
import { HierarchyAComponent } from "./hierarchyA.component";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  imports: [NgIf, NavbarComponent, HierarchyAComponent, HierarchyBComponent],
  template: `
  <article>
    <app-navbar></app-navbar>
    <div class="mx-auto my-2" style="max-width: 800px;">

      <main class="p-2 border rounded">
        <header class="d-flex align-items-center gap-2">
          <button class="btn btn-success bi bi-plus-lg" 
                  (click)="hierarchyService.todo_create()"></button>
          <h2>Componente principale</h2>
        </header>
        <p class="my-3">Questa pagina dimostra l'utilizzo dei <strong>Service</strong> e dei <strong>Signal</strong> in Angular, con l'obiettivo di testarne la reattività.</p>

        <div *ngIf="!localList.length;" class="alert alert-info my-3">
          La lista è vuota. Premere i pulsanti verdi per inserire righe alla lista.
        </div>
        <div *ngIf="localList.length;"
             class="d-grid gap-2 mt-2 align-items-center" 
             style="grid-template-columns: auto auto 1fr;">
          @for (item of localList; track item; let i=$index){
            <button class="btn btn-danger bi bi-trash3-fill" 
                    (click)="hierarchyService.todo_delete(item.key!)"></button>
            <input  class="form-check-input" 
                    type="checkbox" 
                    name="complete"
                    [checked]="item.complete" 
                    (change)="hierarchyService.todo_update(item,$event)">
            <input  class="form-control" 
                    type="text" 
                    name="title"
                    [value]="item.title"
                    (change)="hierarchyService.todo_update(item,$event)">
          }
        </div>

        <div class="d-flex flex-wrap justify-content-evenly gap-2 mt-2">
          <app-hierarchyA></app-hierarchyA>
          <app-hierarchyB></app-hierarchyB>
        </div>
      </main>

    </div>
  </article>
  `,
})
export class HierarchyComponent{
  localList :ListItem[] =[]
  constructor(public hierarchyService:HierarchyService){
    document.title=`Hierarchy`
    hierarchyService.todo_read()
    effect(()=>{
      this.localList =hierarchyService.list()
    })
  }
}