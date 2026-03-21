import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ListItem } from '../../interfaces/list';
import { ParagraphPipe } from './paragraph.pipe';
import { agree, toast } from '../../tools/feedbacksUI';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, ParagraphPipe],
  templateUrl: './list.component.html'
})

export class ListComponent implements OnInit {
  ngOnInit() {
    document.title = 'Lista';
    this.ls_get();
  }
  list: ListItem[] = [];
  
  //  LocalStorage
  localStorageKey = 'listItems';
  ls_get() {
    const stored = localStorage.getItem(this.localStorageKey);
    this.list = stored ? JSON.parse(stored) : [];
  }
  ls_set(list: ListItem[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(list));
  }
  
  // Crea un nuovo elemento
  @ViewChild('formData') formData!: NgForm;
  isValid(): boolean {
    return this.formData?.value?.title?.trim().length > 2;
  }

  //  stato
  handleCreate(formData: NgForm) {
    if (!this.isValid()) return console.error('non valido');

    let newItem: ListItem = {
      complete: false,
      title: formData.value.title.trim(),
      id: 'item_' + Date.now().toString() + Math.random().toString(36).substring(2, 9)
    };

    this.list.push(newItem);
    this.ls_set(this.list);

    formData.reset();
    toast.primary('Elemento aggiunto');
  }

  //  Elimina un elemento
  async handleDelete(index: number) {
    if (!await agree.danger('Eliminare l\'elemento?', 'Rimuovi')) return;
    const id = this.list[index].id;
    if (!id) return console.error('Elemento non trovato');

    this.list = this.list.filter(item => item.id !== id);
    this.ls_set(this.list);

    toast.danger('Elemento eliminato');
  }

  //  Aggiorna un elemento
  handleUpdate(event: Event, index: number) {
    const { value, name, checked } = (event.target as HTMLInputElement);
    const newField = name === 'complete' ? checked : value;
    const propName = name as keyof ListItem;
    const id = this.list[index].id;

    if (!id) return console.error('ID non trovato');

    const itemIndex = this.list.findIndex(item => item.id === id);
    if (itemIndex === -1) return console.error('Indice non trovato');

    const updatedItem: ListItem = { ...this.list[itemIndex] };
    (updatedItem as any)[propName] = newField;
    this.list[itemIndex] = updatedItem;
    this.ls_set(this.list);

    toast.success('Elemento aggiornato');
  }
}
