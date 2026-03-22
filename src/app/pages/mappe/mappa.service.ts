import { Injectable, signal, computed, effect } from '@angular/core';
import { toast, agree } from '../../tools/feedbacksUI';

export interface Mappa {
  [key: string]: string[];
}

@Injectable({ providedIn: 'root' })
export class MappaService {
  constructor() {
    this.storage_sync();
    effect(() => {
      this.saveCurrentMapToStorage(this.mappa_value());
    });
  } 
  
  // STATO PUBBLICO (Segnali Calcolati)
  mappa_value = signal<Mappa>(this.loadCurrentMapFromStorage());
  
  private readonly STORAGE_KEY_ATTUALE = 'mappa_attuale';
  private saveCurrentMapToStorage(data: Mappa): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_ATTUALE, JSON.stringify(data));
    } catch (e) {
      console.error("Errore salvataggio Mappa Attuale:", e);
    }
  }

  private loadCurrentMapFromStorage(): Mappa {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_ATTUALE);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Errore caricamento Mappa Attuale:", e);
      return {};
    }
  }
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
  
  mappa_reset(){
    this.mappa_value.set({});
  }

  mappa_create(righe: number, colonne: number): void {
    // Gestisce input non validi
    if (righe <= 0 || colonne <= 0) {
      toast.danger('Dimensioni della mappa non valide');
      return;
    }

    const maxCelle = 26;
    if (righe > maxCelle || colonne > maxCelle) {
      toast.danger(`Il numero massimo di righe e colonne è ${maxCelle}`);
      return;
    }

    const lettereRighe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nuovaMappa: Mappa = {};
    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      nuovaMappa[letteraRiga] = new Array(colonne).fill('');
    }

    this.mappa_value.set(nuovaMappa);
  }

  // AGGIUNGE SIMBOLI
  mappa_setCell(riga: string, colonna: number, simbolo: string): void {
    const mappaCorrente = this.mappa_value();
    const nuovaMappa = JSON.parse(JSON.stringify(mappaCorrente));
    if (!mappaCorrente[riga] || colonna < 0 || colonna >= this.mappa_colonne().length) {
      toast.danger(`Posizione "${riga}${colonna + 1}" non valida!`);
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

    toast.success(`"${simbolo}" inserito in ${riga}${colonna + 1}!`);
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
    toast.success(`"${simbolo}" rimosso!`);
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
      toast.danger('Nome mappa non valido');
      return;
    }

    if (this.storage_value()[nomeMappa] && !(await agree.warning(`Mappa "${nomeMappa}" già esistente. Vuoi sovrascriverla?`))) {
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
      toast.success(`Mappa "${nomeMappa}" salvata!`);
    } catch (e) {
      console.error('Errore nel salvataggio della mappa:', e);
      toast.danger('Errore nel salvataggio della mappa');
    }
  }

  // ELIMINA MAPPA
  async storage_removeMap(nomeMappa: string): Promise<void> {
    if (!this.storage_value()[nomeMappa]) {
      toast.danger(`Mappa "${nomeMappa}" non trovata`);
      return;
    }

    if (!(await agree.danger(`Sei sicuro di voler eliminare la mappa "${nomeMappa}"?`, "Rimuovi"))) {
      return;
    }

    const mappeSalvateCorrenti = { ...this.storage_value() };
    delete mappeSalvateCorrenti[nomeMappa];
    this.storage_value.set(mappeSalvateCorrenti);

    try {
      localStorage.setItem('mappe', JSON.stringify(mappeSalvateCorrenti));
      toast.success(`Mappa "${nomeMappa}" eliminata!`);
    } catch (e) {
      console.error('Errore nell\'eliminazione della mappa:', e);
      toast.danger('Errore nell\'eliminazione della mappa');
    }
  }

  // CARICA MAPPA
  async mappa_syncStorage(nomeMappa: string): Promise<void> {
    const mappaSalvata = this.storage_getMapByName(nomeMappa);
    if (!mappaSalvata) {
      toast.danger(`Mappa "${nomeMappa}" non trovata`);
      return;
    }

    // Basta impostare mappa_value, mappa_righe e mappa_colonne (computed) si aggiorneranno da sole
    this.mappa_value.set({ ...mappaSalvata.mappa });
    toast.success(`Mappa "${nomeMappa}" caricata!`);
  }
}
