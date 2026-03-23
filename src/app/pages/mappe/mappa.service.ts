import { Injectable, signal, computed, effect } from '@angular/core';
import { toast, agree } from '../../tools/feedbacksUI';

export interface Mappa {
  id: string;
  value: { [key: string]: string[] };
}

@Injectable({ providedIn: 'root' })
export class MappaService {
  private readonly STORAGE_KEY_ATTUALE = 'mappa_attuale';
  
  constructor() {
    this.storage_sync();
    // Effetto per la persistenza automatica della mappa corrente
    effect(() => {
      const data = this.mappa_value();
      if (Object.keys(data.value).length > 0) {
        this.saveCurrentMapToStorage(data);
      }
    });
  } 
  
  // STATO PUBBLICO
  mappa_value = signal<Mappa>(this.loadCurrentMapFromStorage());
  
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
      if (!saved) return { id: '', value: {} };
      
      const parsed = JSON.parse(saved);
      
      // Logica di migrazione: se il dato è nel vecchio formato (oggetto diretto), lo avvolge
      if (parsed && !parsed.value && Object.keys(parsed).length > 0) {
        return { id: 'migrated-' + Date.now(), value: parsed };
      }
      
      return parsed && parsed.value ? parsed : { id: '', value: {} };
    } catch (e) {
      console.error("Errore caricamento Mappa Attuale:", e);
      return { id: '', value: {} };
    }
  }

  mappa_isVoid = computed(() => 
    this.mappa_righe().length === 0 || 
    this.mappa_colonne().length === 0);
  
  // Restituisce l'array delle chiavi delle righe (es. ['A', 'B', 'C'])
  mappa_righe = computed(() => Object.keys(this.mappa_value().value));
  
  // Restituisce l'array degli indici delle colonne (es. [0, 1, 2, 3])
  mappa_colonne = computed(() => {
    const grid = this.mappa_value().value;
    const keys = Object.keys(grid);
    return keys.length > 0 ? Array.from({ length: grid[keys[0]].length }, (_, i) => i) : [];
  });
  
  mappa_reset(){
    this.mappa_value.set({ id: '', value: {} });
  }

  mappa_create(righe: number, colonne: number): void {
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
    const nuovaGriglia: { [key: string]: string[] } = {};
    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      nuovaGriglia[letteraRiga] = new Array(colonne).fill('');
    }

    this.mappa_value.set({
      id: 'map-' + Date.now(),
      value: nuovaGriglia
    });
  }

  // AGGIUNGE SIMBOLI
  mappa_setCell(riga: string, colonna: number, simbolo: string): void {
    const mappaCorrente = this.mappa_value();
    const nuovaMappa = JSON.parse(JSON.stringify(mappaCorrente)) as Mappa;
    
    if (!mappaCorrente.value[riga.toUpperCase()]) {
      toast.danger(`Riga "${riga}" non valida!`);
      return;
    }
    if (colonna < 0) {
      toast.danger(`Valori negativi non ammessi`);
      return;
    }
    if (colonna >= this.mappa_colonne().length) {
      toast.danger(`Colonna "$${colonna + 1}" non valida!`);
      return;
    }
    if(!simbolo.length){
      mappaCorrente.value[riga.toUpperCase()][colonna] = '';
      return toast.success("Cella ripulita")
    }

    // reset della stringa del giocatore
    if (simbolo.length > 1) {
      for (const rowKey of Object.keys(mappaCorrente.value)) {
        for (let i = 0; i < mappaCorrente.value[rowKey].length; i++) {
          if (mappaCorrente.value[rowKey][i].toLowerCase() === simbolo.toLowerCase()) {
            nuovaMappa.value[rowKey][i] = '';
          }
        }
      }
    }

    // aggiunge simbolo | sposta giocatore 
    const nuovaCella =nuovaMappa.value[riga][colonna]
    const simboloUguale = nuovaCella == simbolo; 
    const giocatoreInGiocatore = nuovaCella.length >1 
          && simbolo.length >1
   
    if (simboloUguale) {
      return toast.danger("Il simbolo è uguale");
    }else if (giocatoreInGiocatore) {
      return toast.danger("Due giocatori devono avere posizioni diverse");
    } else {
      nuovaMappa.value[riga][colonna] = simbolo;
    }
    
    this.mappa_value.set(nuovaMappa);
    toast.success(`"${simbolo}" inserito in ${riga}${colonna + 1}!`);
  }

  submit(e:Event){
    e.preventDefault();
    const form =e.target as HTMLFormElement
    const input =form.querySelector('input');
    if(!input) return console.error('input non trovato');
    
    this.storage_addMap(input?.value || 'random')
  }

  mappa_removeSymbol(simbolo: string): void {
    const mappaCorrente = this.mappa_value();
    const nuovaMappa = JSON.parse(JSON.stringify(mappaCorrente)) as Mappa;
    for (const rowKey of Object.keys(mappaCorrente.value)) {
      for (let i = 0; i < mappaCorrente.value[rowKey].length; i++) {
        if (mappaCorrente.value[rowKey][i].toLowerCase() === simbolo.toLowerCase()) {
          nuovaMappa.value[rowKey][i] = '';
        }
      }
    }
    this.mappa_value.set(nuovaMappa);
  }

  // SALVATAGGIO MAPPE
  storage_value = signal<{ [key: string]: { mappa: Mappa; mappa_righe: number; mappa_colonne: number } }>({});

  // Ottiene le mappe salvate dal localStorage
  storage_sync(): void {
    const savedMappe = localStorage.getItem('mappe');
    if (savedMappe) {
      try {
        const parsed = JSON.parse(savedMappe);
        // Migrazione anche per lo storage globale se necessario
        for (const key in parsed) {
          if (parsed[key].mappa && !parsed[key].mappa.value) {
            parsed[key].mappa = { id: key, value: parsed[key].mappa };
          }
        }
        this.storage_value.set(parsed);
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
  async storage_addMap(nomeMappa: string = 'random'): Promise<void> {
    const currentMap = this.mappa_value();
    const storage = this.storage_value();
    
    // Priorità al nome fornito (se non 'random' e non vuoto).
    // Altrimenti usiamo l'ID attuale o ne generiamo uno nuovo.
    const keyToSave = (nomeMappa !== 'random' && nomeMappa.trim() !== '') 
      ? nomeMappa 
      : (currentMap.id || 'mappa' + Date.now().toString().slice(-6));

    const isUpdate = currentMap.id === keyToSave && !!storage[keyToSave];
    const isOverwriting = currentMap.id !== keyToSave && !!storage[keyToSave];

    // Conferma per sovrascrittura di una mappa esistente diversa da quella corrente
    if (isOverwriting && !(await agree.warning(`Mappa "${keyToSave}" già esistente. Vuoi sovrascriverla?`))) {
      return;
    }

    const mapToSave: Mappa = { ...currentMap, id: keyToSave };
    
    // Aggiorniamo sempre il segnale per garantire la coerenza dell'ID mostrato nell'interfaccia
    this.mappa_value.set(mapToSave);

    const mappeSalvateCorrenti = { ...storage };
    mappeSalvateCorrenti[keyToSave] = {
      mappa: mapToSave,
      mappa_righe: this.mappa_righe().length,
      mappa_colonne: this.mappa_colonne().length,
    };

    this.storage_value.set(mappeSalvateCorrenti);

    try {
      localStorage.setItem('mappe', JSON.stringify(mappeSalvateCorrenti));
      toast.success(isUpdate ? `Mappa "${keyToSave}" aggiornata!` : `Mappa "${keyToSave}" salvata!`);
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

    this.mappa_value.set(JSON.parse(JSON.stringify(mappaSalvata.mappa)));
  }
}
