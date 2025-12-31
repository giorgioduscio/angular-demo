import { Component, effect } from '@angular/core';
import { HierarchyService } from './hierarchy.service';
import { ListItem } from '../../interfaces/list';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-hierarchyBB',
  standalone: true,
  imports: [NgIf],
  template: `
    <main class="p-2 border rounded my-2">
      <header class="d-flex align-items-center gap-2">
        <button class="btn btn-success bi bi-plus-lg" (click)="hierarchyService.todo_create()"></button>
        <h3>Componente BB</h3>
      </header>

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

    </main>
  `,
})
export class HierarchyBBComponent{
  localList :ListItem[] =[]
  constructor(public hierarchyService:HierarchyService){
    hierarchyService.todo_read()
    effect(()=>{
      this.localList =hierarchyService.list()
    })
  }
}