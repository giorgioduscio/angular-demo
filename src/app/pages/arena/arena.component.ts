import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toast } from '../../tools/feedbacksUI';
import { CombatService } from './combat.service';
import { MappaService, Preset } from './mappa.service';
import { Combattente, FightersService } from './fighters.service';
import { DiceService } from './dice.service';
import { statisticheGradoSfida } from './gradiSfida';
import { FormField } from '../login/validation';
import { CellComponent } from './cell.component';

@Component({
  selector: 'app-arena',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './arena.component.html',
})
export class ArenaComponent {
  constructor(
    public combatService: CombatService,
    public fightersService: FightersService,
    public mappaService: MappaService,
    public diceService: DiceService,
  ) {
    document.title = "Arena";
    this.form_reset()
  }

  // Gestisce l'input del prompt principale
  prompt_submit(e: Event): void {
    e.preventDefault();
    const form_value = e.target as HTMLFormElement;
    const input = form_value.elements.namedItem('promptInput') as HTMLInputElement;
    if (!input) {
      console.error("Input non trovato");
      return;
    }

    const value: string = input.value.trim();
    if (!value) {
      toast.danger('Prompt vuoto');
      return;
    }

    const comandi = value.split(',').map(cmd => cmd.trim()).filter(cmd => cmd);
    for (const comando of comandi) {
      this.eseguiComando(comando, input);
    }
  }

  // CONFIGURAZIONE CENTRALIZZATA COMANDI
  // Unifica logica di esecuzione e suggerimenti UI
  readonly CONFIG_COMANDI = [
    // --- MAPPE ---
    {
      section: 'Mappe',
      name: 'Dimensioni',
      description: 'Genera una mappa delle dimensioni indicate',
      label: '"9x9", "12x6", "26x14"',
      pattern: (s: string) => /^(\d+)x(\d+)$/i.test(s),
      showSuggestion: (s: string) => !isNaN(parseInt(s[0])),
      execute: (comando: string) => {
        const match = comando.match(/^(\d+)x(\d+)$/i);
        if (match) this.mappaService.mappa_create(parseInt(match[1], 10), parseInt(match[2], 10));
        // Posizionamento automatico sulla mappa
        if(this.fightersService.combattenti().length) 
          this.combatService.posizionamento();
      }
    },
    {
      section: 'Mappe',
      name: 'Reset',
      description: 'Rimuove personaggi e mappa correnti',
      label: '"reset"',
      pattern: (s: string) => /^reset$/i.test(s),
      showSuggestion: (s: string) => "reset ".includes(s.toLowerCase()) || s.toLowerCase().startsWith('reset'),
      execute: () => {
        this.fightersService.combattenti.set([]);
        this.mappaService.mappa_reset();
      }
    },
    {
      section: 'Mappe',
      name: 'Carica Mappa',
      description: 'Carica una mappa salvata',
      label: '"mappa demo", "mappa bosco"',
      pattern: (s: string) => /^mappa (?!salva|elimina)(.+)$/i.test(s),
      showSuggestion: (s: string) => s.toLowerCase().startsWith('mappa') && !s.toLowerCase().includes('salva') && !s.toLowerCase().includes('elimina'),
      execute: async (comando: string) => {
        const match = comando.match(/^mappa (.+)$/i);
        if (match) {
          await this.mappaService.mappa_syncStorage(match[1].trim());
          // Posizionamento automatico dopo il caricamento della mappa salvata
          if (this.fightersService.combattenti().length > 0) {
            this.combatService.posizionamento();
          }
        }
      }
    },
    {
      section: 'Mappe',
      name: 'Salva Mappa',
      description: 'Salva la mappa corrente',
      label: '"mappa salva bosco"',
      pattern: (s: string) => /^mappa salva (.+)$/i.test(s),
      showSuggestion: (s: string) => s.toLowerCase().startsWith('mappa salva') || "mappa salva".startsWith(s.toLowerCase()),
      execute: async (comando: string) => {
        const match = comando.match(/^mappa salva (.+)$/i);
        if (match) await this.mappaService.storage_addMap(match[1].trim());
      }
    },
    {
      section: 'Mappe',
      name: 'Elimina Mappa',
      description: 'Elimina una mappa salvata',
      label: '"mappa elimina vecchio"',
      pattern: (s: string) => /^mappa elimina (.+)$/i.test(s),
      showSuggestion: (s: string) => s.toLowerCase().startsWith('mappa elimina') || "mappa elimina".startsWith(s.toLowerCase()),
      execute: async (comando: string) => {
        const match = comando.match(/^mappa elimina (.+)$/i);
        if (match) await this.mappaService.storage_removeMap(match[1].trim());
      }
    },
    // --- SIMBOLI ---
    {
      section: 'Simboli',
      name: 'Pulisci',
      description: 'pulisce la cella indicata',
      label: '"clear b4", "clear c6"',
      pattern: (s: string) => /^clear ([a-zA-Z])\s*(\d+)$/i.test(s),
      showSuggestion: (s: string) => "clear".startsWith(s),
      execute: (comando: string) => {
        const match = comando.match(/^clear ([a-zA-Z])\s*(\d+)$/i);
        if(!match) return console.error("match non trovato");
        
        const riga =match[1];
        const colonna = parseInt(match[2], 10) - 1
        this.mappaService.mappa_setCell(riga, colonna, "")
      }
    },
    {
      section: 'Simboli',
      name: 'Aggiungi Simbolo',
      description: 'Inserisce un simbolo grafico (- + * # @ | ~)',
      label: '"+ in a3", "# in b4"',
      pattern: (s: string) => /^([-+*#@|~]) in ([a-zA-Z])\s*(\d+)$/i.test(s),
      showSuggestion: (s: string) => ['-', '+', '*', '#', '@', '|', '~'].includes(s[0]),
      execute: (comando: string) => {
        const match = comando.match(/^(.+) in ([a-zA-Z])\s*(\d+)$/i);
        if (match) this.mappaService.mappa_setCell(match[2], parseInt(match[3], 10) - 1, match[1].trim());
      }
    },
    {
      section: 'Simboli',
      name: 'Sposta Personaggio',
      description: 'Sposta un personaggio o inserisce un nome',
      label: '"aldo in c6", "Eroe in d2"',
      pattern: (s: string) => /^((?![-+*#@|~]).+) in ([a-zA-Z])\s*(\d+)$/i.test(s),
      showSuggestion: (s: string) => s.length > 2 && s.includes(' in'),
      execute: (comando: string) => {
        const match = comando.match(/^(.+) in ([a-zA-Z])\s*(\d+)$/i);
        if (match) this.mappaService.mappa_setCell(match[2], parseInt(match[3], 10) - 1, match[1].trim());
      }
    },
    // --- DADI ---
    {
      section: 'Dadi',
      name: 'Tiro dadi',
      description: 'Tira i dadi (es. 2d6+2)',
      label: '"d100", "2d4+2", "d20-1"',
      pattern: (s: string) => /^(\d*)d(\d+)([+-]\d*)?$/i.test(s),
      showSuggestion: (s: string) => (s[0] === 'd' || (!isNaN(parseInt(s[0])) && s.toLowerCase().includes('d'))) && !s.toLowerCase().includes('x'),
      execute: (comando: string) => {
        const match = comando.match(/^(\d*)d(\d+)([+-]\d*)?$/i);
        if (match) {
          const qta = match[1] ? parseInt(match[1], 10) : 1;
          this.diceService.setTiri(qta, parseInt(match[2], 10), match[3] ? parseInt(match[3], 10) : 0);
        }
      }
    },
    {
      section: 'Dadi',
      name: 'Tiro ripetuto',
      description: 'Esegue più tiri dello stesso dado',
      label: '"d20 x3", "2d6+2 x5"',
      pattern: (s: string) => /^(\d*)d(\d+)([+-]\d*)?\s*x\s*(\d+)$/i.test(s),
      showSuggestion: (s: string) => s.toLowerCase().includes('x') && s.toLowerCase().includes('d'),
      execute: (comando: string) => {
        const match = comando.match(/^(\d*)d(\d+)([+-]\d*)?\s*x\s*(\d+)$/i);
        if (match) {
          const qta = match[1] ? parseInt(match[1], 10) : 1;
          const ripetizioni = parseInt(match[4], 10);
          for (let i = 0; i < ripetizioni; i++) {
            this.diceService.setTiri(qta, parseInt(match[2], 10), match[3] ? parseInt(match[3], 10) : 0);
          }
        }
      }
    },
    // --- COMBATTIMENTO ---
    {
      section: 'Combattimento',
      name: 'Aggiungi NPC',
      description: 'Aggiunge NPC alla squadra tramite grado sfida',
      label: '"a gs1/2", "b gs1 x3 distanza"',
      pattern: (s: string) => s.includes('gs'),
      showSuggestion: (s: string) => s.includes('gs'),
      execute: (comando: string) => {
        const squadre = [...new Set(this.fightersService.combattenti().map(c => c.squadra))];
        if (squadre.length >= 4) return toast.danger("Limite squadre raggiunto");

        const prompt = comando.split(" ");
        const nomeSquadra = prompt[0].trim();
        const gradoSfida = prompt.find(s => /^gs/.test(s))?.replace("gs", "") || "1";
        const ripetizioni = Number(prompt.find(s => /^x\d+$/.test(s))?.replace("x", "")) || 1;
        const tipo = prompt.includes("distanza") ? "distanza" : "mischia";

        for (let i = 0; i < ripetizioni; i++) {
          this.fightersService.addCombattente(nomeSquadra, gradoSfida, '', 0, 0, 0, tipo);
        }
        if (this.mappaService.mappa_value()) this.combatService.posizionamento();
      }
    },
    {
      section: 'Combattimento',
      name: 'Aggiungi Giocatore',
      description: 'Aggiunge un personaggio giocante',
      label: '"b Mario ca15 hp25 +2"',
      pattern: (s: string) => s.includes('ca') && s.includes('hp'),
      showSuggestion: (s: string) => s.includes('ca') || s.includes('hp'),
      execute: (comando: string) => {
        const squadre = [...new Set(this.fightersService.combattenti().map(c => c.squadra))];
        if (squadre.length >= 4) return toast.danger("Limite squadre raggiunto");

        const prompt = comando.split(" ");
        const nomeSquadra = prompt[0].trim();
        let nomeGiocatore = prompt.find((p, i) => i > 0 && !/^ca\d+/.test(p) && !/^hp\d+/.test(p) && !/^[+-]\d+$/.test(p) && !['mischia', 'distanza'].includes(p)) || 'Eroe';
        nomeGiocatore = nomeGiocatore.charAt(0).toUpperCase() + nomeGiocatore.slice(1);

        const ca = Number(prompt.find(p => /^ca\d+/.test(p))?.replace('ca', '')) || 10;
        const hp = Number(prompt.find(p => /^hp\d+/.test(p))?.replace('hp', '')) || 10;
        const tipo = prompt.includes("distanza") ? "distanza" : "mischia";
        const iniziativa = Number(prompt.find(p => /^[+-]\d+$/.test(p))) || 0;

        this.fightersService.addCombattente(nomeSquadra, "", nomeGiocatore, ca, hp, iniziativa, tipo);
        if (this.mappaService.mappa_value()) this.combatService.posizionamento();
      }
    },
    {
      section: 'Combattimento',
      name: 'Attacco',
      description: 'Esegue un attacco tra due combattenti',
      label: '"kaki attacca mario"',
      pattern: (s: string) => s.toLowerCase().includes(' attacca '),
      showSuggestion: (s: string) => s.toLowerCase().includes(' attacca '),
      execute: (comando: string) => {
        const combattenti = this.fightersService.combattenti();
        if(!combattenti.length) return toast.danger("Nessun combattente presente");
        
        const [attaccanteId, attaccatoId] = comando.toLowerCase().split(' attacca ');
        const attaccante = combattenti.find(c => c.id.toLowerCase() === attaccanteId.trim());
        const attaccato = combattenti.find(c => c.id.toLowerCase() === attaccatoId.trim());

        if (!attaccante || !attaccato) return toast.danger("Contendenti non trovati");
        this.combatService.tiraPerColpire(attaccante, attaccato);
      }
    },
    {
      section: 'Combattimento',
      name: 'Turno',
      description: 'Avvia il turno di un personaggio o squadra',
      label: '"turno a", "turno mario"',
      pattern: (s: string) => s.toLowerCase().startsWith('turno '),
      showSuggestion: (s: string) => s.toLowerCase().startsWith('turno'),
      execute: (comando: string) => {
        const combattenti = this.fightersService.combattenti();
        if(!combattenti.length) return toast.danger("Nessun combattente presente");

        const id = comando.replace('turno ', '').trim();
        const personaggio = combattenti.find(c => c.id.toLowerCase() === id.toLowerCase());

        const avviaTurnoPersonaggio = (p: Combattente, avversari?: Combattente[]) => {
          const targets = avversari || combattenti.filter(c => c.squadra !== p.squadra);
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
              this.fightersService.giocatoreUltimoTurno = p.id;
            }
          }, 500);
        };

        if (personaggio) {
          avviaTurnoPersonaggio(personaggio);
        } else {
          const { membri, avversari } = this.combatService.getMembriSquadra(id);
          if (membri.length > 0) {
            membri.forEach(m => avviaTurnoPersonaggio(m, avversari));
          } else {
            toast.danger(`Squadra o personaggio "${id}" non trovato`);
          }
        }
      }
    },
    {
      section: 'Combattimento',
      name: 'Rimozione',
      description: 'Rimuove un combattente dall\'arena',
      label: '"rimuovi kaki"',
      pattern: (s: string) => s.toLowerCase().startsWith('rimuovi '),
      showSuggestion: (s: string) => s.toLowerCase().startsWith('rimuovi'),
      execute: (comando: string) => {
        const id = comando.split(' ')[1];
        this.fightersService.rimuoviCombattente(id);
      }
    },
    {
      section: 'Combattimento',
      name: 'Salute',
      description: 'Modifica i punti ferita (danno o cura)',
      label: '"mario -5", "mario +10"',
      pattern: (s: string) => /^(\S+) ([+-]\d+)$/.test(s),
      showSuggestion: (s: string) => s.includes(' -') || s.includes(' +'),
      execute: (comando: string) => {
        const [id, value] = comando.split(' ');
        this.fightersService.vitalitaPersonaggio(id, Number(value));
      }
    },
    {
      section: 'Combattimento',
      name: 'Inizia',
      description: 'Posiziona i combattenti (start)',
      label: '"start"',
      pattern: (s: string) => s.toLowerCase() === 'start',
      showSuggestion: (s: string) => "start".startsWith(s.toLowerCase()),
      execute: () => this.combatService.posizionamento()
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
      .filter(c => c.showSuggestion(value))
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



  // FORM INSERIMENTO COMBATTENTI
  form_value :FormField[] =[]
  form_reset(){
    const gsOptions = statisticheGradoSfida.map(gs => ({ value: gs.gradoSfida, label: "GS "+gs.gradoSfida }))
    this.form_value = [
      {
        type: 'select',
        key: 'gs',
        label: 'Grado sfida (NPG)',
        value: '',
        options: gsOptions
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
        label: 'Classe armatura (PG)',
        value: '',
        placeholder:'es: 10, 15, 20'
      },
      {
        type: 'number',
        key: 'hp',
        label: 'Punti ferita (PG)',
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
          { value: 'c', label: 'C' },
          { value: 'd', label: 'D' },
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

  form_handleChange(e:Event){
    // recupera e sanifica il valore cambiato
    const {type, value, name} = e.target as HTMLInputElement;
    let newValue = type === 'number' ? Number(value) : value;
    const field = this.form_value.find(f => f.key === name);
    if(!field) return console.error("Campo non trovato");
    
    // assegna al form_value
    if(name=='nome') newValue = value.charAt(0).toUpperCase() + value.slice(1);
    field.value = newValue;
  }
  
  form_handleSubmit(e: Event) {
    e.preventDefault();

    // Mappa i valori del form_value in un oggetto comodo
    const nc ={
      squadra: '',
      gs: '',
      nome: '',
      ca: 0,
      hp: 0,
      iniziativa: 0,
      tipo: 'mischia' as 'mischia' | 'distanza'
    };
    for (const field of this.form_value) {
      if(field.key in nc){
        (nc as any)[field.key] = field.value;
      }
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
    this.fightersService.addCombattente(
      squadra,
      isNPCValido ? gs : "",
      nome || "",
      isPGValido ? ca : 0,
      isPGValido ? hp : 0,
      iniziativa || 0,
      tipo
    );

    // Posizionamento automatico sulla mappa
    if(this.mappaService.mappa_value())
      this.combatService.posizionamento();
  }

}
