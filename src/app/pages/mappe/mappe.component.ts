import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toast } from '../../tools/feedbacksUI';

@Component({
  selector: 'app-mappe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mappe.component.html',
})
export class MappeComponent {
  tiri: string[] = []; // Array per memorizzare la cronologia dei tiri
  mappa: { [key: string]: string[] } = {}; // Oggetto per memorizzare la griglia della mappa
  righe: number = 0; // Numero di righe della mappa
  colonne: number = 0; // Numero di colonne della mappa

  /**
   * Gestisce l'input del prompt principale.
   * @param e L'evento del form (submit o keyup.enter).
   */
  handlePrompt(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('prompt') as HTMLInputElement;

    if (!input) {
      toast('Input non trovato', 'danger');
      return;
    }

    const value: string = input.value.trim();
    if (!value) {
      toast('Prompt vuoto', 'danger');
      return;
    }

    // Suddivide il prompt in singoli comandi separati da virgole
    const comandi = value.split(',')
                        .map(cmd => cmd.trim())
                        .filter(cmd => cmd);

    // Esegue ogni comando in sequenza
    for (const comando of comandi) {
      this.eseguiComando(comando);
    }

    input.value = ''; // Pulisce l'input dopo l'invio
  }

  /**
   * Esegue un singolo comando.
   * @param comando Il comando da eseguire.
   */
  eseguiComando(comando: string): void {
    // Gestione del tiro dei dadi (es. "d20+5", "2d10-3", "d100")
    const match_tiro_dadi = comando.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
    if (match_tiro_dadi) {
      const qta = match_tiro_dadi[1] ? parseInt(match_tiro_dadi[1], 10) : 1;
      const max = parseInt(match_tiro_dadi[2], 10);
      const modifier = match_tiro_dadi[3] ? parseInt(match_tiro_dadi[3], 10) : 0;
      this.setTiri(qta, max, modifier);
    }
    // Gestione della creazione della griglia (es. "9x9", "20x10")
    else if (comando.match(/^(\d+)x(\d+)$/i)) {
      const match_griglia = comando.match(/^(\d+)x(\d+)$/i);
      if (match_griglia) {
        const righe = parseInt(match_griglia[1], 10);
        const colonne = parseInt(match_griglia[2], 10);
        this.creaMappa(righe, colonne);
      }
    }
    // Gestione dell'inserimento di simboli nelle celle (es. ". in g4", "ciao in a3")
    else if (comando.match(/^(.+) in ([a-zA-Z])\s*(\d+)$/i)) {
      const match_inserisci = comando.match(/^(.+) in ([a-zA-Z])\s*(\d+)$/i);
      if (match_inserisci) {
        const simbolo = match_inserisci[1].trim();
        const riga = match_inserisci[2].toUpperCase();
        const colonna = parseInt(match_inserisci[3], 10) - 1; // Converti in indice (0-based)
        this.setMappa(riga, colonna, simbolo);
      }
    }
    else {
      toast(`Comando "${comando}" non riconosciuto`, 'danger');
    }
  }

  /**
   * Calcola un tiro di dadi e aggiorna la cronologia.
   * @param qta Quantità di dadi (es. 2 in "2d10").
   * @param max Numero massimo del dado (es. 10 in "2d10").
   * @param modifier Modificatore (es. +5 in "d20+5").
   */
  setTiri(qta: number, max: number, modifier: number): void {
    let total = 0;
    const rolls: number[] = [];

    // Esegue i tiri
    for (let i = 0; i < qta; i++) {
      const roll = Math.floor(Math.random() * max) + 1; // Tiro da 1 a max
      rolls.push(roll);
      total += roll;
    }

    // Applica il modificatore
    total += modifier;

    // Crea la stringa di descrizione del tiro (es. "2d10+5 = 17")
    const modifierSign = modifier >= 0 ? `+${modifier}` : modifier;
    const description = `${qta}d${max}${modifier !== 0 ? modifierSign : ''} = ${total}`;

    // Aggiunge il tiro alla cronologia
    this.tiri.unshift(description);
    if(this.tiri.length > 10) {
      this.tiri.pop();
    }
  }

  /**
   * Crea una griglia vuota con le dimensioni specificate.
   * @param righe Numero di righe della griglia.
   * @param colonne Numero di colonne della griglia.
   */
  creaMappa(righe: number, colonne: number): void {
    this.righe = righe;
    this.colonne = colonne;
    this.mappa = {};

    // Inizializza le righe della mappa
    const lettereRighe = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();

    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      this.mappa[letteraRiga] = new Array(colonne).fill('');
    }

    toast(`Mappa ${righe}x${colonne} creata con successo!`, 'success');
  }

  /**
   * Imposta il valore di una cella nella mappa.
   * Se il simbolo ha più di un carattere, lo rimuove dalle altre celle.
   * @param riga Lettera della riga (es. "A").
   * @param colonna Indice della colonna (0-based).
   * @param simbolo Simbolo da inserire nella cella.
   */
  setMappa(riga: string, colonna: number, simbolo: string): void {
    if (!this.mappa[riga] || colonna < 0 || colonna >= this.colonne) {
      toast(`Posizione "${riga}${colonna + 1}" non valida!`, 'danger');
      return;
    }

    // Se il simbolo ha più di un carattere, lo rimuove dalle altre celle
    if (simbolo.length > 1) {
      for (const rowKey of Object.keys(this.mappa)) {
        for (let i = 0; i < this.mappa[rowKey].length; i++) {
          if (this.mappa[rowKey][i] === simbolo) {
            this.mappa[rowKey][i] = '';
          }
        }
      }
    }

    // Imposta il simbolo nella cella specificata
    this.mappa[riga][colonna] = simbolo;
    toast(`"${simbolo}" inserito in ${riga}${colonna + 1}!`, 'success');
  }

  /**
   * Restituisce un array di numeri da 0 a length-1.
   * Utilizzato per generare le colonne della tabella.
   * @param length Lunghezza dell'array da generare.
   */
  mappa_getColonne(length: number): number[] {
    return Array(length).fill(0).map((_, i) => i);
  }

  /**
   * Restituisce le chiavi di un oggetto.
   * Utilizzato per iterare sulle righe della mappa.
   * @param obj Oggetto di cui ottenere le chiavi.
   */
  mappa_getRighe(obj: any): string[] {
    return Object.keys(obj);
  }
}
