import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toast } from '../../tools/feedbacksUI';
import { CombattimentoService } from './combattimento.service';
import { MappaService } from './mappa.service';
import { CellComponent } from './cell.component';
import { DiceService } from './dice.service';
import { statisticheGradoSfida } from './gradiSfida';
import { FormField } from '../login/validation';

@Component({
  selector: 'app-mappe',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './mappe.component.html',
})
export class MappeComponent {
  constructor(
    public combatService: CombattimentoService,
    public mappaService: MappaService,
    public diceService: DiceService,
  ) {
    document.title = "Mappe";
    this.form_reset()
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
      toast.danger('Prompt vuoto');
      return;
    }

    const comandi = value.split('>').map(cmd => cmd.trim()).filter(cmd => cmd);

    for (const comando of comandi) {
      this.eseguiComando(comando, input);
    }
  }

  // CONFIGURAZIONE CENTRALIZZATA COMANDI
  // Unifica logica di esecuzione e suggerimenti UI
  readonly CONFIG_COMANDI: {
    section: 'Mappe' | 'Simboli' | 'Dadi' | 'Combattimento';
    description: string;
    label: string;
    show: (s: string) => boolean;
    pattern: (s: string) => boolean;
    execute: (comando: string) => void;
  }[] = [
    // --- MAPPE ---
    {
      section: 'Mappe',
      description: 'Genera una mappa delle dimensioni indicate',
      label: '"9x9", "12x6", "26x14"',
      pattern: (s: string) => /^(\d+)x(\d+)$/i.test(s),
      show: (s: string) => !isNaN(parseInt(s[0])),
      execute: (comando: string) => {
        const match = comando.match(/^(\d+)x(\d+)$/i);
        if (match) this.mappaService.mappa_create(parseInt(match[1], 10), parseInt(match[2], 10));
      // Posizionamento automatico sulla mappa
      this.combatService.posizionamento(
        this.mappaService.mappa_value(), 
        this.mappaService.mappa_righe().length, 
        this.mappaService.mappa_colonne().length
      );
      }
    },
    {
      section: 'Mappe',
      description: 'Rimuove personaggi e mappa correnti',
      label: '"reset"',
      pattern: (s: string) => /^reset$/i.test(s),
      show: (s: string) => "reset ".includes(s.toLowerCase()) || s.toLowerCase().startsWith('reset'),
      execute: () => {
        this.combatService.combattenti.set([]);
        this.mappaService.mappa_value.set({});
      }
    },
    {
      section: 'Mappe',
      description: 'Gestione salvataggi (carica, salva, elimina)',
      label: '"mappa demo", "mappa salva bosco", "mappa elimina vecchio"',
      pattern: (s: string) => /^mappa /i.test(s),
      show: (s: string) => s.toLowerCase().startsWith('m'),
      execute: (comando: string) => {
        const match_elimina = comando.match(/^mappa elimina (.+)$/i);
        const match_salva = comando.match(/^mappa salva (.+)$/i);
        const match_carica = comando.match(/^mappa (.+)$/i);
        
        if (match_elimina) this.mappaService.storage_removeMap(match_elimina[1].trim());
        else if (match_salva) this.mappaService.storage_addMap(match_salva[1].trim());
        else if (match_carica) this.mappaService.mappa_syncStorage(match_carica[1].trim());
      }
    },
    // --- SIMBOLI ---
    {
      section: 'Simboli',
      description: 'Aggiunge un simbolo o sposta un personaggio',
      label: '"- in b4", "aldo in c6", "~ in a3"',
      pattern: (s: string) => /^(.+) in ([a-zA-Z])\s*(\d+)$/i.test(s),
      show: (s: string) => ['-', '+', '*', '#', '@', '|', '~'].includes(s[0]) || (s.length > 2 && s.includes(' in')),
      execute: (comando: string) => {
        const match = comando.match(/^(.+) in ([a-zA-Z])\s*(\d+)$/i);
        if (match) this.mappaService.mappa_setCell(match[2].toUpperCase(), parseInt(match[3], 10) - 1, match[1].trim());
      }
    },
    // --- DADI ---
    {
      section: 'Dadi',
      description: 'Tira i dadi (es. 2d6+2)',
      label: '"d100", "2d4+2", "d20-1", "d20 x3"',
      pattern: (s: string) => /^(\d*)d(\d+)([+-]\d*)?\s*x?\s*(\d*)$/i.test(s),
      show: (s: string) => s[0] === 'd' || (!isNaN(parseInt(s[0])) && s.toLowerCase().includes('d')),
      execute: (comando: string) => {
        const match = comando.match(/^(\d*)d(\d+)([+-]\d*)?\s*x?\s*(\d*)$/i);
        if (match) {
          const qta = match[1] ? parseInt(match[1], 10) : 1;
          const ripetizioni = match[4] ? parseInt(match[4], 10) : 1;
          for (let i = 0; i < ripetizioni; i++) {
            this.diceService.setTiri(qta, parseInt(match[2], 10), match[3] ? parseInt(match[3], 10) : 0);
          }
        }
      }
    },
    // --- COMBATTIMENTO ---
    {
      section: 'Combattimento',
      description: 'Aggiunge NPC o Giocatori alla squadra',
      label: '"a gs1/2", "b Mario ca15 hp25 +2"',
      pattern: (s: string) => s.includes('gs') || (s.includes('ca') && s.includes('hp')),
      show: (s: string) => s.includes('gs') || s.includes('ca') || s.includes('hp'),
      execute: (comando: string) => {
        if (comando.includes('gs')) this.eseguiCreazioneNPC(comando);
        else this.eseguiCreazioneGiocatore(comando);
      }
    },
    {
      section: 'Combattimento',
      description: 'Azioni dirette (attacca, ferisci, turno, rimuovi)',
      label: '"mario -5", "kaki attacca mario", "turno a", "rimuovi kaki"',
      pattern: (s: string) => /^(\S+) ([+-]\d+)$/.test(s) || s.includes(' attacca ') || s.startsWith('turno ') || s.startsWith('rimuovi '),
      show: (s: string) => s.includes(' ') || s.startsWith('turno') || s.startsWith('rimuovi'),
      execute: (comando: string) => {
        if (comando.includes(' attacca ')) this.eseguiAttacco(comando);
        else if (comando.startsWith('turno ')) this.eseguiTurno(comando);
        else if (comando.startsWith('rimuovi ')) this.combatService.rimuoviCombattente(comando.split(' ')[1]);
        else {
          const parts = comando.split(' ');
          this.combatService.vitalitaPersonaggio(parts[0], Number(parts[1]));
        }
      }
    },
    {
      section: 'Combattimento',
      description: 'Posiziona i combattenti (start)',
      label: '"start"',
      pattern: (s: string) => s.toLowerCase() === 'start',
      show: (s: string) => "start".startsWith(s.toLowerCase()),
      execute: () => this.combatService.posizionamento(this.mappaService.mappa_value(), this.mappaService.mappa_righe().length, this.mappaService.mappa_colonne().length)
    }
  ];

  // Esegui il comando corrispondente
  eseguiComando(comando: string, input?: HTMLInputElement): void {
    const config = this.CONFIG_COMANDI.find(c => c.pattern(comando));
    
    if (config) {
      config.execute(comando);
      if (input) input.value = '';
      this.prompt_consiglio = [];
    } else {
      toast.danger(`Comando "${comando}" non riconosciuto`);
    }
  }

  // GESTIONE CONSIGLI PROMPT
  prompt_consiglio: { esempio: string[], descrizione: string }[] = [];

  prompt_setConsiglio(e: Event | string) {
    const value = (typeof e === 'string' ? e : (e.target as HTMLInputElement).value).trim();
    if (!value) {
      this.prompt_consiglio = [];
      return;
    }

    this.prompt_consiglio = this.CONFIG_COMANDI
      .filter(c => c.show(value))
      .slice(0, 3)
      .map(c => ({
        esempio: c.label.split('"'),
        descrizione: c.description
      }));
  }

  get prompt_sezioni(): string[] {
    return [...new Set(this.CONFIG_COMANDI.map(c => c.section))];
  }

  prompt_getBySection(section: string) {
    return this.CONFIG_COMANDI.filter(c => c.section === section);
  }

  // METODI DI SUPPORTO PRIVATI (Estratti per pulizia)
  private eseguiCreazioneNPC(comando: string) {
    const prompt = comando.split(" ");
    const nomeSquadra = prompt[0].trim();
    const gradoSfida = prompt.find(s => s.startsWith("gs"))?.replace("gs", "") || "1";
    let ripetizioni = Number(prompt.find(s => s.startsWith("x"))?.replace("x", "")) || 1;
    const tipo = prompt.includes("distanza") ? "distanza" : "mischia";

    for (let i = 0; i < ripetizioni; i++) {
      this.combatService.addCombattente(nomeSquadra, 0, gradoSfida, '', 0, 0, tipo);
    }
    this.combatService.posizionamento(this.mappaService.mappa_value(), this.mappaService.mappa_righe().length, this.mappaService.mappa_colonne().length);
  }

  private eseguiCreazioneGiocatore(comando: string) {
    const prompt = comando.split(' ');
    const nomeSquadra = prompt[0].trim();
    
    // Il nome giocatore è la prima parola dopo la squadra che non sia una parola chiave (ca, hp, mischia, distanza)
    let nomeGiocatore = prompt.find((p, i) => i > 0 && !p.startsWith('ca') && !p.startsWith('hp') && !['mischia', 'distanza'].includes(p)) || 'Eroe';
    nomeGiocatore = nomeGiocatore.charAt(0).toUpperCase() + nomeGiocatore.slice(1);
    
    const ca = Number(prompt.find(p => p.startsWith('ca'))?.replace('ca', '')) || 10;
    const hp = Number(prompt.find(p => p.startsWith('hp'))?.replace('hp', '')) || 10;
    const tipo = prompt.includes("distanza") ? "distanza" : "mischia";
    const iniziativa = Number(prompt.find(p => /^[+-]\d+$/.test(p))) || 0;

    this.combatService.addCombattente(nomeSquadra, iniziativa, "", nomeGiocatore, ca, hp, tipo);
    this.combatService.posizionamento(this.mappaService.mappa_value(), this.mappaService.mappa_righe().length, this.mappaService.mappa_colonne().length);
  }

  private eseguiAttacco(comando: string) {
    const parts = comando.toLowerCase().split(' attacca ');
    const idAttaccante = parts[0].trim();
    const idAttaccato = parts[1].trim();
    const combattenti = this.combatService.combattenti();
    const attaccante = combattenti.find(c => c.id.toLowerCase() === idAttaccante);
    const attaccato = combattenti.find(c => c.id.toLowerCase() === idAttaccato);
    
    if (attaccante && attaccato) this.combatService.tiraPerColpire(attaccante, attaccato);
    else toast.danger("Contendenti non trovati");
  }

  private eseguiTurno(comando: string) {
    const id = comando.replace('turno ', '').trim();
    const combattenti = this.combatService.combattenti();
    const personaggio = combattenti.find(c => c.id.toLowerCase() === id.toLowerCase());

    if (personaggio) {
      this.avviaTurnoPersonaggio(personaggio);
    } else {
      const { membri, avversari } = this.combatService.getMembriSquadra(id);
      if (membri.length > 0) membri.forEach(m => this.avviaTurnoPersonaggio(m, avversari));
      else toast.danger(`Squadra o personaggio "${id}" non trovato`);
    }
  }

  private avviaTurnoPersonaggio(p: any, avversari?: any[]) {
    const targets = avversari || this.combatService.combattenti().filter(c => c.squadra !== p.squadra);
    const nemico = this.combatService.scegliNemico(p, targets, this.mappaService.mappa_value());
    if (!nemico) return;

    let haAttaccato = false;
    let passi = 6;
    const interval = setInterval(() => {
      if (this.combatService.sonoPortata(p, nemico, this.mappaService.mappa_value())) {
        this.combatService.tiraPerColpire(p, nemico);
        haAttaccato = true;
      } else {
        this.combatService.movimento(p, nemico, this.mappaService.mappa_value);
      }
      passi--;
      if (passi <= 0 || haAttaccato) {
        clearInterval(interval);
        this.combatService.giocatoreUltimoTurno = p.id;
      }
    }, 500);
  }


  // FORM INSERIMENTO COMBATTENTI
  gs = statisticheGradoSfida
  form :FormField[] =[]
  form_reset(){
    this.form = [
      {
        type: 'select',
        key: 'gs',
        label: 'Grado sfida (solo npc)',
        value: '',
        options: this.gs.map(gs => ({ value: gs.gradoSfida, label: gs.gradoSfida }))
      },
      {
        type: 'text',
        key: 'nome',
        label: 'Nome',
        value: '',
        placeholder:'es: Eduard, Saruman, Optimus'
      },
      {
        type: 'number',
        key: 'iniziativa',
        label: 'Iniziativa',
        value: '',
        placeholder:'es: 3, -1, 2'
      },
      {
        type: 'number',
        key: 'ca',
        label: 'Classe armatura (solo pg)',
        value: '',
        placeholder:'es: 10, 15, 20'
      },
      {
        type: 'number',
        key: 'hp',
        label: 'Punti ferita (solo pg)',
        value: '',
        placeholder:'es: 10, 15, 20'
      },
      {
        type: 'radio',
        key: 'squadra',
        label: 'Squadra',
        value: 'a',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]
      },
      {
        type: 'radio',
        key: 'tipo',
        label: 'Tipo',
        value: 'mischia',
        options: [
          { value: 'mischia', label: 'Mischia' },
          { value: 'distanza', label: 'A distanza' }
        ]
      },
    ]
  }

  handleChange(e:Event){
    // recupera e sanifica il valore cambiato
    const {type, value, name} = e.target as HTMLInputElement;
    let newValue = type === 'number' ? Number(value) : value;
    const field = this.form.find(f => f.key === name);
    if(!field) return console.error("Campo non trovato");
    
    // assegna al form
    if(name=='nome') newValue = value.charAt(0).toUpperCase() + value.slice(1);
    field.value = newValue;
  }
  
  handleSubmit(e: Event) {
    e.preventDefault();

    // Mappa i valori del form in un oggetto comodo
    const nc: { [k: string]: any } = {};
    for (const field of this.form) {
      nc[field.key] = field.value;
    }

    const { squadra, gs, nome, ca, hp, iniziativa, tipo } = nc;

    // 1. BLOCCO: Un NPC (GS) non può avere statistiche fisse da Giocatore (CA/HP)
    if (gs && (ca || hp)) {
      return toast.danger("Un NPC (GS) non può avere CA o HP personalizzati");
    }

    // 2. VALIDAZIONE COMBINAZIONI MINIME
    const isNPCValido = squadra && gs;
    const isPGValido = squadra && nome && ca && hp;

    if (!isNPCValido && !isPGValido) {
      return toast.danger("Dati incompleti: inserisci (Squadra + GS) o (Squadra + Nome + CA + HP)");
    }

    // 3. ESECUZIONE
    this.combatService.addCombattente(
      squadra,
      iniziativa || 0,
      isNPCValido ? gs : "",
      nome || "",
      isPGValido ? ca : 0,
      isPGValido ? hp : 0,
      tipo
    );

    // Posizionamento automatico sulla mappa
    this.combatService.posizionamento(
      this.mappaService.mappa_value(), 
      this.mappaService.mappa_righe().length, 
      this.mappaService.mappa_colonne().length
    );
  }

}
