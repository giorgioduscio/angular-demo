import { CommonModule } from '@angular/common';
import { Component, signal, computed, effect } from '@angular/core';

interface CharacterField {
  section: 'head' | 'left' | 'right';
  key: string;
  value: string | number | ArrayItem[];
  disabled?: boolean;
}

interface ArrayItem {
  amount: number;
  description: string;
}

@Component({
  selector: 'app-mini',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini.component.html',
  styleUrl: './mini.component.css'
})
export class MiniComponent {
  constructor() {
    this.loadFromStorage();
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
    this.showSaveIndicator.set(true);
    setTimeout(() => this.showSaveIndicator.set(false), 2000);
  }


  

  character = signal<CharacterField[]>([]);
  showSaveIndicator = signal(false);

  private numericKeys = [
    'ispirazione', 'vita attuale', 'monete', 'protezione',
    'forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'
  ];

  diceOptions = [12, 10, 8, 6, 4];
  private initDefault() {
    this.character.set([
      { section: 'head', key: 'nome', value: 'Nome' },
      { section: 'head', key: 'ispirazione', value: 1 },
      { section: 'head', key: 'vita attuale', value: 10 },
      { section: 'head', key: 'monete', value: 5 },
      { section: 'head', key: 'protezione', value: 2 },
      { section: 'left', key: 'costituzione', value: 6 },
      { section: 'left', key: 'destrezza', value: 8 },
      { section: 'left', key: 'forza', value: 6 },
      { section: 'left', key: 'carisma', value: 6 },
      { section: 'left', key: 'intelligenza', value: 4 },
      { section: 'left', key: 'saggezza', value: 4 },
      { section: 'left', key: 'bonus condizionali', value: [{ amount: 1, description: 'Es. bonus' }] },
      { section: 'right', key: 'lingue', value: 'Italiano' },
      { section: 'right', key: 'equipaggiamento', value: [{ amount: 1, description: 'Oggetto' }] },
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
          disabled: true
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

    const mustBeNumber = this.numericKeys.includes(key) || typeof obj.value === 'number';
    if (mustBeNumber) {
      const match = String(newValue).match(/\d+/);
      const num = match ? Number(match[0]) : Number(newValue);
      obj.value = isNaN(num) ? obj.value : num;
    } else {
      obj.value = newValue;
    }
    this.character.set([...current]);
  }

  updateArrayValue(section: string, key: string, index: number, prop: keyof ArrayItem, newValue: string) {
    const current = this.character();
    const obj = current.find(c => c.section === section && c.key === key);
    if (!obj || !Array.isArray(obj.value)) return;

    if (prop === 'amount') {
      const num = Number(newValue);
      obj.value[index][prop] = isNaN(num) ? obj.value[index][prop] : num;
    } else {
      obj.value[index][prop] = newValue;
    }
    this.character.set([...current]);
  }

  addArrayItem(section: string, key: string, amount: string, description: string) {
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


  // CONDIVISIONE
  copyToClipboard() {
    const data = JSON.stringify(this.character());
    navigator.clipboard.writeText(data)
      .then(() => console.warn("Dati copiati negli appunti!"))
      .catch(err => console.error("Errore durante la copia:", err));
  }

  pasteFromClipboard() {
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
