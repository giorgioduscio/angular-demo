import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toast } from '../../tools/feedbacksUI';
import { CombattimentoService } from './logicaCombattimento.service';
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

    const comandi = value.split('>')
                      .map(cmd => cmd.trim())
                      .filter(cmd => cmd);

    for (const comando of comandi) {
      this.eseguiComando(comando);
    }

    input.value = '';
  }

  // Esegue un singolo comando
  eseguiComando(comando: string): void {
    // Tiro dadi
    const match_tiro_dadi = comando.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
    if (match_tiro_dadi) {
      const qta = match_tiro_dadi[1] ? parseInt(match_tiro_dadi[1], 10) : 1;
      const max = parseInt(match_tiro_dadi[2], 10);
      const modifier = match_tiro_dadi[3] ? parseInt(match_tiro_dadi[3], 10) : 0;
      this.setTiri(qta, max, modifier);
      return;
    }

    // Creazione griglia
    const match_griglia = comando.match(/^(\d+)x(\d+)$/i);
    if (match_griglia) {
      const righe = parseInt(match_griglia[1], 10);
      const colonne = parseInt(match_griglia[2], 10);
      this.mappa.creaMappa(righe, colonne);
      return;
    }

    // Gestione mappe
    if (comando.startsWith("mappa ")) {
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
      return;
    }

    // Inserimento simbolo
    const match_inserisci = comando.match(/^(.+) in ([a-zA-Z])\s*(\d+)$/i);
    if (match_inserisci) {
      const simbolo = match_inserisci[1].trim();
      const riga = match_inserisci[2].toUpperCase();
      const colonna = parseInt(match_inserisci[3], 10) - 1;
      this.mappa.setMappa(riga, colonna, simbolo);
      return;
    }

    // CREAZIONE SQUADRE E PERSONAGGI 
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

      // Se ci sono almeno due squadre, esegui posizionamento
      let squadreEsistenti: string[] = [];
      this.comb.combattenti().forEach(combattente=>{
        if(!squadreEsistenti.includes(combattente.squadra)) {
          squadreEsistenti.push(combattente.squadra);
        }
      })

      this.eseguiComando('start');
      return;
    }

    // POSIZIONAMENTO
    const posizionamentoMatch = 'start' === comando;
    if (posizionamentoMatch) {
      this.comb.posizionamento(this.mappa.mappa(), this.mappa.righe(), this.mappa.colonne());
      return;
    }
    
    // FERIRE O CURARE "id_personaggio -10" "id_personaggio +14"
    const ferireCurareMatch = comando.split(' ').length === 2
                              && (comando.includes('-') || comando.includes('+'));
    if (ferireCurareMatch) {
      const [idCombattente, quantita] = comando.split(' ');
      this.comb.vitalitaPersonaggio(idCombattente, Number(quantita));
      return;
    }

    // PERSONAGGIO ATTACCA MANUALMENTE 
    // "id_attaccante attacca id_attaccato"
    const attaccoManualeMatch = comando.split(' ').length === 3
                          && comando.split(" ")[1]==='attacca';
    if (attaccoManualeMatch) {
      const [idAttaccante, _, idAttaccato] = comando.toLocaleLowerCase().split(' ');
      const combattenti = this.comb.combattenti();
      const attaccante = combattenti.find(c => c.id.toLowerCase() === idAttaccante);
      const attaccato = combattenti.find(c => c.id.toLowerCase() === idAttaccato);
      if(!attaccante || !attaccato) return toast("Contendenti non trovati", "danger");

      // console.log('Attacco manuale:', attaccante.id, attaccato.id);
      this.comb.tiraPerColpire(attaccante, attaccato);
      return;
    }

    // RIMUOVI PERSONAGGIO MANUALMENTE
    // "rimuovi id_personaggio"
    const rimuoviMatch = comando.startsWith("rimuovi ");
    if (rimuoviMatch) {
      const idPersonaggio = comando.split(" ")[1];
      if(!idPersonaggio) return toast("ID personaggio non valido", "danger");

      this.comb.removeCombattente(idPersonaggio);
      return;
    }

    // SQUADRA ATTACCA AUTOMATICAMENTE
    // "turno idSquadra"
    const turnoMatch = comando.startsWith("turno ");
    if (turnoMatch) {
      const idSquadra = comando.split(" ")[1];
      if(!idSquadra) return toast("ID squadra non valido", "danger");

      this.comb.turnoSquadra(idSquadra);
      return;
    }

    // RESET
    if (comando === "reset") {
      this.comb.combattenti.set([]);
      this.mappa.mappa.set({});
      this.mappa.righe.set(0);
      this.mappa.colonne.set(0);
      return;
    }

    // ERRORE
    toast(`Comando "${comando}" non riconosciuto`, 'danger');
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

