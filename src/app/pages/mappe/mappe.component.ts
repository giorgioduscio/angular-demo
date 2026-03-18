import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toast } from '../../tools/feedbacksUI';
import { CombattimentoService } from './combattimento.service';
import { MappaService } from './mappa.service';
import { CellComponent } from './cell.component';

@Component({
  selector: 'app-mappe',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './mappe.component.html',
})
export class MappeComponent {
  constructor(
    public comb: CombattimentoService,
    public mappa: MappaService
  ) {
    document.title = "Mappe";
  }

  // Gestisce l'input del prompt principale
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

    const comandi = value.split('>').map(cmd => cmd.trim()).filter(cmd => cmd);

    for (const comando of comandi) {
      this.eseguiComando(comando, input);
    }
  }

  // Esegue un singolo comando
  comandi= {
    tiro_dadi: {
      pattern: /^(\d*)d(\d+)([+-]\d+)?$/i,
      execute: (comando: string) => {
        const match_tiro_dadi = comando.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
        if (match_tiro_dadi) {
          const qta = match_tiro_dadi[1] ? parseInt(match_tiro_dadi[1], 10) : 1;
          const max = parseInt(match_tiro_dadi[2], 10);
          const modifier = match_tiro_dadi[3] ? parseInt(match_tiro_dadi[3], 10) : 0;
          this.setTiri(qta, max, modifier);
        }
      }
    },
    creazione_griglia: {
      pattern: /^(\d+)x(\d+)$/i,
      execute: (comando: string) => {
        const match_griglia = comando.match(/^(\d+)x(\d+)$/i);
        if (match_griglia) {
          const righe = parseInt(match_griglia[1], 10);
          const colonne = parseInt(match_griglia[2], 10);
          this.mappa.creaMappa(righe, colonne);
        }
      }
    },
    gestione_mappa: {
      pattern: /^mappa /i,
      execute: (comando: string) => {
        const mappaEsistente = !!this.mappa.mappa() && !!this.mappa.mappa()['A'];
        const match_elimina_mappa = comando.match(/^mappa elimina (.+)$/i);
        const match_salva_mappa = comando.match(/^mappa salva (.+)$/i);
        const match_carica_mappa = comando.match(/^mappa (.+)$/i);
        const match_lista_mappe = comando.match(/^mappa lista$/i);

        if (match_lista_mappe) {
          const nomiMappe = this.mappa.getNomi();
          if (nomiMappe.length === 0) {
            toast("Nessuna mappa salvata");
          } else {
            toast(`Mappe salvate: ${nomiMappe.join(', ')}`);
          }
        }
        else if (match_elimina_mappa) {
          const nome_mappa = match_elimina_mappa[1].trim();
          this.mappa.eliminaMappaSalvata(nome_mappa);
        }
        else if (match_salva_mappa) {
          if (!mappaEsistente) {
            toast("Nessuna mappa da salvare", 'danger');
          } else {
            const nome_mappa = match_salva_mappa[1].trim();
            this.mappa.setMappeSalvate(nome_mappa);
          }
        }
        else if (match_carica_mappa) {
          const nome_mappa = match_carica_mappa[1].trim();
          this.mappa.caricaMappaSalvata(nome_mappa);
        }
        else {
          toast('Comando mappa non riconosciuto', 'danger');
        }
      }
    },
    inserimento_simbolo: {
      pattern: /^(.+) in ([a-zA-Z])\s*(\d+)$/i,
      execute: (comando: string) => {
        const match_inserisci = comando.match(/^(.+) in ([a-zA-Z])\s*(\d+)$/i);
        if (match_inserisci) {
          const simbolo = match_inserisci[1].trim();
          const riga = match_inserisci[2].toUpperCase();
          const colonna = parseInt(match_inserisci[3], 10) - 1;
          this.mappa.setMappa(riga, colonna, simbolo);
        }
      }
    },
    creazione_squadre_personaggi: {
      pattern: /^([a-zA-Z]):\s*(.+)$/i,
      execute: (comando: string) => {
        const squadreMatch = comando.match(/^([a-zA-Z]):\s*(.+)$/i);
        if (squadreMatch) {
          const [, nomeSquadra, prompt_stringa] = squadreMatch;
          const prompt = prompt_stringa.split(' ');

          function extractParam(prefix: string, defaultValue: any = 0) {
            const param = prompt.find(p => p.includes(prefix));
            return param ? Number(param.replace(prefix, '')) || defaultValue : defaultValue;
          };

          const gradoSfida = prompt.find(p => p.includes('gs'))?.replace('gs', '') || '';
          const bonusIniziativa = extractParam('+') || extractParam('-', 0);
          const ripetizioni = extractParam('x', 1);
          const classeArmatura = extractParam('ca', 0);
          const hp = extractParam('hp', 0);
          const tipo = prompt.includes('distanza') ? 'distanza' : 'mischia';

          const reservedKeywords = ['distanza', 'mischia', 'gs', 'ca', 'hp', 'x', ':', '-', '+'];
          const nomeGiocatore = prompt.find(p => !reservedKeywords.some(kw => p.includes(kw))) || '';

          if (!nomeGiocatore && !gradoSfida) {
            toast("Un giocatore non può avere grado sfida", "danger");
            return;
          }
          if (nomeGiocatore && ripetizioni > 1) {
            toast("Un giocatore è unico", "danger");
            return;
          }
          if (nomeGiocatore && !classeArmatura) {
            toast("Un giocatore deve avere una classe armatura", "danger");
            return;
          }
          if (nomeGiocatore && !hp) {
            toast("Un giocatore deve avere dei punti ferita", "danger");
            return;
          }
          if (nomeGiocatore && !tipo) {
            toast("Un giocatore non ha tipo", "danger");
            return;
          }

          for (let i = 0; i < ripetizioni; i++) {
            this.comb.addCombattente(nomeSquadra, bonusIniziativa, gradoSfida, nomeGiocatore, classeArmatura, hp, tipo);
          }

          this.eseguiComando('start');
        }
      }
    },
    posizionamento: {
      pattern: /^start$/i,
      execute: () => {
        this.comb.posizionamento(this.mappa.mappa(), this.mappa.righe(), this.mappa.colonne());
      }
    },
    ferire_o_curare: {
      pattern: /^(\S+) ([+-]\d+)$/,
      execute: (comando: string) => {
        const parts = comando.split(' ');
        if (parts.length === 2 && (parts[1].includes('-') || parts[1].includes('+'))) {
          const [idCombattente, quantita] = parts;
          this.comb.vitalitaPersonaggio(idCombattente, Number(quantita));
        }
      }
    },
    npc_attacca_manualmente: {
      pattern: /^(\S+) attacca (\S+)$/i,
      execute: (comando: string) => {
        const parts = comando.toLowerCase().split(' ');
        if (parts.length === 3 && parts[1] === 'attacca') {
          const [idAttaccante, _, idAttaccato] = parts;
          const combattenti = this.comb.combattenti();
          const attaccante = combattenti.find(c => c.id.toLowerCase() === idAttaccante);
          const attaccato = combattenti.find(c => c.id.toLowerCase() === idAttaccato);
          if (!attaccante || !attaccato) {
            toast("Contendenti non trovati", "danger");
            return;
          }
          this.comb.tiraPerColpire(attaccante, attaccato);
        }
      }
    },
    rimuovi_personaggio_manualmente: {
      pattern: /^rimuovi (\S+)$/i,
      execute: (comando: string) => {
        const idPersonaggio = comando.split(" ")[1];
        if (!idPersonaggio) {
          toast("ID personaggio non valido", "danger");
          return;
        }
        this.comb.removeCombattente(idPersonaggio);
        this.mappa.rimuoviSimbolo(idPersonaggio);
      }
    },
    squadra_attacca_manualmente: {
      pattern: /^turno (\S+)$/i, // "turno <id>"
      execute: (comando: string) => {
        const parts = comando.split(" ");
        if (parts.length < 2) {
          toast("Comando non valido", "danger");
          return;
        }

        const id = parts[1];
        const combattenti = this.comb.combattenti();

        // 1. Verifica se è un singolo personaggio (per nome/id)
        const personaggio = combattenti.find(c => c.id.toLowerCase() === id.toLowerCase());
        if (personaggio) {
          // Trova un nemico casuale tra gli avversari
          const avversari = combattenti.filter(c => c.squadra !== personaggio.squadra);
          if (avversari.length === 0) {
            toast("Nessun avversario disponibile", "danger");
            return;
          }
          const nemicoScelto = this.comb.scegliNemico(personaggio, avversari, this.mappa.mappa());
          if (!nemicoScelto) {
            toast(`${personaggio.id} non trova un nemico valido`, "danger");
            return;
          }

          // Logica di movimento/attacco (come nel codice originale, ma per un solo personaggio)
          let sonoPortata = false;
          let i = 6;
          let haAttaccato = false;
          const interval = setInterval(() => {
            sonoPortata = this.comb.sonoPortata(personaggio, nemicoScelto, this.mappa.mappa());
            if (!sonoPortata) {
              this.comb.movimento(personaggio, nemicoScelto, this.mappa.mappa);
            } else {
              this.comb.tiraPerColpire(personaggio, nemicoScelto);
              haAttaccato = true;
            }
            i--;
            if (i <= 0 || haAttaccato) clearInterval(interval);
          }, 500);
          return;
        }

        // 2. Se non è un personaggio, tratta come squadra (logica originale)
        console.log(`\n\nTurno squadra '${id}'`);
        const { membri, avversari } = this.comb.getMembriSquadra(id);
        if (membri.length === 0) {
          toast(`Squadra "${id}" non trovata o vuota`, "danger");
          return;
        }

        for (const membro of membri) {
          const nemicoScelto = this.comb.scegliNemico(membro, avversari, this.mappa.mappa());
          if (!nemicoScelto) {
            console.error(membro.id, "non trova nemico");
            continue;
          }

          let sonoPortata = false;
          let i = 6;
          let haAttaccato = false;
          const interval = setInterval(() => {
            sonoPortata = this.comb.sonoPortata(membro, nemicoScelto, this.mappa.mappa());
            if (!sonoPortata) {
              this.comb.movimento(membro, nemicoScelto, this.mappa.mappa);
            } else {
              this.comb.tiraPerColpire(membro, nemicoScelto);
              haAttaccato = true;
            }
            i--;
            if (i <= 0 || haAttaccato) clearInterval(interval);
          }, 500);
        }
      }
    },    
    reset: {
      pattern: /^reset$/i,
      execute: () => {
        this.comb.combattenti.set([]);
        this.mappa.mappa.set({});
        this.mappa.righe.set(0);
        this.mappa.colonne.set(0);
      }
    }
  } as const;

  // Esegui il comando corrispondente
  eseguiComando(comando: string, input?: HTMLInputElement): void {
    let comandoTrovato = false;
    for (const [key, cmd] of Object.entries(this.comandi)) {
      if (cmd.pattern.test(comando)) {
        cmd.execute(comando);
        comandoTrovato = true;
        if (input) input.value = '';
        break;
      }
    }

    if (!comandoTrovato) {
      toast(`Comando "${comando}" non riconosciuto`, 'danger');
    }
  }

  // TIRI DEI DADI
  tiri: string[] = [];
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

  // VISUALIZZAZIONE MAPPA
  mappa_getColonne(): number[] {
    return this.mappa.mappa_getColonne(this.mappa.colonne());
  }
  mappa_getRighe(): string[] {
    return this.mappa.mappa_getRighe(this.mappa.mappa());
  }
}
