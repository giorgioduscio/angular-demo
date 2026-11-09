import { CommonModule, NgIf } from '@angular/common';
import { Component, signal, computed, effect } from '@angular/core';

interface CharacterField {
  section: 'head' | 'left' | 'right';
  key: string;
  value: string | number | ArrayItem[];
  disabled?: boolean;
  className: string;
}

interface ArrayItem {
  amount: number;
  description: string;
}

@Component({
  selector: 'app-mini',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './mini.component.html',
  styleUrls: ['./mini.component.css']
})
export class MiniComponent {
  constructor() {
    this.loadFromStorage();

    effect(() => {
      this.character();
      this.saveToStorage();
    }, { allowSignalWrites: true });
  }

  // STORAGE
  private loadFromStorage() {
    const localdata = localStorage.getItem('mini-rpg-data');
    if (localdata) {
      try {
        this.character.set(JSON.parse(localdata));
      } catch (e) {
        console.error('Errore parsing localdata:', e);
        this.initDefault();
      }
    } else {
      this.initDefault();
    }
  }
  private saveToStorage() {
    localStorage.setItem('mini-rpg-data', JSON.stringify(this.character()));
    this.feed_showToast('success', 'Salvato');
  }


  
  // PERSONAGGIO 
  character = signal<CharacterField[]>([]);

  private numericKeys = [
    'ispirazione', 'vita attuale', 'monete', 'protezione',
    'forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'
  ];

  diceOptions = [12, 10, 8, 6, 4];
  initDefault() {
    this.character.set([
      { section: 'head', key: 'nome',         value: 'Nome', className: '', disabled: false },
      { section: 'head', key: 'ispirazione',  value: 1,      className: '', disabled: false },
      { section: 'head', key: 'vita attuale', value: 10,     className: 'text-bg-warning', disabled: false },
      { section: 'head', key: 'monete',       value: 5,      className: '', disabled: false },
      { section: 'head', key: 'protezione',   value: 2,      className: '', disabled: false },

      { section: 'left', key: 'costituzione', value: 6, className: 'text-bg-warning', disabled: false },
      { section: 'left', key: 'destrezza', value: 8,    className: 'text-bg-success', disabled: false },
      { section: 'left', key: 'forza', value: 6,        className: 'text-bg-danger', disabled: false },
      { section: 'left', key: 'carisma', value: 6,      className: 'text-bg-primary', disabled: false },
      { section: 'left', key: 'intelligenza', value: 4, className: 'text-bg-info', disabled: false },
      { section: 'left', key: 'saggezza', value: 4,     className: 'text-bg-secondary', disabled: false },
      { section: 'left', key: 'bonus condizionali', className: '', disabled: false,
        value: [{ amount: 1, description: 'Es. bonus' }]
      },

      { section: 'right', key: 'lingue', value: 'Italiano', className: '', disabled: false },
      { section: 'right', key: 'equipaggiamento', className: '', disabled: false,
        value: [{ amount: 1, description: 'Oggetto' }]
      },
    ]);
  }

  // raggruppa i campi per sezione 
  groupedCharacter = computed(() => {
    return this.character().reduce((acc: Record<string, CharacterField[]>, cur: CharacterField) => {
      acc[cur.section] = [...(acc[cur.section] || []), cur];
      // aggiunge la vita massima appena dopo la vita attuale
      if (cur.key === 'vita attuale') {
        acc[cur.section].push({ 
          section: cur.section, 
          key: 'vita massima', 
          value: this.maxVita(), 
          disabled: true,
          className: cur.className
        });
      }
      return acc;
    }, {} as Record<string, CharacterField[]>);
  });

  costituzioneValue = computed(() => {
    const field = this.character().find((item: CharacterField) => item.key?.includes('cost'));
    if (!field) return 0;
    const v = field.value;
    if (typeof v === 'number') return v;
    const match = String(v).match(/\d+/);
    return match ? Number(match[0]) : 0;
  });

  maxVita = computed(() => this.costituzioneValue() * 4);

  updateValue(section: string, key: string, newValue: string) {
    const current = this.character();
    const obj = current.find((c: CharacterField) => c.section === section && c.key === key);
    if (!obj) return;

    console.log('[updateValue] Campo:', key, 'Valore vecchio:', obj.value, 'Nuovo valore:', newValue);

    const mustBeNumber = this.numericKeys.includes(key) || typeof obj.value === 'number';
    let processedValue: string | number | ArrayItem[];
    if (mustBeNumber) {
      const match = String(newValue).match(/\d+/);
      const num = match ? Number(match[0]) : Number(newValue);
      processedValue = isNaN(num) ? obj.value : num;
    } else {
      processedValue = newValue;
    }

    const updated = current.map((c: CharacterField) => 
      c.section === section && c.key === key ? { ...c, value: processedValue } : c
    );
    this.character.set(updated);

    console.log('[updateValue] Campo aggiornato:', key, 'Nuovo valore nel signal:', processedValue);
  }

  // imita il comportamento di una label che contiene un input
  focusAmountInput(e: Event) {
    const target = e.target as HTMLElement;
    const input = target.querySelector('[contenteditable]') as HTMLInputElement;
    input?.focus();
  }
  // aggiorna un valore in un array di oggetti
  updateArrayValue(e: Event, section: string, key: string, index: number, prop: keyof ArrayItem) {
    // DATI
    const character = this.character();
    const targetList = character.find(c => c.section === section && c.key === key);
    if (!targetList || !Array.isArray(targetList.value))
      return console.error("Campo non trovato o non è un array");

    const arrayValue = targetList.value as ArrayItem[];
    const oldValue = () => this.isArray(arrayValue)
      ? arrayValue[index][prop]
      : null;
    const input = e.target as HTMLInputElement;
    const inputValue = input.value || input.textContent || '';
    const newValue = prop === 'amount' 
      ? Number(inputValue.trim()) 
      : inputValue.trim();
    
    // VALIDAZIONE
    // amount deve essere un numero
    if (prop === 'amount' && isNaN(newValue as number)) {
      this.feed_showToast('danger', `Numero non valido`);
      return;

    // se il valore è lo stesso
    } else if(newValue === oldValue()){
      this.feed_showToast('info', 'Nessun cambiamento');
      return;
    }
   
    // AGGIORNAMENTO
    const updatedArray = arrayValue.map((item: ArrayItem, i: number) => {
      if (i !== index) return item;
      return { ...item, [prop]: newValue };
    });

    const updated = character.map((c: CharacterField) => 
      c.section === section && c.key === key 
        ?{ ...c, value: updatedArray } 
        :c
    );
    this.character.set(updated);
  }

  addArrayItem(e:Event, section: string, key: string, amount: string, description: string) {
    const current = this.character();
    const obj = current.find(c => c.section === section && c.key === key);
    if (!obj || !Array.isArray(obj.value)) return;

    const amt = Number(amount) || 1;
    const desc = description.trim();
    if (desc === '') return;

    const newValue = [...obj.value, { amount: amt, description: desc }];
    const updated = current.map(c => 
      c.section === section && c.key === key ? { ...c, value: newValue } : c
    );
    this.character.set(updated);
    // reset form
    e.preventDefault();
    (e.target as HTMLFormElement).reset();
  }

  removeArrayItem(section: string, key: string, index: number) {
    if (!confirm('Eliminare il componente?')) return;
    
    const current = this.character();
    const obj = current.find(c => c.section === section && c.key === key);
    if (!obj || !Array.isArray(obj.value)) return;

    const newValue = obj.value.filter((_: ArrayItem, i: number) => i !== index);
    const updated = current.map(c => 
      c.section === section && c.key === key ? { ...c, value: newValue } : c
    );
    this.character.set(updated);
  }


  // feed
  feed_toastValue =signal({color:'', message:'', icon:''})
  feed_toastIcons ={
    success: 'check-circle',
    danger: 'exclamation-triangle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  }
  feed_showToast(color:"success" | "danger" | "warning" | "info", message:string) {
    this.feed_toastValue.set({color, message, icon: this.feed_toastIcons[color]});

    setTimeout(() => {
      this.feed_toastValue.set({color:'', message:'', icon:''});
    }, 2000);
  }


  // CONDIVISIONE
  shared_copyToClipboard() {
    const data = JSON.stringify(this.character());
    navigator.clipboard.writeText(data)
      .then(() => console.warn("Dati copiati negli appunti!"))
      .catch(err => console.error("Errore durante la copia:", err));
  }

  shared_pasteFromClipboard() {
    navigator.clipboard.readText()
      .then(text => {
        const requiredChars = ['{', '}', '[', ']', ':'];
        if (!requiredChars.every(char => text.includes(char))) {
          alert("Il contenuto degli appunti non sembra essere un JSON valido.");
          return;
        }
        try {
          const parsed = JSON.parse(text);
          this.character.set(parsed);
        } catch (e) {
          alert("Errore nel parsing del JSON incollato.");
        }
      })
      .catch(err => {
        console.error("Errore durante la lettura degli appunti:", err);
        alert("Impossibile leggere dagli appunti.");
      });
  }

  isArray(value: unknown): value is ArrayItem[] {
    return Array.isArray(value);
  }

  isStatKey(key: string): boolean {
    return ['forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'].includes(key);
  }

  isLingueKey(key: string): boolean {
    return key === 'lingue';
  }

  isVitaKey(key: string): boolean {
    return key === 'vita attuale';
  }

  isNumberValue(value: string | number | ArrayItem[]): boolean {
    return typeof value === 'number';
  }
}
