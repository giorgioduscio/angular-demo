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
      const [, nomeSquadra, prompt_stringa] = squadreMatch;
      const prompt = prompt_stringa.split(' ');

      // Funzione ausiliaria per estrarre parametri con prefisso
      function extractParam(prefix: string, defaultValue: any = 0) {
        const param = prompt.find(p => p.includes(prefix));
        return param ? Number(param.replace(prefix, '')) || defaultValue : defaultValue;
      };

      // Estrazione parametri con logica semplificata
      const gradoSfida = prompt.find(p => p.includes('gs'))?.replace('gs', '') || '';
      const bonusIniziativa = extractParam('+') || extractParam('-', 0);
      const ripetizioni = extractParam('x', 1);
      const classeArmatura = extractParam('ca', 0);
      const hp = extractParam('hp', 0);
      const tipo = prompt.includes('distanza') ? 'distanza' : 'mischia';

      // Estrazione nome giocatore: esclude tutti i token "riservati"
      const reservedKeywords = ['distanza', 'mischia', 'gs', 'ca', 
                                'hp', 'x', ':', '-', '+'];
      const nomeGiocatore = prompt.find(p =>
        !reservedKeywords.some(kw => p.includes(kw)) 
      ) || '';

      if(!nomeGiocatore && !gradoSfida) return toast("un giocatore non può avere grado sfida", "danger");
      if(nomeGiocatore && ripetizioni) return toast("un giocatore è unico", "danger");
      if(nomeGiocatore && !classeArmatura) return toast("un giocatore deve avere una classe armatura", "danger");
      if(nomeGiocatore && !hp) return toast("un giocatore deve avere dei punti ferita", "danger");
      if(nomeGiocatore && !tipo) return toast("un giocatore non ha tipo", "danger");

      for(let i = 0; i < ripetizioni; i++) {
        this.comb.addCombattente(nomeSquadra, bonusIniziativa,
          gradoSfida, nomeGiocatore, classeArmatura, hp, tipo);
      }

      // esegui posizionamento
      this.eseguiComando('start');
      return;
    }

    // POSIZIONAMENTO
    const posizionamentoMatch = 'start' === comando;
    if (posizionamentoMatch) {
      this.comb.posizionamento(this.mappa.mappa(), this.mappa.righe(), this.mappa.colonne());
      return;
    }
    
    // FERIRE O CURARE 
    // "id_personaggio -10" "id_personaggio +14"
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
      this.mappa.rimuoviSimbolo(idPersonaggio);
      return;
    }

    // SQUADRA ATTACCA AUTOMATICAMENTE
    // "turno idSquadra"
    // FIX: incude il turno di un personaggio
    const turnoMatch = comando.startsWith("turno ");
    if (turnoMatch) {
      const idSquadra = comando.split(" ")[1];
      if(!idSquadra) return toast("ID squadra non valido", "danger");

      console.log(`\n\nTurno squadra '${idSquadra}'`);
      const {membri, avversari} =this.comb.getMembriSquadra(idSquadra)
      for(const membro of membri) {
        const nemicoScelto = this.comb.scegliNemico(membro, avversari, this.mappa.mappa());
        if(!nemicoScelto){ 
          console.error(membro.id, "non trova nemico");
          continue;
        }
        
        let sonoPortata = false;
        let i =6
        let haAttaccato = false;
        const interval = setInterval(() => {
          sonoPortata = this.comb.sonoPortata(membro, nemicoScelto, this.mappa.mappa());
          if(!sonoPortata) this.comb.movimento(membro, nemicoScelto, this.mappa.mappa);
          else {
            this.comb.tiraPerColpire(membro, nemicoScelto);
            haAttaccato = true;
          }
          // gestione intervallo
          i--;
          if(i <= 0 || haAttaccato) clearInterval(interval);
        }, 500);
      }
      
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



