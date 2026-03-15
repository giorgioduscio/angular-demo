import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { agree, toast } from '../../tools/feedbacksUI';
import { CombattimentoService } from './logicaCombattimento.service';

export interface Mappa {
  [key: string]: string[];
}

@Component({
  selector: 'app-mappe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mappe.component.html',
})
export class MappeComponent {
  constructor(public comb: CombattimentoService) {
    document.title = "Mappe";
    this.getMappeSalvate();
  }

  tiri: string[] = [];
  mappa: Mappa = {};
  righe: number = 0;
  colonne: number = 0;
  mappeSalvate: { [key: string]: { mappa: Mappa, righe: number, colonne: number } } = {};

  /**
   * Gestisce l'input del prompt principale.
   * @param e L'evento del form (submit o keyup.enter).
   */
  handlePrompt(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('prompt') as HTMLInputElement;
    if (!input) {
      console.error("Input non trovato");
      return;
    }

    const value: string = input.value.trim();
    if (!value) {
      toast('Prompt vuoto', 'danger');
      return;
    }

    const comandi = value.split('>')
                        .map(cmd => cmd.trim())
                        .filter(cmd => cmd);

    for (const comando of comandi) {
      this.eseguiComando(comando);
    }

    input.value = '';
  }

  /**
   * Esegue un singolo comando.
   * @param comando Il comando da eseguire.
   */
  eseguiComando(comando: string): void {
    //  Tiro dadi
        const match_tiro_dadi = comando.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
        if (match_tiro_dadi) {
          const qta = match_tiro_dadi[1] ? parseInt(match_tiro_dadi[1], 10) : 1;
          const max = parseInt(match_tiro_dadi[2], 10);
          const modifier = match_tiro_dadi[3] ? parseInt(match_tiro_dadi[3], 10) : 0;
          this.setTiri(qta, max, modifier);
          return;
        }

    //  Creazione griglia
        const match_griglia = comando.match(/^(\d+)x(\d+)$/i);
        if (match_griglia) {
          const righe = parseInt(match_griglia[1], 10);
          const colonne = parseInt(match_griglia[2], 10);
          this.creaMappa(righe, colonne);
          return;
        }

    //  Gestione mappe
        if (comando.startsWith("mappa ")) {
          const mappaEsistente = !!this.mappa && !!this.mappa['A'];
          const match_elimina_mappa = comando.match(/^mappa elimina (.+)$/i);
          const match_salva_mappa = comando.match(/^mappa salva (.+)$/i);
          const match_carica_mappa = comando.match(/^mappa (.+)$/i);
          const match_lista_mappe = comando.match(/^mappa lista$/i);

          if (match_lista_mappe) {
            const nomiMappe = this.getNomiMappeSalvate();
            if (nomiMappe.length === 0) {
              toast("Nessuna mappa salvata");
            } else {
              toast(`Mappe salvate: ${nomiMappe.join(', ')}`);
            }
          }
          else if (match_elimina_mappa) {
            const nome_mappa = match_elimina_mappa[1].trim();
            this.eliminaMappaSalvata(nome_mappa);
          }
          else if (match_salva_mappa) {
            if (!mappaEsistente) {
              toast("Nessuna mappa da salvare", 'danger');
            } else {
              const nome_mappa = match_salva_mappa[1].trim();
              this.setMappeSalvate(nome_mappa);
            }
          }
          else if (match_carica_mappa) {
            const nome_mappa = match_carica_mappa[1].trim();
            this.caricaMappaSalvata(nome_mappa);
          }
          else {
            toast('Comando mappa non riconosciuto', 'danger');
          }
          return;
        }
    
    //  Inserimento simbolo
        const match_inserisci = comando.match(/^(.+) in ([a-zA-Z])\s*(\d+)$/i);
        if (match_inserisci) {
          const simbolo = match_inserisci[1].trim();
          const riga = match_inserisci[2].toUpperCase();
          const colonna = parseInt(match_inserisci[3], 10) - 1;
          this.setMappa(riga, colonna, simbolo);
          return;
        }

    //  creazione squadre 
        const squadreMatch = comando.match(/^([a-zA-Z]):\s*(.+)$/i);
        if (squadreMatch) {
          const prompt = comando.split(' ');
          const nomeSquadra = prompt.find(p=> p.endsWith(':'))?.replace(':', '') ??'';
          const gradoSfida = prompt.find(p=> p.startsWith('gs'))?.replace('gs', '') ??'';
          const bonusIniziativa = Number(prompt
                .find(p=> p.startsWith('+') || p.startsWith('-'))?? 0);
          const ripetizioni = Number(prompt.find(p=> p.startsWith('x'))?.replace('x', '') ?? 1);
          const classeArmatura =Number(prompt.find(p=> p.startsWith('ca'))?.replace('ca', '') ?? 0);
          const nomeGiocatore = prompt.find(p=> !p.endsWith(':') 
                                && !p.startsWith('gs') 
                                && !p.startsWith('+') 
                                && !p.startsWith('-') 
                                && !p.startsWith('x')) ??"";

          if(!nomeGiocatore && !gradoSfida) return toast("un giocatore non può avere grado sfida", "danger");
          if(nomeGiocatore && !classeArmatura) return toast("un giocatore deve avere una classe armatura", "danger");
          
          for(let i = 0; i < ripetizioni; i++) {
            this.comb.addCombattente(nomeSquadra, bonusIniziativa, 
                              gradoSfida, nomeGiocatore, classeArmatura);
          }

          // se ci sono almeno due squadre, esegui posizionamento
          let squadreEsistenti: string[] = [];
          this.comb.combattenti.forEach(combattente=>{
            if(!squadreEsistenti.includes(combattente.squadra)) {
              squadreEsistenti.push(combattente.squadra);
            }
          })
          
          this.eseguiComando('posizionamento');
          
          console.log('squadreEsistenti', this.comb.combattenti);
          return;
        }

    //  POSIZIONAMENTO
        const posizionamentoMatch = comando.match(/^posizionamento$/i);
        if (posizionamentoMatch) {
          this.comb.posizionamento(this.mappa, this.righe, this.colonne);
          return;
        }

    // TURNO SQUADRA
        const turnoSquadraMatch = comando.match(/^turno ([a-zA-Z]+)$/i);
        if (turnoSquadraMatch) {
          if(!this.righe || !this.colonne) {
            return toast("Selezionare mappa", "danger");
          }
          if(this.comb.combattenti.length<2) {
            return toast("Combattenti insufficenti", "danger");
          }
          const squadra = turnoSquadraMatch[1];
          this.comb.turnoSquadra(squadra, this.mappa, this.righe, this.colonne)
          return;
        }

    // ERRORE
    toast(`Comando "${comando}" non riconosciuto`, 'danger');
  }

  setTiri(qta: number, max: number, modifier: number): void {
    let total = 0;
    const rolls: number[] = [];

    for (let i = 0; i < qta; i++) {
      const roll = Math.floor(Math.random() * max) + 1;
      rolls.push(roll);
      total += roll;
    }

    total += modifier;
    const modifierSign = modifier >= 0 ? `+${modifier}` : modifier;
    const description = `${qta}d${max}${modifier !== 0 ? modifierSign : ''} = ${total}`;

    this.tiri.unshift(description);
    if (this.tiri.length > 10) {
      this.tiri.pop();
    }
  }

  creaMappa(righe: number, colonne: number): void {
    if (righe <= 0 || colonne <= 0) {
      toast('Dimensioni della mappa non valide', 'danger');
      return;
    }

    if (righe > 26) {
      toast('Il numero massimo di righe è 26', 'danger');
      return;
    }

    this.righe = righe;
    this.colonne = colonne;
    this.mappa = {};

    const lettereRighe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      this.mappa[letteraRiga] = new Array(colonne).fill('');
    }

    toast(`Mappa ${righe}x${colonne} creata!`, 'success');
  }

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

  mappa_getColonne(length: number): number[] {
    return Array(length).fill(0).map((_, i) => i);
  }

  mappa_getRighe(obj: any): string[] {
    return Object.keys(obj);
  }

  getMappeSalvate(): void {
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

  getNomiMappeSalvate(): string[] {
    return Object.keys(this.mappeSalvate);
  }

  getMappaSalvataDaNome(nomeMappa: string): { mappa: Mappa, righe: number, colonne: number } | null {
    return this.mappeSalvate[nomeMappa] || null;
  }

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

