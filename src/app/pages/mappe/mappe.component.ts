import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toast } from '../../tools/feedbacksUI';
import { CombattimentoService } from './combattimento.service';
import { MappaService } from './mappa.service';
import { CellComponent } from './cell.component';
import { DiceService } from './dice.service';

@Component({
  selector: 'app-mappe',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './mappe.component.html',
})
export class MappeComponent {
  constructor(
    public comb: CombattimentoService,
    public mappa: MappaService,
    public dice: DiceService,
  ) {
    document.title = "Mappe";
  }

  // Gestisce l'input del prompt principale
  handlePrompt(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('promptInput') as HTMLInputElement;
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
  comandi: { [k: string]: { pattern: (s: string) => boolean, execute: (comando: string) => void, example:string }} = {
    tiro_dadi: {
      example:`d100 | 7d3 | 2d4+5 | 2d6x3`,
      pattern: (s: string) => /^(\d*)d(\d+)([+-]\d*)?x?(\d*)$/i.test(s),
      execute: (comando: string) => {
        const match_tiro_dadi = comando.match(/^(\d*)d(\d+)([+-]\d*)?x?(\d*)$/i);
        if (match_tiro_dadi) {
          const qta = match_tiro_dadi[1] ? parseInt(match_tiro_dadi[1], 10) : 1;
          const max = parseInt(match_tiro_dadi[2], 10);
          const modifier = match_tiro_dadi[3] ? parseInt(match_tiro_dadi[3], 10) : 0;
          const ripetizioni = match_tiro_dadi[4] ? parseInt(match_tiro_dadi[4], 10) : 1;
          for (let i = 0; i < ripetizioni; i++) {
            this.dice.setTiri(qta, max, modifier);
          }
        }
      }
    },
    creazione_griglia: {
      example:`10x10 | 6x12`,
      pattern: (s: string) => /^(\d+)x(\d+)$/i.test(s),
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
      example:`mappa salva nome_mappa | mappa elimina nome_mappa | mappa nome_mappa`,
      pattern: (s: string) => /^mappa /i.test(s),
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
      example:`- in a1 | + in b2 | demo in b4 | carlo in d6`,
      pattern: (s: string) => /^(.+) in ([a-zA-Z])\s*(\d+)$/i.test(s),
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
    creazione_npc: {
      example: `a: gs1 > a: gs1/8 > b: gs1 mischia > a: gs1 x3 > b: gs2 x2 distanza`,
      pattern: (comando: string): boolean => {
        // return /^[a-zA-Z]:\s*gs\d+(?:\/\d+)?(?:\s+(?:x\d+)?(?:\s+(?:distanza|mischia))?)?$/i.test(comando);
        const minimale = comando.includes(":") && comando.includes("gs");
        return minimale;
      },
      execute: (comando: string) => {   
        const prompt = comando.split(" ");
        const nomeSquadra = prompt[0].replace(":", "").trim();
        if(!nomeSquadra) return toast("Nome non trovato", "danger");

        const gradoSfida = prompt.find(s=> s.startsWith("gs"))?.replace("gs", "");
        if (!gradoSfida) return toast("Formato grado sfida non valido", "danger");

        let ripetizioni :number = Number(prompt.find(s=> s.startsWith("x"))?.replace("x", ""));
        if (isNaN(ripetizioni)) ripetizioni = 1;

        let tipo: "mischia" | "distanza" = "mischia";
        if (prompt.includes("distanza")) tipo = "distanza";

        for (let i = 0; i < ripetizioni; i++) {
          this.comb.addCombattente(nomeSquadra, 0, gradoSfida, '', 0, 0, tipo)
        }

        // comando start
        this.comb.posizionamento(this.mappa.mappa(), this.mappa.righe(), this.mappa.colonne());
      }
    },
    creazione_giocatori: {
      example: `c: carlo ca10 hp9 | a: mario ca10 hp20 mischia | b: luigi ca5 hp15 distanza`,
      pattern: (comando: string): boolean => {
        const minimale = comando.includes(":") && comando.includes("ca") && comando.includes("hp");
        return minimale;
      },
      execute: (comando: string) => {
        const pattern_ca = /^ca\d{1,2}$/;
        const pattern_hp = /^hp\d{1,3}$/;
        const prompt = comando.split(' ');
        // SQUADRA
        const nomeSquadra = prompt[0].replace(":", "").trim();
        if(!nomeSquadra) return toast("Nome squadra non valido", "danger");

        // GIOCATORE
        let nomeGiocatore :string = prompt.find(p => 
          ![':', 'distanza', 'mischia'].some(kw => p.includes(kw))
          && !pattern_ca.test(p)
          && !pattern_hp.test(p)
        ) || '';
        if (nomeGiocatore) nomeGiocatore = nomeGiocatore.charAt(0).toUpperCase() + nomeGiocatore.slice(1);
        if (!nomeGiocatore) return toast("Nome giocatore mancante", "danger");

        // CLASSE ARMATURA
        const caMatch = prompt.find(p => pattern_ca.test(p))?.replace('ca', '') || ''; // 2 lettere, una o due numeri
        const classeArmatura = isNaN(Number(caMatch)) ? 0 : Number(caMatch);
        if (!classeArmatura) return toast("Classe armatura mancante", "danger");
        
        // PUNTI FERITA
        const hpMatch = prompt.find(p => pattern_hp.test(p))?.replace('hp', '') || ''; // 2 lettere; uno, due o tre numeri
        const hp = isNaN(Number(hpMatch)) ? 0 : Number(hpMatch);
        if (!hp) return toast("Punti ferita mancanti", "danger");
        
        // TIPO
        let tipo: "mischia" | "distanza" = "mischia";
        if (prompt.includes("distanza")) tipo = "distanza";

        // INZIATIVA
        const iniziativa = prompt.find(p => /[-+]\d/i.test(p))?.replace("iniziativa", "") || '';
        const bonusIniziativa = isNaN(Number(iniziativa)) ? 0 : Number(iniziativa);
        
        // console.log({nomeSquadra, bonusIniziativa, nomeGiocatore, classeArmatura, hp, tipo});
        this.comb.addCombattente(nomeSquadra, bonusIniziativa, "", nomeGiocatore, classeArmatura, hp, tipo);
        this.comb.posizionamento(this.mappa.mappa(), this.mappa.righe(), this.mappa.colonne());
      }
    },
    posizionamento: {
      example: 'start',
      pattern: (s: string) => s==="start",
      execute: () => {
        this.comb.posizionamento(this.mappa.mappa(), this.mappa.righe(), this.mappa.colonne());
      }
    },
    ferire_o_curare: {
      example: 'mario +5 | kaki -3',
      pattern: (s: string) => /^(\S+) ([+-]\d+)$/.test(s),
      execute: (comando: string) => {
        const parts = comando.split(' ');
        if (parts.length === 2 && (parts[1].includes('-') || parts[1].includes('+'))) {
          const [combattenteId, quantita] = parts;
          this.comb.vitalitaPersonaggio(combattenteId, Number(quantita));
        }
      }
    },
    npc_attacca_manualmente: {
      example: 'kaki attacca mario',
      pattern: (s: string) => /^(\S+) attacca (\S+)$/i.test(s),
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
      example: 'rimuovi mario',
      pattern: (s: string) => /^rimuovi (\S+)$/i.test(s),
      execute: (comando: string) => {
        const idPersonaggio = comando.split(" ")[1];
        if (!idPersonaggio) {
          toast("ID personaggio non valido", "danger");
          return;
        }
        this.comb.rimuoviCombattente(idPersonaggio);
      }
    },
    turno: {
      example: 'turno mario | turno a',
      pattern: (s: string) => /^turno (\S+)$/i.test(s),
      execute: (comando: string) => {
        const parts = comando.split(" ");
        if (parts.length < 2) {
          toast("Comando non valido", "danger");
          return;
        }

        const id = parts[1];
        const combattenti = this.comb.combattenti();

        const personaggio = combattenti.find(c => c.id.toLowerCase() === id.toLowerCase());
        if (personaggio) {
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
          this.comb.giocatoreUltimoTurno = personaggio.id;
          return;
        }

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
      example: 'reset',
      pattern: (s: string) => /^reset$/i.test(s),
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
    for (const [, cmd] of Object.entries(this.comandi)) {
      if (cmd.pattern(comando)) { 
        cmd.execute(comando); // esegue comando

        comandoTrovato = true; // comando trovato
        if (input) input.value = ''; // cancella input.valore
        this.consigli_prompt =[]; // pulisci consigli
        break;
      }
    }

    if (!comandoTrovato) {
      toast(`Comando "${comando}" non riconosciuto`, 'danger');
    }
  }

  // consiglio prompt
  consigli_prompt : {esempio:string[], descrizione:string}[] = [];
  // condizioni dalla più specifica alla più generica
  esempi_prompt :{show:(s:string)=> boolean, label:string, description:string, section:string}[] = [
    { show:(s:string)=> !isNaN(parseInt(s[0])),
      label:`"9x9", "12x6", "26x14"`,
      description:'Genera una mappa delle dimensioni indicate',
      section: 'Mappe',
    },
    { show:(s:string)=> "reset ".includes(s) || s.startsWith('reset'),
      label:`"reset"`,
      description:'Rimuove personaggi e mappa correnti',
      section: 'Mappe',
    },
    { show:(s:string)=> s.startsWith('m'),
      label:`"mappa demo", "mappa cimitero", "mappa bosco"`,
      description:'Carica la mappa specificata',
      section: 'Mappe',
    },
    { show:(s:string)=> s.startsWith('mappa'),
      label:`"mappa salva demo", "mappa salva bosco"`,
      description:'Salva la mappa corrente',
      section: 'Mappe',
    },
    { show:(s:string)=> s.startsWith('mappa'),
      label:`"mappa rimuovi demo", "mappa rimuovi cimitero"`,
      description:'Rimuove la mappa specificata',
      section: 'Mappe',
    },
    // SIMBOLI
    { show:(s:string)=> ['-', '+', '*', '#', '@', '|', '~'].includes(s[0]),
      label:`"- in b4 ", "+ in a3", "~ in c5"`,
      description:'Aggiunge il simbolo nella cella specificata',
      section: 'Simboli',
    },
    { show:(s:string)=> s[0]!=' ' && s.includes(' i'),
      label:`"aldo in c6", "mario in a3", "luigi in b4"`,
      description:'SPOSTA un personaggio nella cella specificata',
      section: 'Simboli',
    },
    // DADI
    { show:(s:string)=> s[0]=='d' || (!isNaN(parseInt(s[0])) && s[1] === 'd'),
      label:`"d100", "2d4+2", "d20-1", "3d7-3"`,  
      description:'tira tutti i dadi, con numero fi cacce specificato e aggiunge un bonus',
      section: 'Dadi',
    },
    // COMBATTIMENTO
    { show:(s:string)=> s.includes(': '),
      label:`"a: gs1/2", "b: gs1/4 x3", "c: gs1 x5 distanza"`,
      description:'Aggiunge tanti npc del gf specificato (a distanza o mischia) alla squadra selezionata ',
      section: 'Combattimento',
    },
    { 
      show:(s:string)=> s.includes(': '),
      label:`"a: Aldo ca12 hp20 +3", "b: Mario ca15 hp25 +2"`,
      description:'Aggiunge o sostituisce il pg ad una squadra con CA, HP e iniziativa specificata',
      section: 'Combattimento',
    },
    { 
      show:(s:string)=> s.includes(" +") || s.includes(" -"),
      label:`"aldo -20", "mario +10"`,
      description:'Sottrae o aggiunge hp al personaggio specificato',
      section: 'Combattimento',
    },
    { 
      show:(s:string)=> s.includes(' a'),
      label:`"mario attacca carlo", "kaki attacca ciano"`,
      description:'L\'npc attacca il personaggio specificato (solo per npc)',
      section: 'Combattimento',
    },
    { 
      show:(s:string)=> s.length>2 && "turno ".includes(s),
      label:`"turno kaki", "turno a"`,
      description:'Gli npc di una squadra, o un solo npc, attaccano gli avversari',
      section: 'Combattimento',
    },
    { 
      show:(s:string)=> "rimuovi ".includes(s) || s.startsWith("rimuovi "),
      label:`"rimuovi kaki", "rimuovi a"`,
      description:'Rimuove il personaggio specificato',
      section: 'Combattimento',
    },
  ] as const;
  
  consiglio_setPrompt(e:Event | string) {
    let value = typeof e === 'string' ? e.trim() 
                : (e.target as HTMLInputElement).value.trim();
    // nessun valore
    if(value===''){
      this.consigli_prompt = [];
      return;
    }
    // cerca l'esempio corrispondente
    this.consigli_prompt = [];
    for (let i = 0; i < this.esempi_prompt.length; i++) {
      const element = this.esempi_prompt[i];
      if(this.consigli_prompt.length>2) break;
      if (element.show(value)) {
        this.consigli_prompt.push({
          esempio: element.label.split('"'), 
          descrizione: element.description
        });
      }
    }
  }

  esempi_sezioni :string[] =this.esempi_prompt.map(e => e.section)
    .filter((value, index, self) => self.indexOf(value) === index);
  esempi_getBySection(section:string) {
    return this.esempi_prompt.filter(e => e.section === section);
  }


}
