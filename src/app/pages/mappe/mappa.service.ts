import { Injectable, signal } from '@angular/core';
import { toast, agree } from '../../tools/feedbacksUI';

export interface Mappa {
  [key: string]: string[];
}

@Injectable({ providedIn: 'root' })
export class MappaService {
  // Proprietà convertite in signals
  righe = signal<number>(0);
  colonne = signal<number>(0);
  mappa = signal<Mappa>({});
  mappeSalvate = signal<{ [key: string]: { mappa: Mappa; righe: number; colonne: number } }>({});

  constructor() {
    this.syncLocale();
  }

  // CREAZIONE MAPPA
  creaMappa(righe: number, colonne: number): void {
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

    // Costruzione
    this.righe.set(righe);
    this.colonne.set(colonne);

    const lettereRighe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nuovaMappa: Mappa = {};
    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      nuovaMappa[letteraRiga] = new Array(colonne).fill('');
    }

    this.mappa.set(nuovaMappa);
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
    const mappaCorrente = this.mappa();
    if (!mappaCorrente[riga] || colonna < 0 || colonna >= this.colonne()) {
      toast(`Posizione "${riga}${colonna + 1}" non valida!`, 'danger');
      return;
    }

    if (simbolo.length > 1) {
      for (const rowKey of Object.keys(mappaCorrente)) {
        for (let i = 0; i < mappaCorrente[rowKey].length; i++) {
          if (mappaCorrente[rowKey][i].toLowerCase() === simbolo.toLowerCase()) {
            mappaCorrente[rowKey][i] = '';
          }
        }
      }
    }

    // Crea una nuova copia della mappa per evitare mutazioni dirette
    const nuovaMappa = { ...mappaCorrente };
    nuovaMappa[riga][colonna] = simbolo;
    this.mappa.set(nuovaMappa);

    toast(`"${simbolo}" inserito in ${riga}${colonna + 1}!`, 'success');
  }

  // SALVATAGGIO MAPPE
  // Ottiene le mappe salvate dal localStorage
  syncLocale(): void {
    const savedMappe = localStorage.getItem('mappe');
    if (savedMappe) {
      try {
        this.mappeSalvate.set(JSON.parse(savedMappe));
      } catch (e) {
        console.error('Errore nel parsing delle mappe salvate:', e);
        this.mappeSalvate.set({});
      }
    } else {
      this.mappeSalvate.set({});
    }
  }

  // Restituisce i nomi delle mappe salvate
  getNomi(): string[] {
    return Object.keys(this.mappeSalvate());
  }

  // Restituisce una mappa salvata dato il nome
  getMappaSalvataDaNome(nomeMappa: string): { mappa: Mappa; righe: number; colonne: number } | null {
    return this.mappeSalvate()[nomeMappa] || null;
  }

  // SALVA MAPPA
  async setMappeSalvate(nomeMappa: string): Promise<void> {
    if (!nomeMappa) {
      toast('Nome mappa non valido', 'danger');
      return;
    }

    if (this.mappeSalvate()[nomeMappa] && !(await agree(`Mappa "${nomeMappa}" già esistente. Vuoi sovrascriverla?`))) {
      return;
    }

    const mappeSalvateCorrenti = this.mappeSalvate();
    mappeSalvateCorrenti[nomeMappa] = {
      mappa: { ...this.mappa() },
      righe: this.righe(),
      colonne: this.colonne(),
    };

    this.mappeSalvate.set(mappeSalvateCorrenti);

    try {
      localStorage.setItem('mappe', JSON.stringify(mappeSalvateCorrenti));
      toast(`Mappa "${nomeMappa}" salvata!`, 'success');
    } catch (e) {
      console.error('Errore nel salvataggio della mappa:', e);
      toast('Errore nel salvataggio della mappa', 'danger');
    }
  }

  // ELIMINA MAPPA
  async eliminaMappaSalvata(nomeMappa: string): Promise<void> {
    if (!this.mappeSalvate()[nomeMappa]) {
      toast(`Mappa "${nomeMappa}" non trovata`, 'danger');
      return;
    }

    if (!(await agree(`Sei sicuro di voler eliminare la mappa "${nomeMappa}"?`))) {
      return;
    }

    const mappeSalvateCorrenti = { ...this.mappeSalvate() };
    delete mappeSalvateCorrenti[nomeMappa];
    this.mappeSalvate.set(mappeSalvateCorrenti);

    try {
      localStorage.setItem('mappe', JSON.stringify(mappeSalvateCorrenti));
      toast(`Mappa "${nomeMappa}" eliminata!`, 'success');
    } catch (e) {
      console.error('Errore nell\'eliminazione della mappa:', e);
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

    this.mappa.set({ ...mappaSalvata.mappa });
    this.righe.set(mappaSalvata.righe);
    this.colonne.set(mappaSalvata.colonne);
    toast(`Mappa "${nomeMappa}" caricata!`, 'success');
  }
}
