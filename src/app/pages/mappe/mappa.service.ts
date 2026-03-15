import { Injectable } from '@angular/core';
import { toast, agree } from '../../tools/feedbacksUI';

export interface Mappa {
  [key: string]: string[];
}

@Injectable({  providedIn: 'root' })
export class MappaService {
  constructor() {
    this.syncLocale();
  } 
  
  // CREAZIONE MAPPA
  righe: number = 0;
  colonne: number = 0;
  mappa: Mappa = {};
  creaMappa(righe: number, colonne: number): void {
    // gestisce input non validi
    if (righe <= 0 || colonne <= 0) {
      toast('Dimensioni della mappa non valide', 'danger');
      return;
    }

    const maxCelle = 26;
    if (righe > maxCelle || colonne > maxCelle) {
      toast(`Il numero massimo di righe e colonne è ${maxCelle}`, 'danger');
      return;
    }

    // costuzione
    this.righe = righe;
    this.colonne = colonne;
    
    const lettereRighe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.mappa = {};
    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      this.mappa[letteraRiga] = new Array(colonne).fill('');
    }

    toast(`Mappa ${righe}x${colonne} creata!`, 'success');
  }

  // VISUALIZZAZIONE MAPPA
  mappa_getColonne(length: number): number[] {
    return Array(length).fill(0).map((_, i) => i);
  }
  mappa_getRighe(obj: any): string[] {
    return Object.keys(obj);
  }

  // AGGIUNGE SIMBOLI
  setMappa(riga: string, colonna: number, simbolo: string): void {
    if (!this.mappa[riga] || colonna < 0 || colonna >= this.colonne) {
      toast(`Posizione "${riga}${colonna + 1}" non valida!`, 'danger');
      return;
    }

    if (simbolo.length > 1) {
      for (const rowKey of Object.keys(this.mappa)) {
        for (let i = 0; i < this.mappa[rowKey].length; i++) {
          if (this.mappa[rowKey][i] === simbolo) {
            this.mappa[rowKey][i] = '';
          }
        }
      }
    }

    this.mappa[riga][colonna] = simbolo;
    toast(`"${simbolo}" inserito in ${riga}${colonna + 1}!`, 'success');
  }

  // SALVATAGGIO MAPPE
  mappeSalvate: { [key: string]: { mappa: Mappa, righe: number, colonne: number } } = {};
  
  // Ottiene le mappe salvate dal localStorage
  syncLocale(): void {
    const savedMappe = localStorage.getItem('mappe');
    if (savedMappe) {
      try {
        this.mappeSalvate = JSON.parse(savedMappe);
      } catch (e) {
        console.error("Errore nel parsing delle mappe salvate:", e);
        this.mappeSalvate = {};
      }
    } else {
      this.mappeSalvate = {};
    }
  }

  // Restituisce i nomi delle mappe salvate
  getNomi(): string[] {
    return Object.keys(this.mappeSalvate);
  }

  // Restituisce una mappa salvata dato il nome
  getMappaSalvataDaNome(nomeMappa: string): { mappa: Mappa, righe: number, colonne: number } | null {
    return this.mappeSalvate[nomeMappa] || null;
  }

  // SALVA MAPPA
  async setMappeSalvate(nomeMappa: string): Promise<void> {
    if (!nomeMappa) {
      toast('Nome mappa non valido', 'danger');
      return;
    }

    if (this.mappeSalvate[nomeMappa] && !(await agree(`Mappa "${nomeMappa}" già esistente. Vuoi sovrascriverla?`))) {
      return;
    }

    this.mappeSalvate[nomeMappa] = {
      mappa: { ...this.mappa },
      righe: this.righe,
      colonne: this.colonne
    };

    try {
      localStorage.setItem('mappe', JSON.stringify(this.mappeSalvate));
      toast(`Mappa "${nomeMappa}" salvata!`, 'success');
    } catch (e) {
      console.error("Errore nel salvataggio della mappa:", e);
      toast('Errore nel salvataggio della mappa', 'danger');
    }
  }

  // ELIMINA MAPPA
  async eliminaMappaSalvata(nomeMappa: string): Promise<void> {
    if (!this.mappeSalvate[nomeMappa]) {
      toast(`Mappa "${nomeMappa}" non trovata`, 'danger');
      return;
    }

    if (!(await agree(`Sei sicuro di voler eliminare la mappa "${nomeMappa}"?`))) {
      return;
    }

    delete this.mappeSalvate[nomeMappa];

    try {
      localStorage.setItem('mappe', JSON.stringify(this.mappeSalvate));
      toast(`Mappa "${nomeMappa}" eliminata!`, 'success');
    } catch (e) {
      console.error("Errore nell'eliminazione della mappa:", e);
      toast('Errore nell\'eliminazione della mappa', 'danger');
    }
  }

  // CARICA MAPPA
  async caricaMappaSalvata(nomeMappa: string): Promise<void> {
    const mappaSalvata = this.getMappaSalvataDaNome(nomeMappa);
    if (!mappaSalvata) {
      toast(`Mappa "${nomeMappa}" non trovata`, 'danger');
      return;
    }

    this.mappa = { ...mappaSalvata.mappa };
    this.righe = mappaSalvata.righe;
    this.colonne = mappaSalvata.colonne;
    toast(`Mappa "${nomeMappa}" caricata!`, 'success');
  }
}
