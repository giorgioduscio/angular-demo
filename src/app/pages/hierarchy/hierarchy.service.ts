import { effect, Injectable, signal } from '@angular/core';
import { ListItem } from '../../interfaces/list';
import { randomCompiler } from '../../tools/randomCompiler';
import { agree, toast } from '../../tools/feedbacksUI';

@Injectable({
  providedIn: 'root'
})
export class HierarchyService {
  private storageKey = 'todos';
  list = signal<ListItem[]>([]);

  constructor() {
    this.todo_read(); 
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.list()));
    });
  }

  todo_create(body: ListItem ={complete: false, title: randomCompiler.string() }) {
    const newItem = { ...body, key: Date.now().toString() };
    this.list.update(currentList => [...currentList, newItem]);
    toast.success('Elemento aggiunto')
  }

  todo_read() {
    const storedList = localStorage.getItem(this.storageKey);
    if (storedList) {
      this.list.set(JSON.parse(storedList));
    } else {
      this.list.set([]);
    }
  }

  async todo_delete(key: string) {
    if(!await agree.danger(`Eliminate l'elemento?`, 'Rimuovi')) return;
    this.list.update(currentList => currentList.filter(item => item.key !== key));
    toast.danger('Elemento rimosso')
  }

  todo_update(item: ListItem, e: Event) {
    const { name, value, checked } = e.target as HTMLInputElement;
    const updatedItem = {
      ...item,
      [name]: name === 'title' ? value : checked,
    };

    this.list.update((currentList) => {
      const index = currentList.findIndex((currentItem) => currentItem.key === item.key);
      if (index !== -1) {
        const newList = [...currentList];
        newList[index] = { ...updatedItem, key: item.key };
        return newList;
      }
      return currentList;
    });
    toast.primary('Elemento aggiornato')
  }
  
}