import { Injectable, signal, computed } from '@angular/core';
import { toast, agree } from '../../tools/feedbacksUI';

export interface Mappa {
  [key: string]: string[];
}

@Injectable({ providedIn: 'root' })
export class MappaService {
  constructor() {
    this.storage_sync();
  } 
  
  // STATO PUBBLICO (Segnali Calcolati)
  mappa_value = signal<Mappa>({});
  mappa_isVoid = computed(() => 
    this.mappa_righe().length === 0 || 
    this.mappa_colonne().length === 0);
  
  // Restituisce l'array delle chiavi delle righe (es. ['A', 'B', 'C'])
  mappa_righe = computed(() => Object.keys(this.mappa_value()));
  
  // Restituisce l'array degli indici delle colonne (es. [0, 1, 2, 3])
  mappa_colonne = computed(() => {
    const keys = this.mappa_righe();
    return keys.length > 0 ? Array.from({ length: this.mappa_value()[keys[0]].length }, (_, i) => i) : [];
  });
  
  mappa_create(righe: number, colonne: number): void {
    // Gestisce input non validi
    if (righe <= 0 || colonne <= 0) {
      toast('Dimensioni della mappa non valide', 'danger');
      return;
    }

    const maxCelle = 26;
    if (righe > maxCelle || colonne > maxCelle) {
      toast(`Il numero massimo di righe e colonne è ${maxCelle}`, 'danger');
      return;
    }

    const lettereRighe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nuovaMappa: Mappa = {};
    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      nuovaMappa[letteraRiga] = new Array(colonne).fill('');
    }

    this.mappa_value.set(nuovaMappa);
    toast(`Mappa ${righe}x${colonne} creata!`, 'success');
  }

  // AGGIUNGE SIMBOLI
  mappa_setCell(riga: string, colonna: number, simbolo: string): void {
    const mappaCorrente = this.mappa_value();
    const nuovaMappa = JSON.parse(JSON.stringify(mappaCorrente));
    if (!mappaCorrente[riga] || colonna < 0 || colonna >= this.mappa_colonne().length) {
      toast(`Posizione "${riga}${colonna + 1}" non valida!`, 'danger');
      return;
    }

    // reset della stringa del giocatore
    if (simbolo.length > 1) {
      for (const rowKey of Object.keys(mappaCorrente)) {
        for (let i = 0; i < mappaCorrente[rowKey].length; i++) {
          if (mappaCorrente[rowKey][i].toLowerCase() === simbolo.toLowerCase()) {
            nuovaMappa[rowKey][i] = '';
          }
        }
      }
    }

    // aggiunge simbolo | sposta giocatore 
    const simboloDiverso = nuovaMappa[riga][colonna] !== simbolo;
    const confermaSimbolo = nuovaMappa[riga][colonna].length <2;
    if (simboloDiverso && confermaSimbolo) {
      nuovaMappa[riga][colonna] = simbolo;
    } else {
      return console.error("stessa stringa o è un giocatore");
    }
    
    this.mappa_value.set(nuovaMappa);

    toast(`"${simbolo}" inserito in ${riga}${colonna + 1}!`, 'success');
  }

  mappa_removeSymbol(simbolo: string): void {
    const mappaCorrente = this.mappa_value();
    const nuovaMappa = JSON.parse(JSON.stringify(mappaCorrente));
    for (const rowKey of Object.keys(mappaCorrente)) {
      for (let i = 0; i < mappaCorrente[rowKey].length; i++) {
        if (mappaCorrente[rowKey][i].toLowerCase() === simbolo.toLowerCase()) {
          nuovaMappa[rowKey][i] = '';
        }
      }
    }
    this.mappa_value.set(nuovaMappa);
    toast(`"${simbolo}" rimosso!`, 'success');
  }

  // SALVATAGGIO MAPPE
  storage_value = signal<{ [key: string]: { mappa: Mappa; mappa_righe: number; mappa_colonne: number } }>({});

  // Ottiene le mappe salvate dal localStorage
  storage_sync(): void {
    const savedMappe = localStorage.getItem('mappe');
    if (savedMappe) {
      try {
        this.storage_value.set(JSON.parse(savedMappe));
      } catch (e) {
        console.error('Errore nel parsing delle mappe salvate:', e);
        this.storage_value.set({});
      }
    } else {
      this.storage_value.set({});
    }
  }

  // Restituisce i nomi delle mappe salvate
  storage_getNames(): string[] {
    return Object.keys(this.storage_value());
  }

  // Restituisce una mappa salvata dato il nome
  storage_getMapByName(nomeMappa: string): { mappa: Mappa; mappa_righe: number; mappa_colonne: number } | null {
    return this.storage_value()[nomeMappa] || null;
  }

  // SALVA MAPPA
  async storage_addMap(nomeMappa: string): Promise<void> {
    if(nomeMappa==='random'){
      nomeMappa = 'mappa' + Date.now();
    }
    if (!nomeMappa) {
      toast('Nome mappa non valido', 'danger');
      return;
    }

    if (this.storage_value()[nomeMappa] && !(await agree(`Mappa "${nomeMappa}" già esistente. Vuoi sovrascriverla?`))) {
      return;
    }

    const mappeSalvateCorrenti = this.storage_value();
    mappeSalvateCorrenti[nomeMappa] = {
      mappa: { ...this.mappa_value() },
      mappa_righe: this.mappa_righe().length,
      mappa_colonne: this.mappa_colonne().length,
    };

    this.storage_value.set(mappeSalvateCorrenti);

    try {
      localStorage.setItem('mappe', JSON.stringify(mappeSalvateCorrenti));
      toast(`Mappa "${nomeMappa}" salvata!`, 'success');
    } catch (e) {
      console.error('Errore nel salvataggio della mappa:', e);
      toast('Errore nel salvataggio della mappa', 'danger');
    }
  }

  // ELIMINA MAPPA
  async storage_removeMap(nomeMappa: string): Promise<void> {
    if (!this.storage_value()[nomeMappa]) {
      toast(`Mappa "${nomeMappa}" non trovata`, 'danger');
      return;
    }

    if (!(await agree(`Sei sicuro di voler eliminare la mappa "${nomeMappa}"?`, "Rimuovi", "danger"))) {
      return;
    }

    const mappeSalvateCorrenti = { ...this.storage_value() };
    delete mappeSalvateCorrenti[nomeMappa];
    this.storage_value.set(mappeSalvateCorrenti);

    try {
      localStorage.setItem('mappe', JSON.stringify(mappeSalvateCorrenti));
      toast(`Mappa "${nomeMappa}" eliminata!`, 'success');
    } catch (e) {
      console.error('Errore nell\'eliminazione della mappa:', e);
      toast('Errore nell\'eliminazione della mappa', 'danger');
    }
  }

  // CARICA MAPPA
  async mappa_syncStorage(nomeMappa: string): Promise<void> {
    const mappaSalvata = this.storage_getMapByName(nomeMappa);
    if (!mappaSalvata) {
      toast(`Mappa "${nomeMappa}" non trovata`, 'danger');
      return;
    }

    // Basta impostare mappa_value, mappa_righe e mappa_colonne (computed) si aggiorneranno da sole
    this.mappa_value.set({ ...mappaSalvata.mappa });
    toast(`Mappa "${nomeMappa}" caricata!`, 'success');
  }
}
