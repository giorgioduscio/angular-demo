import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { ListItem } from '../../interfaces/list';
import { ParagraphPipe } from './paragraph.pipe';
import { agree, toast } from '../../tools/feedbacksUI';
import { FirebaseMapper } from '../../tools/firebaseMapper';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, NavbarComponent, ParagraphPipe],
  templateUrl: './list.component.html'
})

export class ListComponent implements OnInit {
  ngOnInit() {
    document.title = 'Lista';
    this.list_read();
  }
  
  private readonly localStorageKey = 'listItems';
  list: ListItem[] = [];

  private getStoredList(): ListItem[] {
    const stored = localStorage.getItem(this.localStorageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveList(list: ListItem[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(list));
  }

  list_read() {
    const list = this.getStoredList();
    const result: { [k: string]: ListItem } = {};
    list.forEach(item => {
      if (item.key) {
        result[item.key] = item;
      }
    });
    this.list = FirebaseMapper(result);
  }

  @ViewChild('formData') formData!: NgForm;
  list_create(formData: NgForm) {
    let newItem: ListItem = {
      complete: false,
      title: formData.value.title,
      key: 'item_' + Date.now().toString()
    };

    const list = this.getStoredList();
    list.push(newItem);
    this.saveList(list);

    this.list_read();
    formData.reset();
    toast('Elemento aggiunto');
  }

  async list_delete(index: number) {
    if(!await agree('Eliminare l\'elemento?', 'Rimuovi', 'danger')) return;
    const key = this.list[index].key;
    if (!key) return console.error('elemento non trovato');

    let list = this.getStoredList();
    list = list.filter(item => item.key !== key);
    this.saveList(list);
    this.list_read();

    toast('Elemento eliminato');
  }

  list_update(event: Event, index: number) {
    const { value, id, checked } = (event.target as HTMLInputElement);
    const newField = id === 'complete' ? checked : value;
    const propName = id as keyof ListItem;

    const key = this.list[index].key;
    if (key) {
        let list = this.getStoredList();
        const itemIndex = list.findIndex(item => item.key === key);
        if (itemIndex > -1) {
            const updatedItem: any = { ...list[itemIndex] };
            updatedItem[propName] = newField;
            list[itemIndex] = updatedItem;
            this.saveList(list);
            this.list_read();
        }
    }
    toast('Elemento aggiornato');
  }
}
