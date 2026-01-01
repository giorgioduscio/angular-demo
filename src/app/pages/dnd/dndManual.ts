import PersonaggioDND from "../../interfaces/personaggioDND";
import duckcase from "../../tools/duckcase";

interface Classe{
  nome :string;
  dadoVita: 6 | 8 | 10 | 12;
  armature: string[];
  strumenti :string[];
  tiriSalvezza :string[];
  abilita :string[];
  linguaggi :string;
  armi :string[];

  equipaggiamento :string;
  privilegi : {
    level: number;
    privilege: string;
    description: string;
    scelta?: boolean;
  }[];
}

interface Sottoclassi {
  [classeKey:string]: {
    [sottoclasseKey: string]: {
      level: number;
      privilege: string;
      description: string;
      scelta?: boolean;
    }[]
  }
}

interface Sottorazza {
  nome: string;
  velocita: { key: string, value: number }[];
  eta: string,
  taglia: "Piccola" | "Media" | "Grande";
  linguaggi: string[];
  privilegi: { name: string, description: string }[];
  armi?: string[];
  strumenti?: string[];
  armature?: string[];
  abilita?: string[]
}

interface Background {
  name: string;
  abilita: string[];
  strumenti: string[];
  linguaggi: string;
  equipaggiamento: string;
  privilegi: {
    name: string;
    description: string;
  }[];
}

interface Oggetto {
  key: string;
  prezzo: string;
  peso: number;
  // per armature
  ca?: (des:number) => number, 
  armatura?: "leggera" | "media" | "pesante",
  // per armi
  danno?: string,
  proprietà?: string,
  arma?: "da mischia semplice" | "da mischia da guerra" | "a distanza semplice" | "a distanza da guerra",
}

export const DND = {

  classi: [
    {
      nome: "Barbaro",
      dadoVita: 12,
      armature: ['leggere', 'medie e scudi'],
      armi: ['semplici', 'da guerra'],
      strumenti: [],
      tiriSalvezza: ['forza', 'costituzione'],
      abilita: [
        'addestrare animali, atletica, intimidire, natura, percezione, sopravvivenza',
        'addestrare animali, atletica, intimidire, natura, percezione, sopravvivenza',
      ],
      linguaggi: '',
      equipaggiamento: '(a) un\'ascia bipenne o (b) una qualsiasi arma da guerra da mischia; * (a) due asce o (b) una qualsiasi arma semplice; * Una dotazione da esploratore e quattro giavellotti',
      privilegi: [
        {
          level: 1,
          privilege: 'Difesa senza armatura',
          description: 'Se non indossi armatura pesante, CA = 10 + mod DES + mod COS, anche con scudo.'
        },
        {
          level: 1,
          privilege: 'Ira',
          description: 'Puoi entrare in ira fino a 2 volte per riposo lungo.; * Dura 1 minuto, termina se cadi privo di sensi o se non attacchi/subisci danni in un turno.; * Vantaggio su prove di Forza e tiri salvezza su Forza.; * Bonus ai danni da mischia con armi basate su Forza.; * Resistenza a danni contundenti, perforanti e taglienti.'
        },
        {
          level: 2,
          privilege: 'Attacco temerario',
          description: 'Puoi ottenere vantaggio sul primo attacco del turno, ma gli attacchi contro di te hanno vantaggio fino al prossimo turno.'
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 5,
          privilege: 'Attacco extra',
          description: 'Puoi effettuare due attacchi invece di uno quando usi l’azione Attacco.'
        },
        {
          level: 5,
          privilege: 'Movimento veloce',
          description: 'Se non indossi armatura pesante, aumenti la velocità di 3 metri.'
        },
        {
          level: 6,
          privilege: 'Privilegio del Cammino primordiale',
          description: 'Miglioramenti aggiuntivi alle abilità del cammino primordiale scelto.',
          scelta: true
        },
        {
          level: 7,
          privilege: 'Istinto ferino',
          description: 'Agisci normalmente se sorpreso solo se entri in ira all’inizio del combattimento.'
        },
        {
          level: 8,
          privilege: 'Incremento punteggi caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 9,
          privilege: 'Critico brutale',
          description: 'Aggiungi 1 dado al danno di un colpo critico.'
        },
        {
          level: 10,
          privilege: 'Privilegio del Cammino primordiale',
          description: 'Ulteriori miglioramenti alle abilità del cammino primordiale.',
          scelta: true
        },
        {
          level: 11,
          privilege: 'Ira implacabile',
          description: 'Se cadi a 0 HP in ira, puoi fare un tiro salvezza CD 10 su Costituzione per restare a 1 HP.'
        },
        {
          level: 12,
          privilege: 'Incremento punteggi caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 13,
          privilege: 'Critico brutale',
          description: 'Aggiungi 2 dadi al danno di un colpo critico.'
        },
        {
          level: 14,
          privilege: 'Privilegio del Cammino primordiale',
          description: 'Ancora miglioramenti alle abilità del cammino primordiale.',
          scelta: true
        },
        {
          level: 15,
          privilege: 'Inarrestabile',
          description: 'Come reazione, puoi ignorare una condizione di incapacità fino alla fine del turno.'
        },
        {
          level: 16,
          privilege: 'Incremento punteggi caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 17,
          privilege: 'Critico brutale',
          description: 'Aggiungi 3 dadi al danno di un colpo critico.'
        },
        {
          level: 18,
          privilege: 'Potere indomabile',
          description: 'Puoi ritirare un tiro salvezza fallito una volta per riposo lungo.'
        },
        {
          level: 19,
          privilege: 'Incremento punteggi caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 20,
          privilege: 'Campione primordiale',
          description: 'Forza e Costituzione aumentano di 4 (max 24).'
        }
      ]
    },
    {
      nome: "Bardo",
      dadoVita: 8,
      armature: ['leggere'],
      armi: ['semplici', 'spada lunga', 'spada corta', 'arco corto', 'balestra leggera'],
      strumenti: ['Tre strumenti musicali a scelta'],
      tiriSalvezza: ['destrezza', 'carisma'],
      abilita: ['libero','libero','libero'],
      linguaggi: 'Due lingue aggiuntive',
      equipaggiamento: '(a) una spada corta o (b) una qualsiasi arma semplice; * un liuto o qualsiasi altro strumento musicale; * un\'armatura di cuoio; * una dotazione da esploratore',
      privilegi: [
        {
          level: 1,
          privilege: 'Ispirazione Bardica',
          description: 'Come azione bonus, conferisci un dado ispirazione a un alleato; usi per riposo.'
        },
        {
          level: 2,
          privilege: 'Canto del Riposo',
          description: 'Durante un riposo breve, gli alleati che ascoltano recuperano PF extra.'
        },
        {
          level: 2,
          privilege: 'Maestria Parziale',
          description: 'Aggiungi un bonus a tiri di abilità non competenti (Jack of All Trades).'
        },
        {
          level: 3,
          privilege: 'Collegio Bardico',
          description: 'Scegli un collegio che conferisce privilegi unici.',
          scelta: true
        },
        {
          level: 3,
          privilege: 'Maestria (Expertise)',
          description: 'Scegli due abilità in cui raddoppi il bonus di competenza.',
          scelta: true
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 5,
          privilege: 'Fonti di Ispirazione',
          description: 'Recuperi usi di Ispirazione Bardica con un riposo breve.'
        },
        {
          level: 5,
          privilege: 'Ispirazione Bardica (dado migliorato)',
          description: 'Il dado di Ispirazione Bardica aumenta di taglia.'
        },
        {
          level: 6,
          privilege: 'Controincanto',
          description: 'Come azione, esegui una performance che conferisce vantaggio ai TS su charme/paura agli alleati vicini.'
        },
        {
          level: 7,
          privilege: 'Magia Avanzata',
          description: 'Accedi a incantesimi di livello superiore e perfezioni le tue arti magiche.'
        },
        {
          level: 8,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 9,
          privilege: 'Canto del Riposo (migliorato)',
          description: 'Il bonus di Canto del Riposo aumenta.'
        },
        {
          level: 10,
          privilege: 'Segreti Magici',
          description: 'Impari 2 incantesimi da qualunque lista; diventano incantesimi da bardo per te.'
        },
        {
          level: 10,
          privilege: 'Maestria (ulteriore)',
          description: 'Scegli altre due abilità per raddoppiare il bonus di competenza.',
          scelta: true
        },
        {
          level: 10,
          privilege: 'Ispirazione Bardica (dado migliorato)',
          description: 'Il dado di Ispirazione Bardica aumenta nuovamente di taglia.'
        },
        {
          level: 11,
          privilege: 'Incantesimi Superiori',
          description: 'Accedi a incantesimi di livello più alto.'
        },
        {
          level: 12,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 13,
          privilege: 'Canto del Riposo (migliorato)',
          description: 'Il bonus di Canto del Riposo aumenta.'
        },
        {
          level: 14,
          privilege: 'Segreti Magici Superiori',
          description: 'Impari 2 ulteriori incantesimi da qualunque lista; diventano incantesimi da bardo.'
        },
        {
          level: 15,
          privilege: 'Ispirazione Bardica (dado migliorato)',
          description: 'Il dado di Ispirazione Bardica raggiunge la sua taglia massima.'
        },
        {
          level: 16,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 17,
          privilege: 'Canto del Riposo (migliorato)',
          description: 'Il bonus di Canto del Riposo aumenta al valore finale.'
        },
        {
          level: 18,
          privilege: 'Segreti Magici Ulteriori',
          description: 'Impari 2 ulteriori incantesimi da qualunque lista; diventano incantesimi da bardo.'
        },
        {
          level: 19,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 20,
          privilege: 'Maestro dell’Ispirazione',
          description: 'Ispirazione quasi inesauribile e più potente.'
        }
      ]
    },
    {
      nome: "Chierico",
      dadoVita: 8,
      armature: ['leggere', 'medie', 'pesanti e scudi'],
      armi: ['semplici'],
      strumenti: [],
      tiriSalvezza: ['saggezza', 'carisma'],
      abilita: [
        'intuizione,medicina,persuasione,religione,storia',
        'intuizione,medicina,persuasione,religione,storia',
      ],
      linguaggi: 'Due lingue aggiuntive',
      equipaggiamento: '(a) una mazza o (b) un martello da guerra; * (a) un\'armatura di maglia o (b) un\'armatura di cuoio e uno scudo; * un simbolo sacro; * una dotazione da sacerdote',
      privilegi: [
        {
          level: 1,
          privilege: 'Dominio Divino',
          description: 'Scegli un Dominio che conferisce incantesimi e privilegi unici.',
          scelta: true
        },
        {
          level: 2,
          privilege: 'Canale Divino',
          description: 'Usi il potere divino per effetti speciali; include Scacciare Non Morti.'
        },
        {
          level: 3,
          privilege: 'Privilegio del Dominio',
          description: 'Il tuo Dominio conferisce un nuovo privilegio.'
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 5,
          privilege: 'Distruzione dei Non Morti',
          description: 'Non morti di GS basso vengono distrutti quando falliscono Scacciare.'
        },
        {
          level: 6,
          privilege: 'Canale Divino (usi aggiuntivi)',
          description: 'Ottieni un uso addizionale di Canale Divino tra un riposo lungo e l’altro.'
        },
        {
          level: 7,
          privilege: 'Privilegio del Dominio',
          description: 'Il tuo Dominio conferisce un nuovo privilegio.'
        },
        {
          level: 8,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 8,
          privilege: 'Distruzione dei Non Morti (migliorata)',
          description: 'La soglia di GS dei non morti che vengono distrutti aumenta.'
        },
        {
          level: 9,
          privilege: 'Privilegio del Dominio',
          description: 'Il tuo Dominio conferisce un nuovo privilegio.'
        },
        {
          level: 10,
          privilege: 'Intervento Divino',
          description: 'Puoi richiedere l’aiuto diretto della tua divinità una volta per riposo lungo.'
        },
        {
          level: 11,
          privilege: 'Distruzione dei Non Morti (migliorata)',
          description: 'La soglia di GS dei non morti che vengono distrutti aumenta.'
        },
        {
          level: 12,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 13,
          privilege: 'Privilegio del Dominio',
          description: 'Il tuo Dominio conferisce un nuovo privilegio.'
        },
        {
          level: 14,
          privilege: 'Distruzione dei Non Morti (migliorata)',
          description: 'La soglia di GS dei non morti che vengono distrutti aumenta.'
        },
        {
          level: 15,
          privilege: 'Privilegio del Dominio',
          description: 'Il tuo Dominio conferisce un nuovo privilegio.'
        },
        {
          level: 16,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 17,
          privilege: 'Distruzione dei Non Morti (migliorata)',
          description: 'La soglia di GS dei non morti che vengono distrutti aumenta.'
        },
        {
          level: 18,
          privilege: 'Canale Divino (usi aggiuntivi)',
          description: 'Ottieni un ulteriore uso di Canale Divino tra i riposi.'
        },
        {
          level: 19,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 20,
          privilege: 'Campione del Divino',
          description: 'Potere divino al suo apice, privilegi del Dominio potenziati.'
        }
      ]
    },
    {
      nome: "Druido",
      dadoVita: 8,
      armature: ['leggere', 'medie (non di metallo)', 'scudi (non di metallo)'],
      armi: ['clava', 'pugnale', 'lancia', 'mazza', 'bastone', 'falce', 'frusta'],
      strumenti: ['Kit da erborista'],
      tiriSalvezza: ['intelligenza', 'saggezza'],
      abilita: [
        'addestrare animali,arcano,intuizione,medicina,natura,percezione,religione,sopravvivenza',
        'addestrare animali,arcano,intuizione,medicina,natura,percezione,religione,sopravvivenza'
      ],
      linguaggi: 'Druidico',
      equipaggiamento: '(a) una clava o (b) un pugnale; * un\'armatura di cuoio; * un scudo di legno; * una dotazione da esploratore',
      privilegi: [
        {
          level: 1,
          privilege: 'Linguaggio Druidico',
          description: 'Conosci il linguaggio segreto dei druidi.'
        },
        {
          level: 2,
          privilege: 'Forma Selvatica',
          description: 'Ti trasformi in bestie conosciute un certo numero di volte per riposo.'
        },
        {
          level: 2,
          privilege: 'Circolo Druidico',
          description: 'Scegli un Circolo che conferisce privilegi unici.',
          scelta: true
        },
        {
          level: 3,
          privilege: 'Approfondimento del Circolo',
          description: 'Il tuo Circolo Druidico ti concede ulteriori tecniche e conoscenze.'
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 5,
          privilege: 'Forma Migliorata',
          description: 'Miglioramenti alla Forma Selvatica e agli incantesimi.'
        },
        {
          level: 6,
          privilege: 'Privilegio del Circolo',
          description: 'Il tuo Circolo Druidico conferisce un nuovo privilegio.'
        },
        {
          level: 7,
          privilege: 'Approfondimento del Circolo',
          description: 'Ottieni un ulteriore beneficio legato al tuo Circolo.'
        },
        {
          level: 8,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 9,
          privilege: 'Approfondimento del Circolo',
          description: 'Affini le pratiche del tuo Circolo.'
        },
        {
          level: 10,
          privilege: 'Privilegio del Circolo',
          description: 'Il tuo Circolo Druidico conferisce un nuovo privilegio.'
        },
        {
          level: 11,
          privilege: 'Incantesimi Superiori',
          description: 'Accedi a incantesimi di livello più alto.'
        },
        {
          level: 12,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 13,
          privilege: 'Approfondimento del Circolo',
          description: 'Ulteriori insegnamenti dal tuo Circolo.'
        },
        {
          level: 14,
          privilege: 'Privilegio del Circolo',
          description: 'Il tuo Circolo Druidico conferisce un nuovo privilegio.'
        },
        {
          level: 15,
          privilege: 'Approfondimento del Circolo',
          description: 'Migliori capacità legate al tuo Circolo.'
        },
        {
          level: 16,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 17,
          privilege: 'Incantesimi Superiori',
          description: 'Accedi a incantesimi di livello più alto.'
        },
        {
          level: 18,
          privilege: 'Corpo Senza Tempo',
          description: 'Invecchi più lentamente e subisci meno effetti del tempo.'
        },
        {
          level: 18,
          privilege: 'Incantesimi Bestiali',
          description: 'Puoi lanciare molti incantesimi anche in Forma Selvatica.'
        },
        {
          level: 19,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 20,
          privilege: 'Arcidruido',
          description: 'Usi Forma Selvatica illimitati e grandi poteri naturali.'
        }
      ]
    },
    { nome: "Guerriero",
      dadoVita: 10,
      armature: ['leggere', 'medie', 'pesanti e scudi'],
      armi: ['semplici', 'da guerra'],
      strumenti: [],
      tiriSalvezza: ['forza', 'costituzione'],
      abilita: [
        'acrobazia,addestrare animali,atletica,intimidire,intuizione,percezione,sopravvivenza,storia',
        'acrobazia,addestrare animali,atletica,intimidire,intuizione,percezione,sopravvivenza,storia'
      ],
      linguaggi: '',
      equipaggiamento: '(a) un\'armatura di maglia o (b) un\'armatura di cuoio e uno scudo; * (a) un martello da guerra e uno scudo o (b) due armi da guerra; * una dotazione da esploratore',
      privilegi: [
        {
          level: 1,
          privilege: 'Recupero energia',
          description: 'Dopo un riposo, puoi spendere un\'azione bonus e recuperare punti ferita pari a d10 + livello guerriero.'
        },
        {
          level: 1,
          privilege: 'Stile combattimento',
          description: '* Tiro: Ottieni un bonus di +2 ai tiri per colpire con armi a distanza. * Armi possenti: Quando ottieni 1 o 2 su un tiro per i danni con un’arma da mischia impugnata a due mani, puoi ripetere il tiro e devi usare il nuovo risultato. L’arma deve avere la proprietà a due mani o versatile. * Combattere con due armi: Quando combatti con due armi, puoi aggiungere il tuo modificatore di caratteristica ai danni del secondo attacco. * Difesa: Finché indossi un’armatura, ottieni un bonus di +1 alla CA. * Duellare: Quando impugni un’arma da mischia in una mano e nessun’altra arma, ottieni un bonus di +2 ai tiri per i danni con qu quell’arma. * Protezione: Quando una creatura che puoi vedere attacca un bersaglio diverso da te entro 1,5 m, puoi usare la tua reazione per imporre svantaggio al suo tiro per colpire. Devi impugnare uno scudo. * Combattimento alla cieca: Hai percezione cieca fino a 3 m: vedi creature e oggetti non dietro copertura totale, anche al buio, da accecato o contro invisibili (a meno che non si nascondano con successo). * Intercezione: Quando una creatura che vedi colpisce un bersaglio entro 1,5 m da te (non te), puoi usare la reazione per ridurre il danno di 1d10 + bonus competenza (min. 0). Richiede scudo o arma semplice/marziale. * Tecnica superiore: Impari una manovra da Maestro di Battaglia. CD salvezza = 8 + competenza + mod. Forza o Destrezza. Ottieni 1d6 di superiorità (cumulabile), recuperato dopo un riposo breve o lungo. * Combattimento con armi da lancio: Puoi estrarre un’arma con proprietà lancio come parte del suo attacco. Inoltre, i tuoi attacchi a distanza con armi da lancio infliggono +2 danni. * Combattimento disarmato: I tuoi attacchi disarmati infliggono 1d6 + mod. Forza danni contundenti (1d8 se non impugni armi né scudo). All’inizio del tuo turno, puoi infliggere 1d4 danni contundenti a una creatura che stai afferrando.',
          scelta: true
        },
        {
          level: 2,
          privilege: 'Azione impetuosa',
          description: 'Dopo un riposo, ottieni un\'azione aggiuntiva e una possibile azione bonus nel proprio turno.'
        },
        {
          level: 3,
          privilege: 'Privilegio archetipo',
          description: 'Scegli un archetipo di guerriero che conferisce abilità speciali.',
          scelta: true
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta un punteggio di caratteristica di 2, o due punteggi di 1.'
        },
        {
          level: 5,
          privilege: 'Attacco extra +1',
          description: 'Effettui due attacchi invece di uno quando usi l\'azione Attacco.'
        },
        {
          level: 7,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta un punteggio di caratteristica di 2, o due punteggi di 1.'
        },
        {
          level: 8,
          privilege: 'Privilegio archetipo',
          description: '',
          scelta: true
        },
        {
          level: 9,
          privilege: 'Indomito',
          description: 'Dopo un riposo, puoi ritirare un tiro salvezza che fallisce.'
        },
        {
          level: 10,
          privilege: 'Privilegio archetipo',
          description: '',
          scelta: true
        },
        {
          level: 11,
          privilege: 'Attacco extra +2',
          description: 'Effettui tre attacchi invece di uno quando usi l\'azione Attacco.'
        },
        {
          level: 12,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta un punteggio di caratteristica di 2, o due punteggi di 1.'
        },
        {
          level: 13,
          privilege: 'Indomito',
          description: 'Puoi ritirare due tiri salvezza che fallisci tra i riposi.'
        },
        {
          level: 14,
          privilege: 'Privilegio archetipo',
          description: '',
          scelta: true
        },
        {
          level: 15,
          privilege: 'Attacco extra +3',
          description: 'Effettui quattro attacchi invece di uno quando usi l\'azione Attacco.'
        },
        {
          level: 16,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta un punteggio di caratteristica di 2, o due punteggi di 1.'
        },
        {
          level: 17,
          privilege: 'Indomito',
          description: 'Puoi ritirare tre tiri salvezza che fallisci tra i riposi.'
        },
        {
          level: 18,
          privilege: 'Privilegio archetipo',
          description: '',
          scelta: true
        },
        {
          level: 19,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta un punteggio di caratteristica di 2, o due punteggi di 1.'
        },
        {
          level: 20,
          privilege: 'Attacco extra +4',
          description: 'Effettui cinque attacchi invece di uno quando usi l\'azione Attacco.'
        }
      ]
    },
    { nome: "Ladro",
      dadoVita: 8,
      armature: ['leggere'],
      armi: ['semplici', 'spada lunga', 'spada corta', 'arco corto', 'balestra leggera'],
      strumenti: ['Kit da ladro', 'strumenti da ladro'],
      tiriSalvezza: ['destrezza', 'intelligenza'],
      abilita: [ // quattro a scelta tra...
        'acrobazia, atletica, furtività,indagare, inganno, intimidire, intrattenere,intuizione,percezione,persuasione,rapidità di mano',
        'acrobazia, atletica, furtività,indagare, inganno, intimidire, intrattenere,intuizione,percezione,persuasione,rapidità di mano',
        'acrobazia, atletica, furtività,indagare, inganno, intimidire, intrattenere,intuizione,percezione,persuasione,rapidità di mano',
        'acrobazia, atletica, furtività,indagare, inganno, intimidire, intrattenere,intuizione,percezione,persuasione,rapidità di mano'
      ],
      linguaggi: '',
      equipaggiamento: '(a) una spada corta o (b) una qualsiasi arma semplice; * (a) un arco corto e 20 frecce o (b) una balestra leggera e 20 dardi; * una dotazione da ladro; * una dotazione da esploratore',
      privilegi: [
        {
          level: 1,
          privilege: "Attacco Furtivo",
          description: "Una volta per turno, puoi infliggere danni extra a una creatura che colpisci con un attacco con arma con arma accurata. Puoi avvinare quando, dadi di vantaggio sul tiro per colpire a quando il bersaglio ha un avversario a 1,5m."
        },
        {
          level: 1,
          privilege: "Gergo Ladresco",
          description: "Impari gergo e codici che criptano messaggi. Sali un altro ladro più comprendi. Ci vuole il quadrupolo del tempo per trasmetterli. Inoltre, comprendi una serie di segni e simboli segreti per messaggi semplici e brevi (area pericolosa, territorio della gilda dei ladri, bottino nelle vicinanze, abitanti facili prede o possono fermarti in luogo ad un ladro in fuga)."
        },
        {
          level: 2,
          privilege: "Maestria",
          description: "Puoi scegliere due abilità o un'abilità e un attacco da scasso) in cui ha competenza. Il Bonus Competenza per quelle prove è raddoppiato.",
          scelta: true
        },
        {
          level: 2,
          privilege: "Ladro",
          description: "Puoi scattare guadagnati azione bonus una volta a turno per Disimpegno, Nascondersi o Scattare."
        },
        {
          level: 3,
          privilege: "Privilegio dell'archetipo - Mira Stabile (Tasha)",
          description: "Se non ti muovi nel tuo turno, puoi spendere l'azione bonus per darti vantaggio sul tuo prossimo tiro per colpire di tiro con arma.",
          scelta: true
        },
        {
          level: 4,
          privilege: "Incremento punteggi di caratteristica",
          description: "Aumenta di 2 un punteggio di caratteristica."
        },
        {
          level: 5,
          privilege: "Schivata Prodigiosa",
          description: "Quando un attaccante che sei in grado di vedere ti colpisce con un attacco, puoi usare la tua reazione per dimezzare il danno dell'attacco effettuato contro di te."
        },
        {
          level: 6,
          privilege: "Maestria 2",
          description: "Puoi scegliere altre due competenze.",
          scelta: true
        },
        {
          level: 7,
          privilege: "Illusione",
          description: "Quando sei vittima di un effetto che ti permette di compiere un tiro salvezza su Destrezza per dimezzare i danni, non subisci danni se superi il tiro salvezza, e solo metà danni se lo fallisci."
        },
        {
          level: 8,
          privilege: "Incremento punteggi di caratteristica",
          description: "Aumenta di 2 un punteggio di caratteristica."
        },
        {
          level: 9,
          privilege: "Privilegio dell'archetipo",
          description: "Privilegio speciale dell'archetipo a questo livello.",
          scelta: true
        },
        {
          level: 10,
          privilege: "Incremento punteggi di caratteristica",
          description: "Aumenta di 2 un punteggio di caratteristica."
        },
        {
          level: 11,
          privilege: 'Talento Affidabile',
          description: 'Quando tiri un d20 per una prova con competenza, tratti i risultati inferiori a 10 come 10.'
        },
        {
          level: 12,
          privilege: 'Incremento punteggi di caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica.'
        },
        {
          level: 13,
          privilege: "Privilegio dell'archetipo",
          description: 'Privilegio speciale dell’archetipo a questo livello.',
          scelta: true
        },
        {
          level: 14,
          privilege: 'Senso Cieco',
          description: 'Percepisci le creature invisibili entro 3 metri se non sono completamente coperte.'
        },
        {
          level: 15,
          privilege: 'Mente Sfuggente',
          description: 'Ottieni competenza nei tiri salvezza su Saggezza.'
        },
        {
          level: 16,
          privilege: 'Incremento punteggi di caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica.'
        },
        {
          level: 17,
          privilege: "Privilegio dell'archetipo",
          description: 'Privilegio speciale dell’archetipo a questo livello.',
          scelta: true
        },
        {
          level: 18,
          privilege: 'Inafferrabile',
          description: 'Finché non sei incapacitato, gli attacchi contro di te non hanno mai vantaggio.'
        },
        {
          level: 19,
          privilege: 'Incremento punteggi di caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica.'
        },
        {
          level: 20,
          privilege: 'Colpo di Fortuna',
          description: 'Una volta per riposo breve, puoi trasformare un tiro mancato in un colpo riuscito o far riuscire una prova.'
        }
      ]
    },
    { nome: "Mago",
      dadoVita: 6,
      armature: [],
      armi: ['pugnale', 'dardi', 'bastone', 'frusta'],
      strumenti: [],
      tiriSalvezza: ['intelligenza', 'saggezza'],
      abilita: [
        'arcano,indagare,intuizione,medicina,religione,storia',
        'arcano,indagare,intuizione,medicina,religione,storia'
      ],
      linguaggi: '',
      equipaggiamento: '(a) un pugnale o (b) una qualsiasi arma semplice; * una dotazione da studioso; * un libro degli incantesimi',
      privilegi: [
        {
          level: 1,
          privilege: 'Recupero Arcano',
          description: 'Recuperi slot incantesimo dopo un riposo breve una volta al giorno.'
        },
        {
          level: 2,
          privilege: 'Tradizione Arcana',
          description: 'Scegli una scuola di magia che conferisce privilegi.',
          scelta: true
        },
        {
          level: 3,
          privilege: 'Studio Arcano',
          description: 'Approfondisci le tue ricerche e tecniche arcane.'
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 5,
          privilege: 'Magia Superiore',
          description: 'Accesso agli incantesimi di 3° livello e superiori.'
        },
        {
          level: 6,
          privilege: 'Privilegio della Tradizione Arcana',
          description: 'La tua scuola di magia conferisce un nuovo privilegio.'
        },
        {
          level: 7,
          privilege: 'Studio Arcano',
          description: 'Perfezioni le pratiche di lancio e studio degli incantesimi.'
        },
        {
          level: 8,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 9,
          privilege: 'Magia Avanzata',
          description: 'Accedi a incantesimi di livello superiore.'
        },
        {
          level: 10,
          privilege: 'Privilegio della Tradizione Arcana',
          description: 'La tua scuola di magia conferisce un nuovo privilegio.'
        },
        {
          level: 11,
          privilege: 'Incantesimi Superiori',
          description: 'Accedi a incantesimi di livello più alto.'
        },
        {
          level: 12,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 13,
          privilege: 'Studio Arcano',
          description: 'Rafforzi la comprensione di formule e rituali.'
        },
        {
          level: 14,
          privilege: 'Privilegio della Tradizione Arcana',
          description: 'La tua scuola di magia conferisce un nuovo privilegio.'
        },
        {
          level: 15,
          privilege: 'Studio Arcano',
          description: 'Affini ulteriormente la tua padronanza arcana.'
        },
        {
          level: 16,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 17,
          privilege: 'Incantesimi Superiori',
          description: 'Accedi a incantesimi di livello più alto.'
        },
        {
          level: 18,
          privilege: 'Maestria degli Incantesimi',
          description: 'Lanci alcuni incantesimi di basso livello senza spendere slot.'
        },
        {
          level: 19,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 20,
          privilege: 'Maestro Arcano',
          description: 'Padroneggi la magia arcana con poteri eccezionali.'
        }
      ]
    },
    { nome: "Monaco",
      dadoVita: 8,
      armature: [],
      armi: ['semplici', 'spada corta'],
      strumenti: ['strumento da artigiano', 'strumento musicale'],
      tiriSalvezza: ['forza', 'destrezza'],
      abilita: [
        'acrobazia,atletica,furtività,intuizione,religione,storia',
        'acrobazia,atletica,furtività,intuizione,religione,storia'
      ],
      linguaggi: '',
      equipaggiamento: '(a) una spada corta o (b) una qualsiasi arma semplice; * una dotazione da esploratore; * 10 dardi',
      privilegi: [
        {
          level: 1,
          privilege: 'Difesa senza armatura',
          description: 'Se non indossi armatura pesante, CA = 10 + mod Destrezza + mod Saggezza.'
        },
        {
          level: 1,
          privilege: 'Uso delle armi senza armatura',
          description: 'Le armi da monaco usano il modificatore di Destrezza per attacchi e danni.'
        },
        {
          level: 1,
          privilege: 'Aumento colpo senz\'armi',
          description: 'Danni del colpo senz\'armi diventano d6.'
        },
        {
          level: 2,
          privilege: 'Movimento senza armatura',
          description: 'La velocità aumenta di 9 metri se non indossi armatura o scudo.'
        },
        {
          level: 3,
          privilege: 'Privilegio della tradizione monastica',
          description: 'Scegli una tradizione monastica che conferisce abilità uniche.',
          scelta: true
        },
        {
          level: 4,
          privilege: 'Aumento punteggi di caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi di 1.'
        },
        {
          level: 5,
          privilege: 'Movimento senza armatura',
          description: 'La velocità aumenta di ulteriori 9 metri se non indossi armatura o scudo.'
        },
        {
          level: 5,
          privilege: 'Aumento colpo senz\'armi',
          description: 'Danni del colpo senz\'armi diventano d8.'
        },
        {
          level: 6,
          privilege: 'Corpo vuoto',
          description: 'Resistenza a malattie e veleni.'
        },
        {
          level: 7,
          privilege: 'Movimento senza armatura',
          description: 'La velocità aumenta di ulteriori 9 metri se non indossi armatura o scudo.'
        },
        {
          level: 8,
          privilege: 'Aumento punteggi di caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi di 1.'
        },
        {
          level: 9,
          privilege: 'Movimento senza armatura',
          description: 'La velocità aumenta di ulteriori 9 metri se non indossi armatura o scudo.'
        },
        {
          level: 9,
          privilege: 'Aumento colpo senz\'armi',
          description: 'Danni del colpo senz\'armi diventano d10.'
        },
        {
          level: 10,
          privilege: 'Perfezione interiore',
          description: 'Se rimani senza Ki, non ne recuperi 4.'
        },
        {
          level: 11,
          privilege: 'Aumento colpo senz\'armi',
          description: 'Danni del colpo senz\'armi diventano d12.'
        },
        {
          level: 12,
          privilege: 'Aumento punteggi di caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi di 1.'
        },
        {
          level: 13,
          privilege: 'Linguaggio del Sole e della Luna',
          description: 'Comprendi e ti fai comprendere da qualsiasi creatura che conosca almeno una lingua.'
        },
        {
          level: 14,
          privilege: 'Anima di Diamante',
          description: 'Competenza in tutti i tiri salvezza; puoi spendere 1 Ki per ritirare un TS fallito.'
        },
        {
          level: 15,
          privilege: 'Corpo senza Tempo',
          description: 'Non soffri gli effetti dell’età in combattimento e non puoi essere invecchiato magicamente.'
        },
        {
          level: 16,
          privilege: 'Aumento punteggi di caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi di 1.'
        },
        {
          level: 17,
          privilege: 'Privilegio della tradizione monastica',
          description: 'La tua tradizione conferisce un privilegio aggiuntivo a questo livello.',
          scelta: true
        },
        {
          level: 18,
          privilege: 'Corpo Vuoto',
          description: 'Puoi diventare invisibile e ottenere resistenza ai danni con un uso del Ki; puoi anche proiettare la tua presenza.'
        },
        {
          level: 19,
          privilege: 'Aumento punteggi di caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi di 1.'
        },
        {
          level: 20,
          privilege: 'Sé Perfetto',
          description: 'Quando tiri iniziativa e non hai punti Ki, ne recuperi automaticamente.'
        }
      ]
    },
    { nome: "Paladino",
      dadoVita: 10,
      armature: ['leggere', 'medie', 'pesanti e scudi'],
      armi: ['semplici', 'da guerra'],
      strumenti: [],
      tiriSalvezza: ['saggezza', 'carisma'],
      abilita: [
        'atletica,intimidire,intuizione,medicina,persuasione,religione',
        'atletica,intimidire,intuizione,medicina,persuasione,religione'
      ],
      linguaggi: '',
      equipaggiamento: '(a) una spada lunga e uno scudo o (b) due armi da guerra; * (a) cinque giavellotti o (b) una qualsiasi arma semplice da mischia; * una dotazione da esploratore; * un simbolo sacro',
      privilegi: [
        {
          level: 1,
          privilege: 'Imposizione delle Mani',
          description: "Dopo riposo lungo, ripristini Punti ferita - liv * 5, puoi spendere 5 punti ferita per curare da malattie e veleni, non ha effetto su contratti e non morti."
        },
        {
          level: 1,
          privilege: 'Percezione del Divino',
          description: "Il paladino percepisce la presenza e il tipo di ogni creatura entro 18m da lui e che non si trovi sotto copertura totale. Utilizzi 1° mod CAR e dal riposo lungo recupera tutti gli utilizzi."
        },
        {
          level: 2,
          privilege: 'Stile di Combattimento',
          description: "Puoi combattere con un'arma da mischia, puoi spendere uno slot incantesimo per infliggere danni radiosi.",
          scelta: true
        },
        {
          level: 3,
          privilege: 'Salute Divina',
          description: "Il paladino diventa immune alle malattie."
        },
        {
          level: 4,
          privilege: 'Aumento di Punteggi Caratteristica',
          description: "Aumenta di 2 o due di 1."
        },
        {
          level: 5,
          privilege: 'Attacco Extra',
          description: "Puoi attaccare una seconda volta entro 3m durante un turno."
        },
        {
          level: 7,
          privilege: 'Aura di Protezione',
          description: "Se il paladino o un alleato entro 3m devono fare un tiro salvezza, ottengono un bonus pari a mod CAR."
        },
        {
          level: 8,
          privilege: 'Privilegio del giuramento',
          description: "Privilegio speciale conferito dall'archetipo scelto.",
          scelta: true
        },
        {
          level: 9,
          privilege: 'Aumento di Punteggi Caratteristica',
          description: "Aumenta di 2 o due di 1."
        },
        {
          level: 10,
          privilege: 'Aura di Coraggio',
          description: "Paladino e creature amiche entro 3m non possono essere spaventate finché il paladino è cosciente."
        },
        {
          level: 11,
          privilege: 'Punizione Divina Migliorata',
          description: "Danni radiosi migliorati."
        },
        {
          level: 12,
          privilege: 'Aumento di Punteggi Caratteristica',
          description: "Aumenta di 2 o due di 1."
        },
        {
          level: 13,
          privilege: 'Privilegio del giuramento',
          description: "Privilegio speciale conferito dall'archetipo scelto.",
          scelta: true
        },
        {
          level: 14,
          privilege: 'Incorruzione Punitrice',
          description: "Con un tocco, puoi cessare un incantesimo su te stesso e i consenzienti. Numero utilizzi = mod CAR, si ricarica dopo riposo."
        },
        {
          level: 15,
          privilege: 'Privilegio del giuramento',
          description: "Privilegio speciale conferito dall'archetipo scelto.",
          scelta: true
        },
        {
          level: 16,
          privilege: 'Aumento di Punteggi Caratteristica',
          description: "Aumenta di 2 o due di 1."
        },
        {
          level: 17,
          privilege: 'Privilegio del giuramento',
          description: "Privilegio speciale conferito dall'archetipo scelto.",
          scelta: true
        },
        {
          level: 18,
          privilege: 'Aura Migliorata',
          description: "Aura migliorata con raggio di 9m."
        },
        {
          level: 19,
          privilege: 'Aumento di Punteggi Caratteristica',
          description: "Aumenta di 2 o due di 1."
        },
        {
          level: 20,
          privilege: 'Campione Divino',
          description: "Privilegio speciale di alto livello, migliora poteri divini."
        }
      ]
    },
    { nome: "Ranger",
      dadoVita: 10,
      armature: ['leggere', 'medie e scudi'],
      armi: ['semplici', 'da guerra'],
      strumenti: [],
      tiriSalvezza: ['destrezza', 'saggezza'],
      abilita: [
        'addestrare animali,atletica,furtività,indagare,intuizione,natura,percezione,sopravvivenza',
        'addestrare animali,atletica,furtività,indagare,intuizione,natura,percezione,sopravvivenza',
        'addestrare animali,atletica,furtività,indagare,intuizione,natura,percezione,sopravvivenza'
      ],
      linguaggi: 'Una lingua aggiuntiva',
      equipaggiamento: '(a) un\'armatura di cuoio o (b) un\'armatura di maglia; * (a) due spade corte o (b) due qualsiasi armi semplici; * una dotazione da esploratore; * una lunga spada',
      privilegi: [
        {
          level: 1,
          privilege: 'Imparare 2 lingue e duplicare la competenza',
          description: 'Impari 2 lingue e duplichi la tua competenza in un’abilità in cui sei competente.'
        },
        {
          level: 2,
          privilege: 'Stile di Combattimento',
          description: 'Scegli uno stile di combattimento tra quelli disponibili per migliorare le tue capacità in battaglia.',
          scelta: true
        },
        {
          level: 3,
          privilege: 'Archetipo Ranger',
          description: 'Scegli un archetipo che definisce il tuo stile e le tue abilità uniche.',
          scelta: true
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi di 1.'
        },
        {
          level: 5,
          privilege: 'Attacco Extra',
          description: 'Puoi effettuare due attacchi invece di uno quando usi l’azione Attacco.'
        },
        {
          level: 6,
          privilege: 'Consapevolezza Primordiale',
          description: 'Puoi spendere uno slot incantesimo e per 1 minuto +incantesimo, puoi percepire le creature entro 1,5 km (10 km in territorio affine).'
        },
        {
          level: 7,
          privilege: 'Incremento Caratteristica',
          description: 'Un punteggio di caratteristica di 2 o due punteggi di 1.'
        },
        {
          level: 8,
          privilege: 'Attacco Extra',
          description: 'Puoi effettuare due attacchi invece di uno quando usi l’azione Attacco.'
        },
        {
          level: 9,
          privilege: 'Vagabondo',
          description: 'La velocità aumenta di 1,5m e il movimento di nuoto e scalata hanno la stessa velocità di camminata. Danni aumentati di 6 se avversario prescelto.'
        },
        {
          level: 10,
          privilege: 'Andatura sul Territorio',
          description: 'Puoi attraversare territori e vegetali senza essere rallentato o senza subire danni da essi, e puoi percepire i pericoli naturali.'
        },
        {
          level: 11,
          privilege: 'Incremento Caratteristica',
          description: 'Un punteggio di caratteristica di 2 o due punteggi di 1.'
        },
        {
          level: 12,
          privilege: 'Implacabile',
          description: 'Come reazione, puoi ignorare condizioni di incapacità fino alla fine del turno.'
        },
        {
          level: 13,
          privilege: 'Incremento Caratteristica',
          description: 'Un punteggio di caratteristica di 2 o due punteggi di 1.'
        },
        {
          level: 14,
          privilege: 'Avversario prescelto',
          description: 'I danni aumentano di 8 contro il tuo avversario prescelto.'
        },
        {
          level: 15,
          privilege: 'Incremento Caratteristica',
          description: 'Un punteggio di caratteristica di 2 o due punteggi di 1.'
        },
        {
          level: 16,
          privilege: 'Incremento Caratteristica',
          description: 'Un punteggio di caratteristica di 2 o due punteggi di 1.'
        },
        {
          level: 17,
          privilege: 'Incremento Caratteristica',
          description: 'Un punteggio di caratteristica di 2 o due punteggi di 1.'
        },
        {
          level: 18,
          privilege: 'Sensi Ferini',
          description: 'Quando attacchi una creatura che non puoi vedere, hai vantaggio ai tiri per colpire.'
        },
        {
          level: 19,
          privilege: 'Incremento Caratteristica',
          description: 'Un punteggio di caratteristica di 2 o due punteggi di 1.'
        },
        {
          level: 20,
          privilege: 'Sterminatore di Nemici',
          description: 'Puoi sommare un dado danno extra al tuo attacco per turno. Usa questo privilegio prima o dopo il tiro.'
        }
      ]
    },
    { nome: "Stregone",
      dadoVita: 6,
      armature: [],
      armi: ['semplici'],
      strumenti: [],
      tiriSalvezza: ['costituzione', 'carisma'],
      abilita: [
        'arcano,inganno,intimidire,intuizione,persuasione,religione',
        'arcano,inganno,intimidire,intuizione,persuasione,religione'
      ],
      linguaggi: '',
      equipaggiamento: '(a) un pugnale o (b) una qualsiasi arma semplice; * una dotazione da studioso; * un componente materiale per incantesimi',
      privilegi: [
        {
          level: 1,
          privilege: 'Origine Stregonesca',
          description: 'Scegli un’origine che conferisce poteri innati.',
          scelta: true
        },
        {
          level: 2,
          privilege: 'Punti Stregoneria e Metamagia',
          description: 'Ottieni Punti Stregoneria e opzioni di Metamagia.',
          scelta: true
        },
        {
          level: 3,
          privilege: 'Metamagia Aggiuntiva',
          description: 'Ottieni ulteriori opzioni di Metamagia.',
          scelta: true
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 5,
          privilege: 'Magia Potenziata',
          description: 'Accesso a incantesimi più potenti e uso avanzato della Metamagia.'
        },
        {
          level: 6,
          privilege: 'Punti Stregoneria (aumentati)',
          description: 'Ottieni più Punti Stregoneria per alimentare la Metamagia.'
        },
        {
          level: 7,
          privilege: 'Magia Avanzata',
          description: 'Accedi a incantesimi di livello superiore e perfezioni l’uso della Metamagia.'
        },
        {
          level: 8,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 9,
          privilege: 'Incantesimi Superiori',
          description: 'Ottieni accesso a incantesimi di livello più alto.'
        },
        {
          level: 10,
          privilege: 'Metamagia (opzioni aggiuntive)',
          description: 'Ottieni ulteriori opzioni o usi di Metamagia.',
          scelta: true
        },
        {
          level: 11,
          privilege: 'Magia Avanzata',
          description: 'Perfezioni ulteriormente le tue capacità innate con gli incantesimi.'
        },
        {
          level: 12,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 13,
          privilege: 'Incantesimi Superiori',
          description: 'Accedi a incantesimi di livello ancora più alto.'
        },
        {
          level: 14,
          privilege: 'Potenziamenti dell’Origine',
          description: 'La tua Origine Stregonesca conferisce benefici aggiuntivi.'
        },
        {
          level: 15,
          privilege: 'Metamagia Affinata',
          description: 'Ottieni maggiore efficienza nell’uso dei Punti Stregoneria e della Metamagia.'
        },
        {
          level: 16,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 17,
          privilege: 'Incantesimi Epici',
          description: 'Accedi ai massimi livelli di incantesimi consentiti alla classe.'
        },
        {
          level: 18,
          privilege: 'Magia Trascendente',
          description: 'I tuoi incantesimi diventano più difficili da contrastare e dispellere.'
        },
        {
          level: 19,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 20,
          privilege: 'Ascendenza Sovrannaturale',
          description: 'I tuoi poteri innati raggiungono l’apice.'
        }
      ]
    },
    { nome: "Warlock",
      dadoVita: 8,
      armature: ['leggere'],
      armi: ['semplici'],
      strumenti: [],
      tiriSalvezza: ['saggezza', 'carisma'],
      abilita: [
        'arcano,indagare,inganno,intimidire,natura,religione,storia',
        'arcano,indagare,inganno,intimidire,natura,religione,storia'
      ],
      linguaggi: '',
      equipaggiamento: '(a) un pugnale o (b) una qualsiasi arma semplice; * un\'armatura di cuoio; * una dotazione da studioso; * un componente materiale per incantesimi',
      privilegi: [
        {
          level: 1,
          privilege: 'Patto con il Patrono',
          description: 'Stringi un patto con un’entità; ottieni incantesimi e privilegi.',
          scelta: true
        },
        {
          level: 2,
          privilege: 'Invocazioni Occulte',
          description: 'Ottieni invocazioni che modificano e potenziano le tue capacità.',
          scelta: true
        },
        {
          level: 3,
          privilege: 'Patto (Catena/Lama/Tomo)',
          description: 'Scegli un patto che definisce ulteriormente i tuoi poteri.',
          scelta: true
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 5,
          privilege: 'Misteri Aumentati',
          description: 'Slot di incantesimo più potenti e nuove invocazioni.'
        },
        {
          level: 6,
          privilege: 'Invocazioni Aggiuntive',
          description: 'Ottieni o migliori le tue Invocazioni Occulte.',
          scelta: true
        },
        {
          level: 7,
          privilege: 'Invocazioni Occulte (ulteriori)',
          description: 'Ottieni un’ulteriore Invocazione o migliori una esistente.',
          scelta: true
        },
        {
          level: 8,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 9,
          privilege: 'Potere Occulto Superiore',
          description: 'I tuoi slot di incantesimo aumentano di potenza e durata.'
        },
        {
          level: 10,
          privilege: 'Privilegio del Patrono',
          description: 'Il tuo Patrono conferisce un nuovo privilegio.'
        },
        {
          level: 11,
          privilege: 'Arcanum Mistico (6°)',
          description: 'Ottieni un incantesimo a livello fisso (6°) lanciabile 1/giorno.'
        },
        {
          level: 12,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 13,
          privilege: 'Arcanum Mistico (7°)',
          description: 'Ottieni un incantesimo a livello fisso (7°) lanciabile 1/giorno.'
        },
        {
          level: 14,
          privilege: 'Privilegio del Patrono',
          description: 'Il tuo Patrono conferisce un nuovo privilegio.'
        },
        {
          level: 15,
          privilege: 'Arcanum Mistico (8°)',
          description: 'Ottieni un incantesimo a livello fisso (8°) lanciabile 1/giorno.'
        },
        {
          level: 16,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 17,
          privilege: 'Arcanum Mistico (9°)',
          description: 'Ottieni un incantesimo a livello fisso (9°) lanciabile 1/giorno.'
        },
        {
          level: 18,
          privilege: 'Invocazioni Occulte (maestria)',
          description: 'Ottieni un’ulteriore Invocazione e affini le tue capacità occulte.',
          scelta: true
        },
        {
          level: 19,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 20,
          privilege: 'Arcanum Eldritch',
          description: 'Accedi ad Arcanum di alto livello una volta per riposo lungo.'
        }
      ]
    },
    { nome: "Artefice",
      dadoVita: 8,
      armature: ['leggere', 'medie', 'scudi'],
      armi: ['semplici'],
      strumenti: [],
      tiriSalvezza: ['costituzione', 'intelligenza'],
      abilita: [
        'arcano,indagare,intuizione,medicina,persuasione,intrattenere,inganno,storia',
        'arcano,indagare,intuizione,medicina,persuasione,intrattenere,inganno,storia'
      ],
      linguaggi: '',
      equipaggiamento: '(a) un pugnale o (b) una qualsiasi arma semplice; * una dotazione da studioso; * un componente materiale per incantesimi',
      privilegi: [
        {
          level: 1,
          privilege: 'Tinker e Incantesimi',
          description: 'Competenze con strumenti e accesso a incantesimi da Artificiere.'
        },
        {
          level: 2,
          privilege: 'Infondere Oggetti',
          description: 'Infondi oggetti con poteri magici temporanei.'
        },
        {
          level: 3,
          privilege: 'Specializzazione',
          description: 'Scegli una specializzazione (Alchimista, Artefice da Battaglia, Corazzato).',
          scelta: true
        },
        {
          level: 4,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 5,
          privilege: 'Strumenti Potenziati',
          description: 'Migliori i benefici degli oggetti infusi e delle tue creazioni.'
        },
        {
          level: 6,
          privilege: 'Maestria negli Strumenti',
          description: 'Raddoppi il bonus di competenza con gli strumenti con cui sei competente.'
        },
        {
          level: 7,
          privilege: 'Colpo di Genio',
          description: 'Usa la reazione per aggiungere il tuo mod INT a un TS o prova di un alleato vicino.'
        },
        {
          level: 8,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 9,
          privilege: 'Perito di Oggetti Magici',
          description: 'Più rapido nell’identificare/creare oggetti magici; limiti di sintonia aumentati.'
        },
        {
          level: 10,
          privilege: 'Esperto di Oggetti Magici',
          description: 'Ulteriori miglioramenti nell’uso e nella sintonia con oggetti magici.'
        },
        {
          level: 11,
          privilege: 'Oggetto che Immagazzina Incantesimi',
          description: 'Crei un oggetto che può contenere e rilasciare un incantesimo più volte.'
        },
        {
          level: 12,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 13,
          privilege: 'Infusioni Migliorate',
          description: 'Ottieni nuove infusioni e potenzi le esistenti.'
        },
        {
          level: 14,
          privilege: 'Intenditore di Oggetti Magici',
          description: 'Puoi sintonizzarti a più oggetti magici e ne ignori alcuni prerequisiti.'
        },
        {
          level: 15,
          privilege: 'Progetto Geniale',
          description: 'Un progetto migliora le tue capacità e i tuoi infusi.'
        },
        {
          level: 16,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 17,
          privilege: 'Ingegneria Suprema',
          description: 'Le tue creazioni raggiungono un’efficacia straordinaria.'
        },
        {
          level: 18,
          privilege: 'Maestro di Oggetti Magici',
          description: 'Ulteriori slot di sintonia e maggiore efficacia con gli oggetti.'
        },
        {
          level: 19,
          privilege: 'Incremento Caratteristica',
          description: 'Aumenta di 2 un punteggio di caratteristica o di 1 due punteggi.'
        },
        {
          level: 20,
          privilege: 'Anima dell’Artefice',
          description: 'Aumenti la resilienza aggiungendo INT ai PF e mantieni la sintonia a oggetti in situazioni difficili.'
        },
        {
          level: 20,
          privilege: 'Genio dell’Invenzione',
          description: 'Accesso a creazioni e infusi straordinari.'
        }
      ]
    }
  ] as Classe[],

  sottoclassi: {
    barbaro: {
      "cammino del berserker": [
        {
          level: 3,
          privilege: "frenesia",
          description: "quando entri in ira, puoi scegliere se entrare in frenesia. così il barbaro può effettuare un singolo attacco con arma da mischia come azione bonus durante ciascun tuo turno oltre quello iniziale. al termine, subisci un livello di indebolimento."
        },
        {
          level: 6,
          privilege: "ira incontenibile",
          description: "non puoi essere affascinato o spaventato mentre sei in ira. se sei già affascinato o spaventato mentre entri in ira, l’effetto è sospeso per la durata dell’ira."
        },
        {
          level: 10,
          privilege: "presenza intimidatoria",
          description: "può usare un’azione per provare a spaventare una creatura entro 9m, se fallisce un ts su sag (cd 8 + bc + mod car), resta spaventata fino al tuo prossimo turno. puoi rinnovare l’effetto. cessa se la creatura termina il suo turno fuori dalla visuale o a più di 18m. se la creatura lo supera, sarà immune per 24h."
        },
        {
          level: 14,
          privilege: "ritorsione",
          description: "quando subisci danno da una creatura che si trova entro 1,5 metri da te, puoi usare la tua reazione per effettuare un attacco con arma da mischia contro quella creatura."
        }
      ],
      "cammino dello zelota": [
        {
          level: 3,
          privilege: "furia divina",
          description: "quando il barbaro è in ira e colpisce una creatura con un’arma, gli infligge danni extra pari a 1d6 + metà del livello da barbaro. quando sceglie questo privilegio, sceglie se i danni extra saranno radianti o necrotici."
        },
        {
          level: 3,
          privilege: "guerriero degli dei",
          description: "se una creatura utilizza un incantesimo per riportare in vita il barbaro, non necessita di componenti materiali."
        },
        {
          level: 6,
          privilege: "concentrazione fanatica",
          description: "se il barbaro fallisce un tiro salvezza mentre è in ira, può ritirare il dado ed usare il nuovo risultato. può usare il privilegio solo una volta per ira."
        },
        {
          level: 10,
          privilege: "presenza zelante",
          description: "dopo un riposo lungo, con un’azione bonus il barbaro lancia un urlo infuso di energia divina. fino a 10 creature entro 18m in grado di sentirlo ottengono vantaggio ai tiri per colpire e tiri salvezza fino all’inizio del suo prossimo turno."
        },
        {
          level: 14,
          privilege: "ira imperitura",
          description: "mentre il barbaro è in ira e possiede 0 pf, può rimanere in vita per la durata dell’ira e muore solo se alla fine dell’ira ha ancora 0 pf. deve comunque fare i tiri salvezza contro morte e subisce i normali effetti di chi viene colpito a 0 pf."
        }
      ],
      "cammino del combattente totemico": [
        {
          level: 3,
          privilege: "cercatore di spiriti",
          description: "rituali: percezione delle bestie e parlare con gli animali.; * percezione delle bestie: percepisce attraverso una bestia consenziente.; * parlare con gli animali: comunicazione verbale per 10 minuti con animali, che potrebbero anche farti un favore."
        },
        {
          level: 3,
          privilege: "spirito totemico",
          description: "richiede un oggetto creato con resti animali. durante l’ira, puoi scegliere tra:; * aquila: svantaggio agli attacchi di opportunità contro di te, puoi usare scatto come azione bonus.; * lupo: vantaggio agli attacchi in mischia degli alleati entro 1,5m da te.; * orso: resistenza a tutti i danni eccetto psichici.",
          scelta: true
        },
        {
          level: 6,
          privilege: "aspetto della bestia",
          description: "aquila: vedi dettagli fino a 1,5km, nessun svantaggio in luce fioca.; * lupo: segui tracce a passo veloce, muoviti furtivamente a passo normale.; * orso: raddoppi capacità di carico, vantaggio a spingere, sollevare, trascinare, spezzare oggetti.",
          scelta: true
        },
        {
          level: 10,
          privilege: "viandante spirituale",
          description: "puoi lanciare il rituale 'comunione con la natura', apprendendo fino a 3 aspetti dell’area (entro 4,5km in superficie o 90m nel sottosuolo):; * terreni e acque; * creature (animali, vegetali, celestiali, immondi, non morti, ecc.); * popolazioni; * costruzioni"
        },
        {
          level: 14,
          privilege: "sintonia totemica",
          description: "aquila: puoi volare per brevi tratti alla velocità del cammino.; * lupo: durante l’ira, se colpisci una creatura con un’arma da mischia, puoi usare un’azione bonus per buttarla a terra (taglia grande o inferiore).; * orso: un nemico entro 1,5m ha svantaggio a colpire tutte le creature che non abbiano questo privilegio.",
          scelta: true
        }
      ],
      "guardiano ancestrale": [
        {
          level: 3,
          privilege: "protettori ancestrali",
          description: "quando entri in ira, il primo nemico colpito ha svantaggio contro bersagli diversi da te e le sue vittime hanno resistenza ai danni finché non termina il tuo turno successivo."
        },
        {
          level: 6,
          privilege: "spiriti protettori",
          description: "i tuoi spiriti ancestrali ostacolano la fuga dei nemici che danneggi mentre sei in ira; hanno svantaggio a colpirti se provano a muoversi o teletrasportarsi."
        },
        {
          level: 10,
          privilege: "consultare gli spiriti",
          description: "puoi lanciare *augurio* o *parlare coi morti* come rituale, senza componenti materiali. bonus alle prove di intuizione o persuasione quando usi la saggezza degli spiriti."
        },
        {
          level: 14,
          privilege: "antenati vendicativi",
          description: "quando una creatura danneggia un alleato mentre è soggetta al tuo effetto di protettore ancestrale, subisce danni da forza pari alla metà del tuo livello da barbaro."
        }
      ],
      "araldo della tempesta": [
        {
          level: 3,
          privilege: "aura tempestosa",
          description: "quando entri in ira, attivi un’aura elementale (deserto, mare o tundra). come azione bonus, infliggi effetti diversi in base all’aura."
        },
        {
          level: 6,
          privilege: "aura tempestosa migliorata",
          description: "l’aura attiva effetti passivi per te e chi ti sta vicino (es. vantaggio su ts contro incantesimi, bonus a velocità, resistenza al freddo)."
        },
        {
          level: 10,
          privilege: "anima tempestosa",
          description: "sei immune agli effetti dannosi della tua aura, e puoi estenderne i benefici a un alleato entro 9m."
        },
        {
          level: 14,
          privilege: "tempesta furiosa",
          description: "quando subisci danni da una creatura entro 1,5m, puoi usare la reazione per infliggerle i danni della tua aura."
        }
      ]
    },
    monaco: {
      "via dell’ombra": [
        {
          level: 3,
          privilege: "arti dell’ombra",
          description: "accedi a incantesimi usando punti ki: illusione minore, oscurità, passare senza tracce, scurovisione e silenzio."
        },
        {
          level: 6,
          privilege: "passo dell’ombra",
          description: "in luce fioca o oscurità, puoi teletrasportarti fino a 18m come azione bonus. vantaggio al primo attacco in mischia."
        },
        {
          level: 11,
          privilege: "manto di ombre",
          description: "in luce fioca o oscurità, puoi diventare invisibile con un’azione. l’effetto termina se attacchi, lanci incantesimi o entri in luce intensa."
        },
        {
          level: 17,
          privilege: "opportunista",
          description: "se una creatura entro 1,5m viene colpita da un altro, puoi usare la reazione per attaccarla in mischia."
        }
      ],
      "via della mano aperta": [
        {
          level: 3,
          privilege: "tecnica della mano aperta",
          description: "dopo raffica di colpi, puoi:; * far cadere prono (ts des); * spingere di 4,5m (ts for); * impedire reazioni fino a fine turno."
        },
        {
          level: 6,
          privilege: "integrità del corpo",
          description: "una volta per riposo lungo, puoi usare un’azione per recuperare pf pari al triplo del tuo livello da monaco."
        },
        {
          level: 11,
          privilege: "tranquillità",
          description: "dopo riposo lungo, ottieni l’effetto di *santuario* fino al prossimo riposo lungo. cd = 8 + mod sag + bonus competenza."
        },
        {
          level: 17,
          privilege: "palmo tremante",
          description: "colpo senz’armi con 3 ki: se il bersaglio fallisce ts cos, scende a 0 pf. altrimenti subisce 10d10 danni necrotici. puoi sospendere l’effetto per 1 ora."
        }
      ],
      "via dei quattro elementi": [
        {
          level: 3,
          privilege: "disciplina elementale",
          description: "Conosci la disciplina 'Sintonia Elementale' e un'altra disciplina elementale a scelta che richieda massimo 2 punti Ki per essere lanciata.",
          scelta: true
        },
        {
          level: 3,
          privilege: "magia elementale",
          description: "Non sei obbligato a fornire componenti materiali quando lanci un incantesimo. Se un incantesimo ha la proprietà Livelli Superiori, puoi aumentare la potenza dell'incantesimo spendendo 1 punto Ki aggiuntivo per ogni livello di incantesimo superiore."
        },
        {
          level: 6,
          privilege: "nuova disciplina elementale",
          description: "Impari un'altra disciplina elementale a scelta che richieda massimo 3 punti Ki per essere lanciata.",
          scelta: true
        },
        {
          level: 11,
          privilege: "nuova disciplina elementale",
          description: "Impari un'altra disciplina elementale a scelta che richieda massimo 4 punti Ki per essere lanciata.",
          scelta: true
        },
        {
          level: 17,
          privilege: "nuova disciplina elementale",
          description: "Impari un'altra disciplina elementale a scelta che richieda massimo 6 punti Ki per essere lanciata.",
          scelta: true
        }
      ]
    },
    ladro: {
      "assassino": [
        {
          level: 3,
          privilege: "Competenze bonus",
          description: "Ottiene competenza in trucchi per il camuffamento e nelle sostanze da avvelenatore."
        },
        {
          level: 3,
          privilege: "Assassinare",
          description: "Dispone di vantaggio su chi non ha avuto il turno e ogni attacco a sorpresa diventa un critico."
        },
        {
          level: 9,
          privilege: "Maestro infiltrato",
          description: "Può creare identità fittizie in 7g e 25mo. Stabilire il falso Background."
        },
        {
          level: 13,
          privilege: "Impostore",
          description: "In 3h di studio, diventa abile nell'imitare parlata, calligrafia e il modo di fare di una persona. Per un osservatore casuale diventa impossibile sospettare, qualora qualcuno dovesse avere dei sospetti, ha vantaggio nell'inganno."
        },
        {
          level: 17,
          privilege: "Colpo mortale",
          description: "Quando colpisci una creatura con attacco furtivo, deve superare un TS Cos (CD: 8 +mod DES +BC) altrimenti i danni raddoppiano."
        }
      ],
      "pianificatore": [
        {
          level: 3,
          privilege: "Maestro di intrighi",
          description: "Competenza nei trucchi di camuffamento, arnesi da falsario e un gioco di carte, apprende 2 linguaggi. Inoltre può imitare perfettamente la voce di una creatura che ha sentito parlare per almeno 1 min se conosce la sua lingua."
        },
        {
          level: 3,
          privilege: "Maestro di tattiche",
          description: "Può usare l’aiuto come a bonus. Quando aiuta una creatura ad attaccarne un’altra, il bersaglio può essere entro 9m, purchè possa sentire e vedere il Rogue."
        },
        {
          level: 9,
          privilege: "Manipolatore intuitivo",
          description: "Se trascorre 1 min ad ascoltare una creatura, apprende 2 delle informazioni:; * Punteggio di Intelligenza; * Punteggio di Saggezza; * Punteggio di Carisma; * Livelli di classe; * Può anche scoprire parte della storia o dei tratti caratteriali del bersaglio"
        },
        {
          level: 13,
          privilege: "Fuorviare",
          description: "Se il Rogue viene attaccato e ha un’altra creatura a 1.5m da lui che gli da copertura dall’attacco, può fare in modo che venga bersagliata quest’ultima."
        },
        {
          level: 17,
          privilege: "Anima ingannevole",
          description: "Se bersagliato dalla telepatia, può proiettare falsi pensieri. Contrappone Inganno con Intuizione di chi prova a leggergli i pensieri. Il Rogue non può essere obbligato a dire la verità con la magia, anche quando mente, risulta dire la verità."
        }
      ],
      "furfante": [
        {
          level: 3,
          privilege: "Mani veloci",
          description: "Azione bonus, fare tiro in Rapidità di Mano, per usare gli arnesi (disattivare trappole, aprire serrature) o per utilizzare un oggetto."
        },
        {
          level: 3,
          privilege: "Lavoro al 2° piano",
          description: "Scalare non gli costa più un movimento extra ed è più veloce, il salto con rincorsa aumenta di 30cm ⋅mod DES."
        },
        {
          level: 9,
          privilege: "Furtività suprema",
          description: "Dispone di vantaggio in furtività se si muove a metà della velocità."
        },
        {
          level: 13,
          privilege: "Usare oggetti magici",
          description: "Ignora i requisiti di classe, razza e livelli quando usa gli oggetti magici."
        },
        {
          level: 17,
          privilege: "Riflessi da Furfante",
          description: "Diventa abile a tendere imboscate e sfuggire. Può fare 2 turni al primo round di ogni combattimento. Il secondo round ha iniziativa -10."
        }
      ],
      "fantasma": [
        {
          level: 3,
          privilege: "Sussurri dei non morti",
          description: "Dopo un riposo, può ottenere competenza in uno strumento o abilità che non gli appartiene. Perde la competenza quando reitera questo privilegio scegliendone un’altra."
        },
        {
          level: 3,
          privilege: "Lamenti dalla tomba",
          description: "Dopo un attacco accurato, sceglie un altra creatura entro 9m dal primo bersaglio. Quella creatura subisce danni necrotici pari alla metà dei dadi dell’attacco accurato. Dopo un riposo lungo, può utilizzare questo privilegio per un numero di volte pari al BC."
        },
        {
          level: 9,
          privilege: "Pegni dei defunti",
          description: "Quando una creatura muore in sua presenza, può utilizzare la sua reazione per creare un oggetto minuscolo e averne una quantità pari al BC.; * Se ha un pegno, ha vantaggio ai TS contro morte e su Costituzione; * Quando fa un Attacco Accurato, può spendere un pegno per usare subito ‘Lamenti della tomba’ spendere l’utilizzo di questo privilegio; * Con un azione, può spendere un pegno, dovunque sia, per interrogare l’anima a cui era legato"
        },
        {
          level: 13,
          privilege: "Cammino fantasma",
          description: "Dopo un riposo lungo o spendendo un pegno, con l’a bonus assume la forma spettrale per 10m. Ottiene velocità di volo di 3m, i TpC contro di lui hanno svantaggio, può muoversi dentro altri corpi come terreno difficile, ma subisce d10 danni se termina lì dentro il turno."
        },
        {
          level: 17,
          privilege: "Compagno della morte",
          description: "Quando utilizza ‘Lamenti dalla tomba’ può infliggere danni necrotici ad entrambe le creature colpite.; * Se non ha pegni dopo un riposo lungo, ne ottiene uno"
        }
      ],
      "lama spirituale": [
        {
          level: 3,
          privilege: "potere psionico",
          description: "dispone di un numero di dadi di energia psionica (d6) pari al doppio del bonus competenza (BC). Recupera i dadi dopo un riposo lungo. Con un’azione bonus dopo un riposo lungo, può recuperare un dado psionico."
        },
        {
          level: 3,
          privilege: "abilità psico-rinforzata",
          description: "se fallisce una prova in cui è competente, può aggiungere il dado psionico al risultato. Se la prova fallisce comunque, il dado non è speso."
        },
        {
          level: 3,
          privilege: "sussurri psichici",
          description: "può comunicare telepaticamente con creature entro 1km e a vista, in numero pari al BC. Spende il dado psionico solo dopo il primo utilizzo. La comunicazione dura un numero di ore pari al risultato del dado. Non è necessaria una lingua comune."
        },
        {
          level: 3,
          privilege: "lame psichiche",
          description: "può evocare una lama psichica (arma semplice, accurata, da lancio, gittata 18m). Infligge 1d6 danni psichici + modificatore. Scompare dopo l’attacco. Se ha una mano libera, può usare un’azione bonus per un secondo attacco (1d4 + modificatore)."
        },
        {
          level: 5,
          privilege: "potere psionico potenziato",
          description: "il dado psionico diventa un d8."
        },
        {
          level: 9,
          privilege: "lame dell’anima",
          description: "Colpi guidati: se fallisce un tiro per colpire, può aggiungere il dado psionico. Lo spende solo se colpisce.; * Teletrasporto psichico: si teletrasporta in uno spazio libero entro 3m × il risultato del dado."
        },
        {
          level: 11,
          privilege: "potere psionico avanzato",
          description: "il dado psionico diventa un d10."
        },
        {
          level: 13,
          privilege: "velo psichico",
          description: "dopo un riposo lungo o spendendo un dado psionico, può diventare invisibile con un’azione. L’effetto dura 1 ora o finché infligge danni o costringe a un tiro salvezza."
        },
        {
          level: 17,
          privilege: "potere psionico massimo",
          description: "il dado psionico diventa un d12."
        },
        {
          level: 17,
          privilege: "squarciare la mente",
          description: "dopo un riposo lungo o spendendo un dado psionico, se colpisce con un attacco accurato una creatura che fallisce un TS Saggezza (CD 8 + BC + mod Des), essa è stordita per 1 minuto (ripete il TS alla fine di ogni turno)."
        }
      ],
      "mistificatore arcano": [
        {
          level: 3,
          privilege: "incantesimi",
          description: "impara 'Mano magica', 2 trucchi e 3 incantesimi di ammaliamento o illusione da mago. Usa Intelligenza come caratteristica da incantatore. CD TS = 8 + BC + Int. Recupera gli slot con un riposo lungo.",
          scelta: true
        },
        {
          level: 3,
          privilege: "mano magica migliorata",
          description: "la mano magica può diventare invisibile e usare 'azione scaltra'. Può riporre oggetti nelle tasche, borseggiare o usare arnesi da scasso. Non può essere scoperta se supera una prova contrapposta (rapidità di mano vs percezione)."
        },
        {
          level: 9,
          privilege: "imboscata magica",
          description: "se lancia un incantesimo mentre è nascosto, il bersaglio ha svantaggio ai tiri salvezza contro l’incantesimo."
        },
        {
          level: 13,
          privilege: "ingannatore versatile",
          description: "può designare una creatura entro 1,5m dalla mano magica. Ha vantaggio ai tiri per colpire contro quella creatura nel suo turno."
        },
        {
          level: 17,
          privilege: "ladro di incantesimi",
          description: "se è bersaglio di un incantesimo di 1° livello, può usare la reazione per costringere l’incantatore a un TS (CD = mod incantatore). Se fallisce, l’incantesimo è annullato e il ladro può lanciarlo entro 8 ore."
        }
      ],
      "esploratore": [
        {
          level: 3,
          privilege: "schermagliatore",
          description: "quando un nemico termina il turno entro 1,5m, può usare la reazione per muoversi della metà della velocità senza provocare attacchi di opportunità."
        },
        {
          level: 3,
          privilege: "survivalista",
          description: "ottiene competenza in Natura e Sopravvivenza; il BC è raddoppiato per queste prove.",
          scelta: true
        },
        {
          level: 9,
          privilege: "mobilità superiore",
          description: "la velocità aumenta di 3 metri."
        },
        {
          level: 13,
          privilege: "maestro di imboscate",
          description: "ha vantaggio all’iniziativa. La prima creatura che colpisce nel suo primo turno fornisce vantaggio ai tiri per colpire degli alleati contro di essa fino al suo prossimo turno."
        },
        {
          level: 17,
          privilege: "colpo improvviso",
          description: "se attacca una creatura, può usare l’azione bonus per fare un attacco aggiuntivo. Se colpisce due creature diverse, può usare attacco accurato anche se lo ha già usato quel turno."
        }
      ]
    },
    guerriero: {
      "maestro di battaglia": [
        {
          level: 3,
          privilege: "studioso di guerra",
          description: "ottiene competenza in uno strumento da artigiano (es. alchimista, costruttore, fabbro, inventore, tessitore, cuoco).",
          scelta: true
        },
        {
          level: 3,
          privilege: "superiorità",
          description: "apprende 3 manovre e ottiene 4d8 dadi di superiorità. I dadi si recuperano con un riposo. CD dei tiri salvezza = 8 + BC + For o Des.",
          scelta: true
        },
        {
          level: 7,
          privilege: "conosci il tuo nemico",
          description: "se stai osservando una creatura entro 1,5m fuori dal combattimento per almeno 1 minuto, puoi apprendere 2 delle seguenti informazioni:; * FOR; * DES; * COS; * CA; * PF; * livello totale o livello da guerriero."
        },
        {
          level: 7,
          privilege: "superiorità migliorata",
          description: "+2 manovre conosciute. Dadi di superiorità aumentano a 5d8.",
          scelta: true
        },
        {
          level: 10,
          privilege: "superiorità migliorata",
          description: "+2 manovre conosciute. Dadi di superiorità restano 5d8.",
          scelta: true
        },
        {
          level: 15,
          privilege: "implacabile",
          description: "se inizi un combattimento (inizio del turno) senza dadi di superiorità, ne recuperi 1 automaticamente."
        },
        {
          level: 15,
          privilege: "superiorità migliorata",
          description: "+2 manovre conosciute. Dadi di superiorità diventano 6d10.",
          scelta: true
        },
        {
          level: 18,
          privilege: "superiorità migliorata",
          description: "dadi di superiorità diventano 6d12.",
          scelta: true
        }
      ],
      "campione": [
        {
          level: 3,
          privilege: "critico migliorato",
          description: "i tuoi attacchi con arma infliggono colpo critico con un tiro di 19 o 20."
        },
        {
          level: 7,
          privilege: "atleta straordinario",
          description: "il salto in corsa aumenta di 30 cm × mod For. Se non sei competente in una prova su For, Des o Cos, aggiungi metà del BC (arrotondato per difetto)."
        },
        {
          level: 10,
          privilege: "secondo stile di combattimento",
          description: "scegli un secondo stile di combattimento.",
          scelta: true
        },
        {
          level: 15,
          privilege: "critico migliorato",
          description: "i tuoi attacchi con arma infliggono colpo critico con un tiro di 18–20."
        },
        {
          level: 18,
          privilege: "sopravvissuto",
          description: "se hai più della metà dei tuoi PF massimi, recuperi 5 + mod COS PF all’inizio di ogni tuo turno."
        }
      ],
      "cavaliere mistico": [
        {
          level: 3,
          privilege: "incantesimi",
          description: "impara 2 trucchetti da mago e un altro al livello 10. Ai livelli 3, 8, 14 e 20 apprende un incantesimo da qualsiasi scuola. Gli altri devono essere di Invocazione o Abiurazione. CD TS = 8 + BC + Int. Attacchi con incantesimi: d20 + BC + Int.",
          scelta: true
        },
        {
          level: 3,
          privilege: "arma vincolata",
          description: "può legare fino a 2 armi tramite un rituale di 1 ora (anche durante un riposo breve). Può evocarle nella propria mano con un’azione bonus. Può essere disarmato solo se è incapacitato.",
          scelta: true
        },
        {
          level: 7,
          privilege: "magia da guerra",
          description: "quando lancia un trucchetto, può effettuare un attacco con arma usando un’azione bonus."
        },
        {
          level: 10,
          privilege: "colpo mistico",
          description: "se attacca una creatura e nel turno successivo lancia un incantesimo contro di essa, ha svantaggio al tiro salvezza."
        },
        {
          level: 15,
          privilege: "carica arcana",
          description: "quando usa 'azione impetuosa', può teletrasportarsi fino a 9 metri in uno spazio libero che può vedere."
        },
        {
          level: 17,
          privilege: "magia da guerra migliorata",
          description: "può effettuare un attacco con arma come azione bonus anche dopo aver lanciato un incantesimo (non solo un trucchetto)."
        }
      ],
      "cavaliere errante": [
        {
          level: 3,
          privilege: "competenze bonus",
          description: "ottiene competenza in Addestrare Animali, Intrattenere, Intuizione, Persuasione o Storia. In alternativa, può scegliere un linguaggio.",
          scelta: true
        },
        {
          level: 3,
          privilege: "nato in sella",
          description: "ha vantaggio ai tiri salvezza per non essere disarcionato. Se cade da 1,5m o meno, atterra in piedi (se non è incapacitato). Montare o smontare da una cavalcatura costa solo 1,5m di movimento."
        },
        {
          level: 3,
          privilege: "marchio incrollabile",
          description: "quando colpisce con un’arma da mischia, può marchiare il bersaglio (uno alla volta). Il bersaglio ha svantaggio ai TpC contro creature diverse dal guerriero, se entro 1,5m da lui. Se infligge danni nonostante lo svantaggio, il guerriero può usare un’azione bonus nel suo turno successivo per un attacco aggiuntivo che infligge danni extra pari alla metà del livello da guerriero. Può usare questa reazione un numero di volte pari al mod FOR per riposo lungo."
        },
        {
          level: 7,
          privilege: "manovra protettrice",
          description: "se impugna un’arma da mischia o uno scudo e una creatura entro 1,5m subisce un attacco, può usare la reazione per aggiungere 1d8 alla CA di quella creatura e conferirle resistenza ai danni subiti. Può farlo un numero di volte pari al modificatore di COS per riposo lungo."
        },
        {
          level: 10,
          privilege: "mantenere la posizione",
          description: "se una creatura si muove di almeno 1,5m all’interno della sua portata, provoca un attacco di opportunità. Se colpisce, la velocità della creatura diventa 0 fino alla fine del turno."
        },
        {
          level: 15,
          privilege: "carica feroce",
          description: "una volta per turno, se si muove in linea retta di almeno 3m e colpisce subito una creatura, quest’ultima deve superare un TS su FOR (CD 8 + BC + mod FOR) o cade prona."
        },
        {
          level: 18,
          privilege: "difensore vigile",
          description: "ottiene una reazione speciale da usare una volta per turno di ogni creatura, ma solo per effettuare attacchi di opportunità."
        }
      ]
    },
    ranger: {
      "Cacciatore": [
        {
          level: 3,
          privilege: "Preda del cacciatore",
          description: "Scegli un'opzione tra le seguenti:",
          scelta: true
        },
        {
          level: 3,
          privilege: "Uccisore di Giganti",
          description: "Quando una creatura di taglia Grande o maggiore entro 1,5 metri da te ti attacca, puoi usare la tua reazione per attaccare immediatamente quella creatura dopo il suo attacco, purché tu possa vedere la creatura."
        },
        {
          level: 3,
          privilege: "Devastatore dell’Orda",
          description: "Una volta durante ciascun tuo turno in cui effettui un attacco con arma, puoi effettuare un altro attacco con la stessa arma contro una creatura diversa che sia entro 1,5 metri dal bersaglio originale e entro la gittata della tua arma."
        },
        {
          level: 3,
          privilege: "Sterminatore di Colossi",
          description: "Quando colpisci una creatura con un attacco con arma, la creatura subisce 1d8 danni aggiuntivi se non è al massimo dei suoi punti ferita. Puoi infliggere questo danno aggiuntivo solo una volta per turno."
        },
        {
          level: 9,
          privilege: "Tattiche difensive",
          description: "Scegli un'opzione tra le seguenti:",
          scelta: true
        },
        {
          level: 9,
          privilege: "Difesa dal Multiattacco",
          description: "Quando una creatura ti colpisce con un attacco, ottieni un bonus di +4 alla CA contro tutti gli attacchi successivi effettuati da quella creatura per il resto del turno."
        },
        {
          level: 9,
          privilege: "Sfuggire all’Orda",
          description: "Gli attacchi di opportunità effettuati contro di te hanno svantaggio."
        },
        {
          level: 9,
          privilege: "Volontà di Acciaio",
          description: "Hai vantaggio sui tiri salvezza contro l’essere spaventato."
        },
        {
          level: 13,
          privilege: "Multiattacco",
          description: "Scegli un'opzione tra le seguenti:",
          scelta: true
        },
        {
          level: 13,
          privilege: "Attacco Turbinante",
          description: "Puoi usare la tua azione per effettuare un attacco da mischia contro un qualsiasi numero di creature entro 1,5 metri da te, effettuando un tiro per colpire separato per ogni bersaglio."
        },
        {
          level: 13,
          privilege: "Raffica",
          description: "Puoi usare la tua azione per effettuare un attacco a distanza contro un qualsiasi numero di creature entro 3 metri da un punto che puoi vedere e che sia entro la gittata della tua arma. Devi avere munizioni sufficienti per tutti i bersagli, ed effettui un tiro per colpire separato per ciascuno di loro."
        },
        {
          level: 17,
          privilege: "Difesa superiore",
          description: "Scegli un'opzione tra le seguenti:",
          scelta: true
        },
        {
          level: 17,
          privilege: "Elusione",
          description: "Quando sei vittima di un effetto che permette un tiro salvezza su Destrezza per dimezzare i danni, non subisci danni se superi il tiro salvezza, e solo la metà dei danni se lo fallisci."
        },
        {
          level: 17,
          privilege: "Opporsi alla Marea",
          description: "Quando una creatura ostile ti manca con un attacco in mischia, puoi usare la tua reazione per obbligare quella creatura a ripetere lo stesso attacco contro un’altra creatura (che non sia se stessa) di tua scelta."
        },
        {
          level: 17,
          privilege: "Schivata Prodigiosa",
          description: "Quando un attaccante che puoi vedere ti colpisce con un attacco, puoi usare la tua reazione per dimezzare il danno dell’attacco effettuato contro di te."
        }
      ],
      "Signore delle bestie": [
        {
          level: 3,
          privilege: "Compagno Animale",
          description: "Dopo un riposo lungo o usando uno slot magico, puoi evocare una bestia. Puoi scegliere la sua forma in base al territorio (Terra, Aria, Acqua). In combattimento ha la stessa iniziativa del Ranger e comincia il turno subito dopo di lui. Può muoversi e usare la reazione autonomamente, ma l'unica azione che ha è la schivata, a meno che il Ranger non ordini altro con un'azione bonus. Se il Ranger è incapacitato, la bestia può agire autonomamente. Se la bestia muore da meno di un'ora, puoi spendere un’azione e uno slot per resuscitarla dopo 1 minuto con tutti i PF."
        },
        {
          level: 7,
          privilege: "Addestramento straordinario",
          description: "La bestia compagnia può usare Scatto, Disimpegno o Aiuto senza l'azione bonus del Ranger. Gli attacchi della bestia diventano magici."
        },
        {
          level: 13,
          privilege: "Furia bestiale",
          description: "Se il Ranger ordina alla sua bestia di effettuare l’azione di Attacco, questa può effettuare due attacchi."
        },
        {
          level: 17,
          privilege: "Condividere incantesimi",
          description: "Se il Ranger si lancia un incantesimo su se stesso, può influenzare la bestia compagnia, purché essa si trovi entro 9 metri da lui."
        }
      ],
      "Cacciatore delle tenebre": [
        {
          level: 3,
          privilege: "Predatore del terrore",
          description: "Aggiungi il modificatore di Saggezza al tiro d'iniziativa. All’inizio del tuo primo turno, la velocità di camminata aumenta di 3m. Se usi l’azione di attacco, puoi fare un attacco aggiuntivo in quell’azione e, se colpisci, infliggi 1d8 danni aggiuntivi."
        },
        {
          level: 3,
          privilege: "Vista ombrosa",
          description: "Ottieni scurovisione 18m (se già presente, aumenta di 6m). Se sei nell’oscurità, sei invisibile alle creature che usano scurovisione per scovarti."
        },
        {
          level: 3,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Camuffare se stesso."
        },
        {
          level: 5,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Trucco della corda."
        },
        {
          level: 7,
          privilege: "Mente ferrea",
          description: "Diventi competente nei tiri salvezza su Saggezza. Se già competente, scegli Carisma o Intelligenza per ottenere competenza.",
          scelta: true
        },
        {
          level: 9,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Paura."
        },
        {
          level: 11,
          privilege: "Raffica del cacciatore",
          description: "Una volta a turno, quando manchi una creatura con un attacco, puoi ripetere l’attacco."
        },
        {
          level: 13,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Invisibilità superiore."
        },
        {
          level: 15,
          privilege: "Schivata oscura",
          description: "Quando una creatura sta per attaccarti e non ha vantaggio nei tiri per colpire, puoi usare la tua reazione per dargli svantaggio ai tiri per colpire."
        },
        {
          level: 17,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Sembrare."
        }
      ],
      "Compagno draconico": [
        {
          level: 3,
          privilege: "Compagno draconico",
          description: "Dopo un riposo lungo o usando uno slot magico, puoi evocare un drago di taglia Piccola, non ancora in grado di volare. Puoi scegliere la sua essenza (Acido, Freddo, Fulmine, Fuoco, Veleno), a cui sarà immune, e la forma estetica. In combattimento ha la stessa iniziativa del Ranger e comincia il turno subito dopo di lui. Può muoversi e usare la reazione autonomamente, ma l'unica azione che ha è la schivata, a meno che il Ranger non ordini altro con un'azione bonus. Se il Ranger è incapacitato, il drago può agire autonomamente. Se uno dei due muore, il drago svanisce, lasciando cadere ciò che trasportava."
        },
        {
          level: 3,
          privilege: "Dono draconico",
          description: "Impari il linguaggio draconico, oppure scegli una lingua a piacimento.",
          scelta: true
        },
        {
          level: 7,
          privilege: "Taglia",
          description: "Il drago diventa di taglia Media."
        },
        {
          level: 7,
          privilege: "Legame",
          description: "Appaiono delle ali che gli danno una velocità di volo pari a quella di camminata. Scegli uno dei seguenti benefici:; * Cavalcatura (puoi cavalcarlo senza volare se sei di taglia Media o inferiore); * Zanna magica (il morso del drago infligge +1d6 danni dell’elemento del drago); * Resistenza (sei resistente ai danni dell’elemento del drago).",
          scelta: true
        },
        {
          level: 11,
          privilege: "Soffio",
          description: "Tu e il drago potete esalare un soffio in un cono di 18m. Le creature nell’area devono superare un tiro salvezza su Destrezza o subire 8d6 danni dell’elemento (metà se riescono). Puoi usare questa abilità dopo un riposo lungo o spendendo uno slot di livello 3."
        },
        {
          level: 15,
          privilege: "Taglia",
          description: "Il drago diventa di taglia Grande e può volare mentre lo cavalchi."
        },
        {
          level: 15,
          privilege: "Soffio",
          description: "I danni del soffio aumentano a 10d6."
        },
        {
          level: 15,
          privilege: "Legame perfezionato",
          description: "Essenza dragonica: i danni dell’elemento aumentano di 2d6.; * Resistenza fulminea: quando tu o il drago subite danni, puoi usare una reazione per rendervi resistenti a quel tipo di danno. Puoi usare questa abilità un numero di volte pari al tuo bonus di competenza, recuperandole dopo un riposo lungo.",
          scelta: true
        }
      ],
      "Padrone degli sciami": [
        {
          level: 3,
          privilege: "Sciame di spiriti",
          description: "Puoi evocare uno sciame di spiriti (uccelli, fatine o insetti) che si muove nel tuo spazio. Quando colpisci una creatura:; * aggiungi 1d6 danni perforanti; * puoi spostarti di 1,5m; * se il bersaglio fallisce un tiro salvezza su Forza, viene spinto di 4,5m."
        },
        {
          level: 3,
          privilege: "Incantesimi",
          description: "Impari gli incantesimi Mano magica e Luminescenza."
        },
        {
          level: 5,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Ragnatela."
        },
        {
          level: 9,
          privilege: "Concentrare lo sciame",
          description: "Con un'azione bonus, ottieni velocità di fluttuare pari a 3m per 1 minuto o fino a quando sei incapacitato. Puoi usare questa abilità un numero di volte pari al tuo bonus di competenza, recuperandole dopo un riposo lungo."
        },
        {
          level: 9,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Forma gassosa."
        },
        {
          level: 9,
          privilege: "Sciame potenziato",
          description: "Potenziamento di 'Sciame di spiriti':; * i danni perforanti diventano 1d8; * puoi spostarti di 1,5m e ottieni mezza copertura; * se il bersaglio fallisce un tiro salvezza su Forza, viene spinto di 4,5m e cade prono."
        },
        {
          level: 13,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Occhio arcano."
        },
        {
          level: 15,
          privilege: "Disperdere lo sciame",
          description: "Quando subisci danni, puoi usare la reazione per diventare resistente a quel danno e teletrasportarti in uno spazio non occupato entro 9m. Puoi usare questa abilità un numero di volte pari al tuo bonus di competenza, recuperandole dopo un riposo lungo."
        },
        {
          level: 17,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Piaga di insetti."
        }
      ],
      "Uccisore di mostri": [
        {
          level: 3,
          privilege: "Sensi da cacciatore",
          description: "Puoi spendere un’azione per scrutare una creatura entro 18m. Apprendi le sue immunità, resistenze e vulnerabilità. Se protetta da incantesimi di divinazione, capisci che non ha immunità, resistenze o vulnerabilità. Puoi usare questa abilità un numero di volte pari al modificatore di Saggezza, recuperandole dopo un riposo lungo."
        },
        {
          level: 3,
          privilege: "Preda dell’uccisore",
          description: "Con un'azione bonus, puoi marchiare una creatura entro 18m. La prima volta per turno che la colpisci con un’arma, infliggi 1d6 danni aggiuntivi. Il marchio termina dopo un riposo breve/lungo o se marchi un'altra creatura."
        },
        {
          level: 3,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Protezione dal bene e dal male."
        },
        {
          level: 5,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Zona di verità."
        },
        {
          level: 7,
          privilege: "Difesa soprannaturale",
          description: "Se il bersaglio di 'Preda dell’uccisore' ti costringe a fare un tiro salvezza o una prova, aggiungi 1d6 al tiro."
        },
        {
          level: 9,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Cerchio magico."
        },
        {
          level: 11,
          privilege: "Nemesi degli incantatori",
          description: "Dopo un riposo breve o lungo, quando vedi una creatura lanciare un incantesimo o teletrasportarsi entro 18m, puoi usare la reazione per farle fare un tiro salvezza su Saggezza. Se fallisce, l'effetto è annullato e sprecato."
        },
        {
          level: 13,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Esilio."
        },
        {
          level: 15,
          privilege: "Contrattacco dell’uccisore",
          description: "Se il bersaglio di 'Preda dell’uccisore' ti costringe a fare un tiro salvezza, puoi usare la reazione per attaccarlo con un’arma prima del tiro. Se colpisci, superi automaticamente il tiro salvezza."
        },
        {
          level: 17,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Blocca mostri."
        }
      ],
      "Vagabondo fatato": [
        {
          level: 3,
          privilege: "Colpi di terrore",
          description: "Una volta per turno, quando colpisci un bersaglio, infliggi 1d4 danni psichici extra."
        },
        {
          level: 3,
          privilege: "Fascino ultraterreno",
          description: "Aggiungi il modificatore di Saggezza alle prove di Carisma e ottieni competenza in una tra Intrattenere, Persuasione o Inganno.",
          scelta: true
        },
        {
          level: 3,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Charme su persone."
        },
        {
          level: 5,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Charme su persone."
        },
        {
          level: 7,
          privilege: "Invertire l’ascendente",
          description: "Hai vantaggio sui tiri salvezza contro l’essere affascinato o spaventato. Se una creatura entro 36m supera un tiro salvezza contro affascinamento o spavento, puoi usare la reazione per rivoltare l’effetto contro chi lo ha lanciato. Il bersaglio ripete il tiro salvezza alla fine di ogni turno."
        },
        {
          level: 9,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Dissolvi magia."
        },
        {
          level: 11,
          privilege: "Rinforzi fatati",
          description: "Dopo un riposo lungo, puoi lanciare 'Convoca Fatato' senza componenti materiali. Puoi modificare l'incantesimo per non richiedere concentrazione, ma dura solo 1 minuto."
        },
        {
          level: 11,
          privilege: "Colpi di terrore",
          description: "I danni psichici aumentano a 1d6."
        },
        {
          level: 13,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Porta dimensionale."
        },
        {
          level: 15,
          privilege: "Camminatore velato",
          description: "Dopo un riposo lungo, puoi lanciare 'Passo velato' senza consumare slot, per un numero di volte pari al modificatore di Saggezza. Puoi portare con te una creatura consenziente entro 1,5m."
        },
        {
          level: 17,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Fuorviare."
        }
      ],
      "Viandante dell’orizzonte": [
        {
          level: 3,
          privilege: "Individua portale",
          description: "Dopo un riposo, con un’azione, puoi individuare direzione e distanza di un portale entro 1,5km."
        },
        {
          level: 3,
          privilege: "Guerriero planare",
          description: "Con un'azione bonus, scegli una creatura entro 9m. Quando la colpisci, infliggi 1d8 danni da forza."
        },
        {
          level: 3,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Protezione dal bene e dal male."
        },
        {
          level: 5,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Passo velato."
        },
        {
          level: 7,
          privilege: "Passo etereo",
          description: "Con un'azione bonus, puoi lanciare 'Forma Eterea' senza spendere slot, ma l'effetto termina alla fine del turno."
        },
        {
          level: 9,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Velocità."
        },
        {
          level: 11,
          privilege: "Colpire distante",
          description: "Quando usi l’azione di attacco, puoi teletrasportarti di 3m in uno spazio libero a vista. Se attacchi due creature, ottieni un attacco extra contro una terza."
        },
        {
          level: 11,
          privilege: "Guerriero planare",
          description: "I danni da forza aumentano a 2d8."
        },
        {
          level: 13,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Esilio."
        },
        {
          level: 15,
          privilege: "Difesa spettrale",
          description: "Puoi usare la reazione per ottenere resistenza a tutti i danni dell’attacco in quel turno."
        },
        {
          level: 17,
          privilege: "Incantesimi",
          description: "Impari l'incantesimo Cerchio di teletrasporto."
        }
      ]
    },
    paladino: {
      "Giuramento di devozione": [
        {
          level: 3,
          privilege: "Aura di devozione",
          description: "Il paladino e le creature amiche entro 3m da lui non possono essere affascinate finché il paladino è cosciente."
        },
        {
          level: 3,
          privilege: "Incantesimi conosciuti (livello 1)",
          description: "Protezione dal bene e dal male (azione, contatto, concentrazione 10 minuti): una creatura consenziente affascinata, posseduta o spaventata da aberrazioni, celestiali, elementali, folletti, immondi o non morti ha vantaggio nei tiri salvezza; se non è sotto effetto, diventa immune per la durata.; * Santuario (azione bonus, 9m, 1 minuto): se una creatura protetta viene attaccata, l’attaccante deve superare un TS su Saggezza o attacca un altro bersaglio o perde l’attacco.",
          scelta: true
        },
        {
          level: 6,
          privilege: "Incantesimi conosciuti (livello 2)",
          description: "Ristorare inferiore (azione, contatto, istantanea): termina le condizioni accecato, assordato, avvelenato o paralizzato.; * Zona di verità (azione, 18m, concentrazione 10 minuti): creature che falliscono un TS Carisma non possono mentire; l’incantatore sa chi ha fallito.",
          scelta: true
        },
        {
          level: 7,
          privilege: "Aura di devozione",
          description: "Le creature entro 3m dal paladino non possono essere affascinate finché è cosciente."
        },
        {
          level: 9,
          privilege: "Incantesimi conosciuti (livello 3)",
          description: "Dissolvi magia (azione, 36m, istantanea): termina incantesimi di livello inferiore a 4; quelli di livello 4 richiedono una prova caratteristica.; * Faro di speranza (azione, 9m, concentrazione 1 minuto): bersagli scelti hanno vantaggio in tiri salvezza su Saggezza, contro la morte e recuperano il massimo da ogni guarigione. Inoltre, per 8 ore rende fertile un’area di 750m, producendo il doppio del raccolto.",
          scelta: true
        },
        {
          level: 13,
          privilege: "Incantesimi conosciuti (livello 4)",
          description: "Guardiano della fede (azione, 9m, 8 ore): compare un guardiano spettrale con spada e scudo; ogni nemico entro 3m deve superare un TS Destrezza o subisce 20 danni radiosi (10 se lo supera).; * Libertà di movimento (azione, contatto, concentrazione 1 ora): la creatura toccata è immune a terreno difficile, paralisi, trattenimento, rallentamento da incantesimi e può spendere 1,5m per sfuggire a manette o placcaggi.",
          scelta: true
        },
        {
          level: 15,
          privilege: "Purezza di spirito",
          description: "Il paladino è sempre sotto l'effetto dell’incantesimo Protezione dal bene e dal male."
        },
        {
          level: 17,
          privilege: "Incantesimi conosciuti (livello 5)",
          description: "Colpo infuocato (azione, 18m, istantanea): cilindro di 3mx12m; chi fallisce un TS Destrezza subisce 4d6 danni fuoco e 4d6 radiosi (metà se lo supera).; * Comunione (1 minuto, incantatore, 1 minuto): contatta una divinità o un suo emissario e può porre 3 domande con risposta 'sì', 'no' o 'incerto'; se la domanda va contro gli interessi della divinità, può rispondere con brevi frasi.",
          scelta: true
        },
        {
          level: 20,
          privilege: "Nube sacra",
          description: "Luce intensa per 9m e fioca per altri 9m per ogni riposo lungo. I non morti e gli immondi che iniziano il turno nell’area subiscono 10 danni radiosi. Se lanciano incantesimi contro il paladino, questi ha vantaggio nei tiri salvezza."
        }
      ],
      "Giuramento degli antichi": [
        {
          level: 3,
          privilege: "Incantesimi conosciuti (livello 1)",
          description: "Colpo intrappolante (azione, 27m, concentrazione 1 minuto): quadrato di 6m diventa terreno difficile; chi è dentro deve superare un TS Forza o è trattenuto. La vittima può tentare un TS ogni azione bonus.; * Parlare con gli animali (azione, incantatore, concentrazione 10 minuti): l’incantatore può comunicare con animali e ottenere informazioni in base alla loro percezione.",
          scelta: true
        },
        {
          level: 3,
          privilege: "Incanalare divinità",
          description: "Collera della natura: rampicanti intrappolano un nemico a vista entro 3m; richiede TS Forza o Destrezza.; * Scacciare gli infedeli: folletti o immondi entro 9m devono superare un TS Saggezza; in caso di fallimento, devono allontanarsi il più possibile per 1 minuto o finché non subiscono danni. Se sotto incantesimo, l’azione lo rompe.",
          scelta: true
        },
        {
          level: 5,
          privilege: "Incantesimi conosciuti (livello 2)",
          description: "Bagliore lunare (azione, 36m, concentrazione 1 minuto): cilindro di 1,5mx12m; chi fallisce un TS Costituzione subisce 2d10×(slot-2) danni radiosi (metà se lo supera). I mutaforma hanno svantaggio e assumono la forma originale. Può essere spostato con un’azione bonus (max 18m).; * Passo velato (azione bonus, istantanea): si teletrasporta di massimo 9m in uno spazio libero a vista, avvolto da foschia argentata.",
          scelta: true
        },
        {
          level: 7,
          privilege: "Aura di interdizione",
          description: "Le creature amiche entro 9m sono resistenti ai danni."
        },
        {
          level: 9,
          privilege: "Incantesimi conosciuti (livello 3)",
          description: "Crescita vegetale (azione o 8 ore, 45m, istantanea): durante un’azione, i vegetali crescono (spendono 120cm per ogni 30cm). Può escludere aree.; * Protezione dall'energia (azione, contatto, concentrazione 1 ora): una creatura consenziente diventa resistente a un tipo di danno specifico.",
          scelta: true
        },
        {
          level: 13,
          privilege: "Incantesimi conosciuti (livello 4)",
          description: "Pelle di pietra (azione, contatto, concentrazione 1 ora): una creatura consenziente diventa resistente ai danni da armi non magiche.; * Tempesta di ghiaccio (azione, 90m, istantanea): cilindro di 6mx12m; chi fallisce un TS Destrezza subisce 2d8+(liv-4) danni contundenti e 4d6 da freddo (metà se lo supera). Il terreno diventa difficile fino al prossimo turno dell’incantatore.",
          scelta: true
        },
        {
          level: 15,
          privilege: "Sentinella imperitura",
          description: "Dopo un riposo lungo, se il paladino arriva a 0 PF e non subisce ulteriori danni, recupera 1 punto ferita. Non subisce danni da vecchiaia."
        },
        {
          level: 17,
          privilege: "Incantesimi conosciuti (livello 5)",
          description: "Comunione con la natura (1 minuto, istantanea): conosce 3 fatti entro 4,5km (o 90m sottoterra): 1) terreni e masse d’acqua; 2) minerali, animali, vegetali o popolazioni; 3) presenza di celestiali, elementali, folletti, immondi o non morti potenti; 4) edifici.; * Transazione arborea (azione, concentrazione 1 minuto): può muoversi tra alberi vivi di taglia superiore entro 150m; impiega 1,5m per entrare o uscire; deve terminare il turno fuori dall’albero.",
          scelta: true
        },
        {
          level: 20,
          privilege: "Campione degli antichi",
          description: "Assume un aspetto a sua scelta. Ogni turno recupera 10 PF. Gli incantesimi che richiedono un’azione possono essere lanciati con un’azione bonus. I nemici entro 3m hanno svantaggio ai tiri salvezza contro i suoi incantesimi e le sue opzioni di Incanalare Divinità.",
          scelta: true
        }
      ],
      "Giuramento di vendetta": [
        {
          level: 3,
          privilege: "Incantesimi conosciuti (livello 1)",
          description: "Anatema (azione, 9m, concentrazione 1 minuto): fino a 3 creature scelte devono superare un TS Saggezza o sottrarre 1d4 a tiri per colpire e tiri salvezza.; * Marchio del cacciatore (azione bonus, 27m, concentrazione 1 ora): marchia una creatura come preda; infligge 1d6 danni extra, ha vantaggio in Percezione e Natura per ricercarla; se muore, può cambiare preda con un’azione bonus.",
          scelta: true
        },
        {
          level: 3,
          privilege: "Incanalare divinità",
          description: "Abiurare nemico (azione, entro 18m): il paladino condanna un nemico; richiede TS Saggezza. Fallimento: velocità 0 e non può usare bonus velocità. Successo: dimezza la velocità. Finisce se colpito.; * Giuramento di inimicizia: un nemico a vista entro 3m ha vantaggio su tutti i tiri; dura 1 minuto o finché il nemico non ha 0 PF o è privo di sensi.",
          scelta: true
        },
        {
          level: 5,
          privilege: "Incantesimi conosciuti (livello 2)",
          description: "Blocca persone (azione, 18m, concentrazione 1 minuto): il bersaglio deve superare un TS Saggezza o è paralizzato.; * Passo velato (azione bonus, istantanea): si teletrasporta di massimo 9m in uno spazio libero a vista, avvolto da foschia argentata.",
          scelta: true
        },
        {
          level: 7,
          privilege: "Vendicatore implacabile",
          description: "Quando effettua un attacco di opportunità contro un nemico, può muoversi fino a metà della sua velocità senza provocare attacchi di opportunità."
        },
        {
          level: 9,
          privilege: "Incantesimi conosciuti (livello 3)",
          description: "Protezione dall'energia (azione, contatto, concentrazione 1 ora): una creatura consenziente diventa resistente a un tipo di danno specifico.; * Velocità (azione, 9m, concentrazione 1 minuto): una creatura consenziente ottiene +2 CA, vantaggio in TS Destrezza, velocità raddoppiata e un’azione aggiuntiva (attacco, disimpegno, nascondersi, scatto o usare oggetto). Alla fine, non può muoversi o agire fino al prossimo turno.",
          scelta: true
        },
        {
          level: 13,
          privilege: "Incantesimi conosciuti (livello 4)",
          description: "Esilio (azione, 18m, concentrazione 1 minuto): fino a 1+(liv-4) creature devono superare un TS Carisma o vengono esiliate in un piano inoffensivo e incapacitate. Al termine, tornano in uno spazio libero da dove sono partite.; * Porta dimensionale (azione, 150m, istantanea): teletrasporto istantaneo; oggetti e creature accompagnate non devono superare il peso trasportabile. Se il punto d’arrivo è occupato, subiscono 4d6 danni da forza.",
          scelta: true
        },
        {
          level: 15,
          privilege: "Anima di vendetta",
          description: "Quando una creatura sotto l'effetto di Giuramento di inimicizia effettua un attacco, il paladino può contrattaccare in mischia se il nemico è entro portata."
        },
        {
          level: 17,
          privilege: "Incantesimi conosciuti (livello 5)",
          description: "Blocca mostri (azione, 27m, concentrazione 1 minuto): un bersaglio a vista deve superare un TS Saggezza a fine turno o rimane paralizzato.; * Scrutare (azione, concentrazione 10 minuti): osserva un bersaglio sullo stesso piano; il bersaglio deve superare un TS Saggezza. Modificatori: conoscenza diretta (-5), descrizione (-2), oggetto personale (-4), parte del corpo (-10).",
          scelta: true
        },
        {
          level: 20,
          privilege: "Angelo vendicatore",
          description: "Dura 1 ora. Velocità di volo 18m grazie a grandi ali. Ogni nemico entro 9m deve superare un TS Saggezza o è spaventato per 1 minuto o finché non viene colpito. Il paladino ha vantaggio ai tiri per colpire.",
          scelta: true
        }
      ],
      "Giuramento di conquista": [
        {
          level: 3,
          privilege: "Incantesimi conosciuti",
          description: "Armatura di Agathys, Comando.",
          scelta: true
        },
        {
          level: 3,
          privilege: "Incanalare divinità",
          description: "Colpo guidato: ottiene +10 ai tiri per colpire; può usarlo dopo aver visto il risultato ma prima di sapere se ha colpito.; * Presenza conquistatrice: ogni creatura scelta entro 9m deve superare un TS Saggezza o è spaventata per 1 minuto (può ripetere il TS a fine turno).",
          scelta: true
        },
        {
          level: 5,
          privilege: "Incantesimi conosciuti",
          description: "Arma spirituale, Blocca persone.",
          scelta: true
        },
        {
          level: 7,
          privilege: "Area di conquista",
          description: "Se una creatura che inizia il turno entro 3m dal paladino è spaventata da lui, la sua velocità è 0m e subisce danni psichici pari alla metà del livello del paladino."
        },
        {
          level: 9,
          privilege: "Incantesimi conosciuti",
          description: "Paura, Scagliare maledizione.",
          scelta: true
        },
        {
          level: 13,
          privilege: "Incantesimi conosciuti",
          description: "Dominare bestie, Pelle di pietra.",
          scelta: true
        },
        {
          level: 15,
          privilege: "Intimorire sprezzante",
          description: "Se il paladino non è incapacitato, una creatura che lo copre subisce danni pari al suo modificatore di Carisma."
        },
        {
          level: 17,
          privilege: "Incantesimi conosciuti",
          description: "Dominare persone, Nube di persone.",
          scelta: true
        },
        {
          level: 18,
          privilege: "Area di conquista",
          description: "L’area di effetto aumenta a 9m."
        },
        {
          level: 20,
          privilege: "Angelo vendicatore",
          description: "Dopo un riposo lungo, il paladino può trasformarsi in un avatar della conquista per 1 minuto. Ha resistenza a tutti i danni, ottiene un attacco extra e i tiri per colpire 19 o 20 diventano critici.",
          scelta: true
        }
      ],
      "Giuramento di redenzione": [
        {
          level: 3,
          privilege: "Incantesimi conosciuti",
          description: "Santuario, Sonno.",
          scelta: true
        },
        {
          level: 3,
          privilege: "Incanalare divinità",
          description: "Emissario di pace: +5 alle prove di Persuasione per 10 minuti.; * Intimorire i violenti: quando una creatura entro 9m infligge danni, il paladino può usare la reazione per farle subire quei danni come danni radiosi (metà se supera un TS Saggezza).",
          scelta: true
        },
        {
          level: 5,
          privilege: "Incantesimi conosciuti",
          description: "Blocca persone, Calmare emozioni.",
          scelta: true
        },
        {
          level: 7,
          privilege: "Aura del guardiano",
          description: "Quando una creatura entro 3m subisce danni, il paladino può usare la reazione per subirli al posto suo. I danni non sono modificati."
        },
        {
          level: 9,
          privilege: "Incantesimi conosciuti",
          description: "Controincantesimo, Trama ipnotica.",
          scelta: true
        },
        {
          level: 13,
          privilege: "Incantesimi conosciuti",
          description: "Sfera elastica di Otiluke, Pelle di pietra.",
          scelta: true
        },
        {
          level: 15,
          privilege: "Spirito protettivo",
          description: "Se il paladino non è incapacitato e ha meno della metà dei PF, recupera d6 + metà del suo livello da paladino."
        },
        {
          level: 17,
          privilege: "Incantesimi conosciuti",
          description: "Blocca mostri, Muro di forza.",
          scelta: true
        },
        {
          level: 18,
          privilege: "Area del guardiano",
          description: "L’area di effetto dell’Aura del guardiano aumenta a 9m."
        },
        {
          level: 20,
          privilege: "Emissario di redenzione",
          description: "Dopo un riposo lungo, il paladino si trasforma in un avatar della pace. Ha resistenza a tutti i danni inflitti da altre creature. Quando una creatura lo attacca, subisce metà dei danni inflitti. Se il paladino infligge danni in qualsiasi modo (tranne tramite questo privilegio), quella creatura diventa immune ai suoi danni fino al prossimo riposo lungo.",
          scelta: true
        }
      ]
    }
  } as Sottoclassi,
  
  getClassi(personaggio:PersonaggioDND){
    let result :Classe[] =[];
    personaggio.privilegi.forEach(privilegio => {
      const [nomeClasse,...nomeSottoclasse] =privilegio.classe.split(' ')
      const classe = this.classi.find(c => c.nome === nomeClasse);
      if (classe) result.push(classe);
    })

    return result;
  },

  /* restituisce lista progressiva di privilegi
    * Guerriero campione 3
    * Ladro assassino 2
  */
  getResocontoClassi(character: PersonaggioDND) {
    const result :{ classe: string, sottoclasse: string, livello: number }[] =[];
    character.privilegi.forEach(privilegio => {
      const nomeClasse = privilegio.classe.split(' ')[0]
            .replace(/^[a-z]/, c => c.toUpperCase()); // la prima lettera è maiuscola
      const nomeSottoclasse = privilegio.classe
            .split(' ').slice(1).join(' ');
      if (!nomeClasse) return;
      const classeMatch = result.find(c => c.classe === nomeClasse);
      if (classeMatch) classeMatch.livello++;
      else result.push({ classe: nomeClasse, sottoclasse: nomeSottoclasse, livello: 1 });
    });
    return result
  },  

  // restituisce le classi dispnibili per progredire nel gioco
  getClassiGiocabili(personaggio: PersonaggioDND): string[] {
    // 1. Genera tutte le sottoclassi disponibili 
    const tutteSottoclassi: string[] = [];

    for (const classe of Object.keys(this.sottoclassi)) {
      const classeCapitalized = classe.charAt(0).toUpperCase() + classe.slice(1);
      for (const sottoclasse of Object.keys(this.sottoclassi[classe])) {
        tutteSottoclassi.push(`${classeCapitalized} ${sottoclasse}`);
      }
    }

    // 2. Ordina le sottoclassi (come nel metodo originale)
    const sottoclassiOrdinate = tutteSottoclassi.sort((a, b) => a.localeCompare(b));

    // 3. Filtra le sottoclassi occupate
    const sottoclassiPersonaggio = personaggio.privilegi.map(p => p.classe.toLowerCase());
    if (sottoclassiPersonaggio.length === 0) {
      return sottoclassiOrdinate;
    }

    // 4. Crea un Set delle classi base occupate (ottimizzazione per lookup veloce)
    const classiOccupate = new Set<string>();
    sottoclassiPersonaggio.forEach(privilegio => {
      const classeBase = privilegio.split(' ')[0].toLowerCase();
      classiOccupate.add(classeBase);
    });

    // 5. Filtra e capitalizza i risultati
    const result =sottoclassiOrdinate
      .filter(sottoclasse => {
        const classeBase = sottoclasse.split(' ')[0].toLowerCase();
        const stessaClasse = classiOccupate.has(classeBase);
        const stessaSottoclasse = sottoclassiPersonaggio 
          .includes(sottoclasse.toLowerCase());
        return !stessaClasse || stessaSottoclasse;
      })
      .map(sub => duckcase(sub));
    
    return result;
  },

  // cerca i privilegi tra classe e sottoclasse per un dato livello
  getPrivilegiClasse(classeKey ='', sottoclasseKey ='', livello =0) {    
    const privilegiSottoclasse = this.sottoclassi[classeKey.toLowerCase()]?.[sottoclasseKey.toLowerCase()];
    if (classeKey.length<5 || sottoclasseKey.length<5
      || livello<1 || livello>20
      ||!privilegiSottoclasse // sottoclasse non esistente
    ){
      console.error('parametri non validi:', classeKey, sottoclasseKey, livello);
      return [];
    } 
    
    // SOTTOCLASSE prima cerca nella sottoclasse, se specificata e valida
    const privilegiLivello = privilegiSottoclasse?.filter((p) => p.level === livello) || [];   
    if (privilegiLivello.length > 0) return privilegiLivello;

    // CLASSE altrimenti cerca nel base
    const classeTrovata = this.classi.find(c => c.nome.toLowerCase() === classeKey.toLowerCase());
    if (classeTrovata) {
      const privilegi = classeTrovata.privilegi.filter(p => p.level === livello);
      if (privilegi.length > 0) {
        return privilegi;
      }
    }
    
    console.error('privilegio classe non trovato per', classeKey, livello);
    return [];
  },

  sottorazze: [
    {
      nome: "Dragonide",
      velocita: [
        { key: 'camminare', value: 9 },
        { key: 'nuotare', value: 4.5 },
        { key: 'scalare', value: 4.5 }
      ],
      eta: "Maturità: 15 anni, Vita media: 80 anni",
      taglia: "Media",
      linguaggi: ["Comune", "Draconico"],
      privilegi: [
        { name: "arma a soffio", description: "Potete usare la vostra azione per esalare energia distruttiva..." },
        { name: "resistenza al danno", description: "Avete resistenza a un tipo di danno associato..." }
      ]
    },
    {
      nome: "Elfo Alto",
      velocita: [
        { key: 'camminare', value: 9 },
        { key: 'nuotare', value: 4.5 },
        { key: 'scalare', value: 4.5 }
      ],
      eta: "Maturità: ca. 100 anni (adulto culturale), Vita media: fino a 750 anni",
      taglia: "Media",
      linguaggi: ["Comune", "Elfico","Extra"],
      privilegi: [
        { name: "scurovisione", description: "Potete vedere in condizioni di buio o luce fioca..." },
        { name: "trance", description: "Meditazione profonda di 4 h al posto del sonno umano..." },
        { name: "retaggio fatato", description: "Vantaggio contro affascinato e immunità al sonno magico..." },
        { name: "sensi acuti", description: "Competenza nell’abilità Percezione." },
        { name: "addestramento armi elfiche", description: "Competenza con spada lunga, spada corta, arco corto e lungo." },
        { name: "trucchetto", description: "Conoscete un trucchetto da mago; Intelligenza è la caratteristica usata." },
        { name: "linguaggio extra", description: "Potete parlare, leggere e scrivere un linguaggio extra." }
      ],
      armi: ['Spada lunga', 'Spada corta', 'Arco corto', 'Arco lungo'],
      abilita:['percezione']
    },
    {
      nome: "Elfo Dei Boschi",
      velocita: [
        { key: 'camminare', value: 10.5 },
        { key: 'nuotare', value: 6 },
        { key: 'scalare', value: 6 }
      ],
      eta: "Maturità: ca. 100 anni (adulto culturale), Vita media: fino a 750 anni",
      taglia: "Media",
      linguaggi: ["Comune", "Elfico"],
      privilegi: [
        { name: "scurovisione", description: "Potete vedere in condizioni di buio o luce fioca..." },
        { name: "trance", description: "Meditazione profonda di 4 h al posto del sonno umano..." },
        { name: "retaggio fatato", description: "Vantaggio contro affascinato e immunità al sonno magico..." },
        { name: "sensi acuti", description: "Competenza nell’abilità Percezione." },
        { name: "addestramento armi elfiche", description: "Competenza con spada lunga, spada corta, arco corto e lungo." },
        { name: "piede lesto", description: "Velocità base aumentata (es. 10,5 m per elfo dei boschi)." },
        { name: "maschera della selva", description: "Potete nascondervi da sporadiche oscurazioni naturali." }
      ],
      armi: ['Spada lunga', 'Spada corta', 'Arco corto', 'Arco lungo'],
      abilita:['percezione']
    },
    {
      nome: "Elfo Oscuro (Drow)",
      velocita: [
        { key: 'camminare', value: 9 },
        { key: 'nuotare', value: 4.5 },
        { key: 'scalare', value: 4.5 }
      ],
      eta: "Maturità: ca. 100 anni (adulto culturale), Vita media: fino a 750 anni",
      taglia: "Media",
      linguaggi: ["Comune", "Elfico", "Sottocomune"],
      privilegi: [
        { name: "scurovisione", description: "Potete vedere in condizioni di buio o luce fioca..." },
        { name: "trance", description: "Meditazione profonda di 4 h al posto del sonno umano..." },
        { name: "retaggio fatato", description: "Vantaggio contro affascinato e immunità al sonno magico..." },
        { name: "incantesimi innati", description: "Potete lanciare magie innate (es. Luci Danzanti, Oscurità) usando Carisma." },
        { name: "sensibilità alla luce del sole", description: "Svantaggio ai tiri per colpire e Percezione quando esposti alla luce solare." }
      ],
      armi: ['Stocco', 'Spada corta', 'Balestra a mano'],
      abilita:['percezione']
    },
    {
      nome: "Gnomo Delle Rocce",
      velocita: [
        { key: 'camminare', value: 7.5 },
        { key: 'nuotare', value: 3 },
        { key: 'scalare', value: 3 }
      ],
      eta: "Maturità: simile agli umani (ca. 40 anni), Vita media: 350‑500 anni",
      taglia: "Piccola",
      linguaggi: ["Comune", "Gnomesco"],
      privilegi: [
        { name: "scurovisione", description: "Potete vedere in condizioni di buio o luce fioca..." },
        { name: "astuzia gnomesca", description: "Vantaggio ai tiri salvezza su Intelligenza, Saggezza e Carisma contro la magia." },
        { name: "sapere da artefice", description: "Raddoppiate il bonus di competenza su prove di Storia per oggetti magici/alchemici." },
        { name: "inventore", description: "Competenza con strumenti da inventore e conoscenza per creare congegni ad orologeria." }
      ]
    },
    {
      nome: "Gnomo Delle Foreste",
      velocita: [
        { key: 'camminare', value: 7.5 },
        { key: 'nuotare', value: 3 },
        { key: 'scalare', value: 3 }
      ],
      eta: "Maturità: simile agli umani (ca. 40 anni), Vita media: 350‑500 anni",
      taglia: "Piccola",
      linguaggi: ["Comune", "Gnomesco"],
      privilegi: [
        { name: "scurovisione", description: "Potete vedere in condizioni di buio o luce fioca..." },
        { name: "astuzia gnomesca", description: "Vantaggio ai tiri salvezza su Intelligenza, Saggezza e Carisma contro la magia." },
        { name: "illusionista naturale", description: "Conoscete il trucchetto Illusione Minore; Intelligenza è la caratteristica usata." },
        { name: "parla con gli animali", description: "Potete comunicare idee semplici con animali Piccoli tramite suoni e gesti." }
      ]
    },
    {
      nome: "Halfling Piedelesto",
      velocita: [
        { key: 'camminare', value: 7.5 },
        { key: 'nuotare', value: 3 },
        { key: 'scalare', value: 3 }
      ],
      eta: "Maturità: 20 anni, Vita media: circa 100 anni",
      taglia: "Piccola",
      linguaggi: ["Comune", "Halfling"],
      privilegi: [
        { name: "fortunato", description: "Se tirate un 1, potete ritirare il dado e usare il nuovo risultato." },
        { name: "coraggioso", description: "Vantaggio ai tiri salvezza contro l’essere spaventato." },
        { name: "versatilità halfling", description: "Potete muovervi attraverso lo spazio di creature di taglia maggiore." },
        { name: "naturalmente furtivo", description: "Potete nascondervi anche quando siete oscurati da una creatura più grande." }
      ]
    },
    {
      nome: "Halfling Tozzo",
      velocita: [
        { key: 'camminare', value: 7.5 },
        { key: 'nuotare', value: 3 },
        { key: 'scalare', value: 3 }
      ],
      eta: "Maturità: 20 anni, Vita media: circa 100 anni",
      taglia: "Piccola",
      linguaggi: ["Comune", "Halfling"],
      privilegi: [
        { name: "fortunato", description: "Se tirate un 1, potete ritirare il dado e usare il nuovo risultato." },
        { name: "coraggioso", description: "Vantaggio ai tiri salvezza contro l’essere spaventato." },
        { name: "versatilità halfling", description: "Potete muovervi attraverso lo spazio di creature di taglia maggiore." },
        { name: "resistenza del tozzo", description: "Vantaggio ai tiri salvezza contro il veleno e resistenza ai danni da veleno." }
      ]
    },
    {
      nome: "Mezzelfo",
      velocita: [
        { key: 'camminare', value: 9 },
        { key: 'nuotare', value: 4.5 },
        { key: 'scalare', value: 4.5 }
      ],
      eta: "Maturità: circa 20 anni, Vita media: oltre 180 anni",
      taglia: "Media (150–180 cm)",
      linguaggi: ["Comune", "Elfico", "linguaggio a scelta"],
      privilegi: [
        { name: "scurovisione", description: "Potete vedere in condizioni di buio o luce fioca..." },
        { name: "stirpe fatata", description: "Vantaggio contro affascinato e immunità al sonno magico." },
        { name: "versatilità", description: "Competenza in due abilità a scelta." }
      ],
      abilita: ['extra','extra']
    },
    {
      nome: "Mezzorco",
      velocita: [
        { key: 'camminare', value: 9 },
        { key: 'nuotare', value: 4.5 },
        { key: 'scalare', value: 4.5 }
      ],
      eta: "Maturità: circa 14 anni, Vita media: fino a ~75 anni",
      taglia: "Media (150–oltre 180 cm)",
      linguaggi: ["Comune", "Orchesco"],
      privilegi: [
        { name: "scurovisione", description: "Potete vedere in condizioni di buio o luce fioca..." },
        { name: "minaccioso", description: "Competenza nell’abilità Intimidire." },
        { name: "resistenza inesorabile", description: "Se ridotto a 0 PF (non ucciso sul colpo), potete tornare a 1 PF una volta per riposo lungo." },
        { name: "attacchi selvaggi", description: "Al critico con arma da mischia, tirate un dado aggiuntivo per il danno." }
      ],
      abilita: ['intimidire']
    },
    {
      nome: "Umano",
      velocita: [
        { key: 'camminare', value: 9 },
        { key: 'nuotare', value: 4.5 },
        { key: 'scalare', value: 4.5 }
      ],
      eta: "Maturità: ~18 anni, Vita media: ~80 anni",
      taglia: "Media",
      linguaggi: ["Comune", "linguaggio a scelta"],
      privilegi: []
    },
    {
      nome: "Nano Delle Colline",
      velocita: [
        { key: 'camminare', value: 7.5 },
        { key: 'nuotare', value: 3 },
        { key: 'scalare', value: 3 }
      ],
      eta: "Maturità: simile agli umani (giovani fino a 50 anni), Vita media: circa 350 anni",
      taglia: "Media (120–150 cm, circa 70 kg)",
      linguaggi: ["Comune", "Nanico"],
      privilegi: [
        { name: "scurovisione", description: "Potete vedere in condizioni di buio o luce fioca..." },
        { name: "resilienza nanica", description: "Vantaggio ai tiri salvezza contro il veleno e resistenza ai danni da veleno." },
        { name: "addestramento combattimento nanico", description: "Competenza in ascia, ascia da battaglia, martello da guerra e martello leggero" },
        { name: "competenza strumenti nanici", description: "Competenza con strumenti da fabbro, birraio o muratore." },
        { name: "esperto minatore", description: "Raddoppio del bonus di competenza su Storia relativa a muratura." },
        { name: "robustezza nanica", description: "PF massimi aumentano di 1 e continuano a incrementare di 1 a ogni livello." }
      ],
      armi: ['Ascia', 'Ascia da battaglia', 'Martello da guerra', 'Martello leggero']
    },
    {
      nome: "Nano Delle Montagne",
      velocita: [
        { key: 'camminare', value: 7.5 },
        { key: 'nuotare', value: 3 },
        { key: 'scalare', value: 3 }
      ],
      eta: "Maturità: simile agli umani (giovani fino a 50 anni), Vita media: circa 350 anni",
      taglia: "Media (120–150 cm, circa 70 kg)",
      linguaggi: ["Comune", "Nanico"],
      privilegi: [
        { name: "scurovisione", description: "Potete vedere in condizioni di buio o luce fioca..." },
        { name: "resilienza nanica", description: "Vantaggio ai tiri salvezza contro il veleno e resistenza ai danni da veleno." },
        { name: "addestramento combattimento nanico", description: "Competenza con ascia da battaglia/lancio, martello da lancio/guerra." },
        { name: "competenza strumenti nanici", description: "Competenza con strumenti da fabbro, birraio o muratore." },
        { name: "esperto minatore", description: "Raddoppio del bonus di competenza su Storia relativa a muratura." }
      ],
      armi: ['Ascia', 'Ascia da battaglia', 'Martello da guerra', 'Martello leggero']
    }
  ] as Sottorazza[],

  getRazza(nomeRazza: string) {
    if (!nomeRazza) return null;
    const lowerNomeRazza = nomeRazza.toLowerCase().trim();
    return this.sottorazze.find(r => {
      const nomeCorrente = r.nome.toLowerCase().trim();
      return nomeCorrente === lowerNomeRazza || nomeCorrente.includes(lowerNomeRazza);
    }) || null;
  },


  background: [
    {
      name: "Accolito",
      abilita: ["intuizione", "religione"],
      strumenti: [],
      linguaggi: "due a scelta",
      equipaggiamento: "Un simbolo sacro (donatogli quando è stato ordinato come sacerdote), un libro di preghiere o una ruota della preghiera, 5 bastoncini di incenso, vesti, un abito comune, una borsa con 15 monete oro (mo)",
      privilegi: [
        {
          name: "Rifugio del Fedele",
          description: "Grazie al rispetto di coloro che condividono la sua fede, l'Accolito e i suoi compagni possono ricevere cure gratuite all’interno di un tempio o santuario. Se la sua reputazione è buona, può anche ottenere assistenza dai sacerdoti."
        }
      ]
    },
    {
      name: "Artigiano della Gilda",
      abilita: ["intuizione", "persuasione"],
      strumenti: ["uno strumento da artigiano a scelta"],
      linguaggi: "linguaggio a scelta",
      equipaggiamento: "Una serie di strumenti da artigiano (a scelta), una lettera di presentazione della gilda, un abito da viaggiatore, una borsa con 15 monete oro (mo)",
      privilegi: [
        {
          name: "Appartenenza alla Gilda",
          description: "La gilda garantisce protezione e supporto legale. Per mantenere questi benefici, l’artigiano deve pagare 5 monete oro al mese."
        }
      ]
    },
    {
      name: "Ciarlatano",
      abilita: ["inganno", "rapidità di mano"],
      strumenti: ["arnesi da falsario", "trucchi per il camuffamento"],
      linguaggi: "",
      equipaggiamento: "Un abito pregiato, trucchi per il camuffamento, uno strumento da truffatore a scelta (es. dadi truccati, bottiglie di liquido colorato, ecc.), una borsa con 15 monete oro (mo)",
      privilegi: [
        {
          name: "Falsa Identità",
          description: "Possiede una seconda identità completa di documenti, travestimenti e la capacità di falsificare qualsiasi documento dopo averne visto uno originale."
        }
      ]
    },
    {
      name: "Criminale",
      abilita: ["furtività", "inganno"],
      strumenti: ["arnesi da scasso", "un tipo di gioco a scelta"],
      linguaggi: "",
      equipaggiamento: "Un piede di porco, un abito comune con cappuccio, una borsa con 15 monete oro (mo)",
      privilegi: [
        {
          name: "Contatto Criminale",
          description: "Ha una rete di contatti criminali affidabili. Può inviare o ricevere messaggi in ogni luogo tramite marinai, mercanti o carovanieri corrotti."
        }
      ]
    },
    {
      name: "Eremita",
      abilita: ["medicina", "religione"],
      strumenti: ["borsa da erborista"],
      linguaggi: "linguaggio a scelta",
      equipaggiamento: "Un bastone, una coperta invernale, un abito comune, un kit da erborista, una borsa con 5 monete oro (mo)",
      privilegi: [
        {
          name: "Scoperta",
          description: "Durante il proprio isolamento, ha scoperto qualcosa di molto importante riguardante il mondo, il cosmo o una conoscenza dimenticata."
        }
      ]
    },
    {
      name: "Eroe Popolare",
      abilita: ["addestrare animali", "sopravvivenza"],
      strumenti: ["uno strumento da artigiano a scelta", "veicoli (terrestri)"],
      linguaggi: "",
      equipaggiamento: "Uno strumento da artigiano (a scelta), una pala, un vaso di ferro, un abito comune, una borsa con 10 monete oro (mo)",
      privilegi: [
        {
          name: "Ospitalità Rurale",
          description: "Benvoluto dalla gente comune, che lo ospita volentieri e lo protegge. Può sempre trovare un rifugio sicuro tra i popolani."
        }
      ]
    },
    {
      name: "Forestiero",
      abilita: ["atletica", "sopravvivenza"],
      strumenti: ["uno strumento musicale a scelta"],
      linguaggi: "linguaggio a scelta",
      equipaggiamento: "Un bastone, una tagliola, un trofeo di un animale ucciso, un abito da viaggiatore, una borsa con 10 monete oro (mo)",
      privilegi: [
        {
          name: "Viandante",
          description: "Conosce sempre la posizione geografica e può trovare cibo e acqua per sé e i suoi compagni, a meno che non si trovi in un luogo completamente inospitale."
        }
      ]
    },
    {
      name: "Intrattenitore",
      abilita: ["acrobazia", "intrattenere"],
      strumenti: ["trucchi per il camuffamento", "uno strumento musicale a scelta"],
      linguaggi: "",
      equipaggiamento: "Uno strumento musicale (a scelta), un pegno di un ammiratore, un costume, una borsa con 15 monete oro (mo)",
      privilegi: [
        {
          name: "A Grande Richiesta",
          description: "Riceve vitto e alloggio gratuiti in cambio di una performance giornaliera in taverne, locande o teatri."
        }
      ]
    },
    {
      name: "Marinaio",
      abilita: ["atletica", "percezione"],
      strumenti: ["strumenti da navigatore", "veicoli (acquatici)"],
      linguaggi: "",
      equipaggiamento: "Una galloccia da marinaio, corda di seta (15 m), un portafortuna, un abito comune, una borsa con 10 monete oro (mo)",
      privilegi: [
        {
          name: "Passaggio Via Nave",
          description: "Può ottenere passaggi gratuiti via mare per sé e il gruppo, a condizione di aiutare l’equipaggio durante il viaggio."
        }
      ]
    },
    {
      name: "Pirata",
      abilita: ["atletica", "percezione"],
      strumenti: ["strumenti da navigatore", "veicoli (acquatici)"],
      linguaggi: "",
      equipaggiamento: "Una galloccia da marinaio, corda di seta (15 m), un portafortuna, un abito comune, una borsa con 10 monete oro (mo)",
      privilegi: [
        {
          name: "Pessima Fama",
          description: "Temuto per la sua reputazione, riesce spesso a evitare punizioni per reati minori."
        }
      ]
    },
    {
      name: "Monello",
      abilita: ["furtività", "rapidità di mano"],
      strumenti: ["arnesi da scasso", "trucchi per il camuffamento"],
      linguaggi: "",
      equipaggiamento: "Un coltellino, una mappa della città, un topolino addomesticato, un ciondolo dei genitori, un abito comune, una borsa con 10 monete oro (mo)",
      privilegi: [
        {
          name: "Segreti Cittadini",
          description: "Conosce vicoli, scorciatoie e passaggi nascosti che permettono a lui (e al gruppo) di muoversi in città al doppio della velocità normale."
        }
      ]
    },
    {
      name: "Nobile",
      abilita: ["persuasione", "storia"],
      strumenti: ["un tipo di gioco a scelta"],
      linguaggi: "linguaggio a scelta",
      equipaggiamento: "Un abito pregiato, un anello con sigillo, una pergamena con albero genealogico, una borsa con 25 monete oro (mo)",
      privilegi: [
        {
          name: "Posizione Privilegiata",
          description: "Viene trattato con rispetto da popolani e pari. Può accedere a luoghi di potere e ricevere udienza da altri nobili."
        },
        {
          name: "Privilegio Alternativo: Servitù",
          description: "Accompagnato da tre servitori fedeli che eseguono compiti semplici, ma non lo seguono in luoghi pericolosi né combattono."
        }
      ]
    },
    {
      name: "Sapiente",
      abilita: ["arcano", "storia"],
      strumenti: [],
      linguaggi: "due a scelta",
      equipaggiamento: "Un calamaio d’inchiostro nero, un pennino, un coltellino, una lettera di un collega defunto, un abito comune, una borsa con 10 monete oro (mo)",
      privilegi: [
        {
          name: "Ricercatore",
          description: "Quando non conosce un'informazione, sa sempre dove trovarla, come in una biblioteca o presso un esperto. Il luogo è determinato dal Dungeon Master."
        }
      ]
    },
    {
      name: "Soldato",
      abilita: ["atletica", "intimidire"],
      strumenti: ["un tipo di gioco", "veicoli (terrestri)"],
      linguaggi: "",
      equipaggiamento: "Una mostrina con i gradi, un trofeo strappato a un nemico abbattuto (un pugnale, una lama spezzata o un pezzo di una bandiera), una serie di dadi in osso o un mazzo di carte, un abito comune, una borsa con 10 monete oro (mo)",
      privilegi: [
        {
          name: "Grado militare",
          description: "Grazie alla sua carriera in ambito militare, il Soldato vede ancora riconosciuta la sua autorità fra i suoi ex commilitoni e sono ancora soggetti alla sua influenza. Inoltre, sempre dove il suo grado viene riconosciuto, il Soldato può accedere ad accampamenti e fortezze amiche."
        }
      ]
    }
  ] as Background[],

  getBackground(nomeBackground: string) {
    if (!nomeBackground) return null;
    const lowerNomeBackground = nomeBackground.toLowerCase().trim();
    return this.background.find(b => {
      const nomeCorrente = b.name.toLowerCase().trim();
      return nomeCorrente === lowerNomeBackground || nomeCorrente.includes(lowerNomeBackground);
    }) || null;
  },

  //  GUIDE ALLE COMPETENZE
  getCompetenzeLinguaggi(personaggio: PersonaggioDND): string {
      // Usiamo un oggetto per tracciare i linguaggi e il loro conteggio
      const linguaggiMap: Record<string, number> = {};

      // Funzione ausiliaria per aggiungere un linguaggio con il contatore
      const addLinguaggio = (lingua: string) => {
          if (linguaggiMap[lingua]) {
              linguaggiMap[lingua]++; // Incrementa il contatore
          } else {
              linguaggiMap[lingua] = 1; // Primo inserimento
          }
      };

      // RAZZA
      const razzaPersonaggio = personaggio.generali.find(g => g.key == 'razza');
      const razza = this.getRazza(razzaPersonaggio?.value + '');
      if (!razzaPersonaggio || !razza) {
          console.error('linguaggi razza non trovati:', razzaPersonaggio, razza);
          return '';
      }
      razza.linguaggi.forEach(lingua => addLinguaggio(lingua));

      // CLASSE
      const classiPersonaggio = personaggio.privilegi.map(priv => priv.classe.toLowerCase()).join(', ');
      if (classiPersonaggio.includes('druido')) addLinguaggio('Druidico');
      if (classiPersonaggio.includes('ladro')) addLinguaggio('Gergo ladresco');

      // BACKGROUND
      const backgroundPersonaggio = personaggio.generali.find(g => g.key == 'background');
      const backgroundMatch = this.getBackground(backgroundPersonaggio?.value + '');
      if (!backgroundMatch) {
          console.error('nessun background');
          return '';
      }
      addLinguaggio(backgroundMatch?.linguaggi);

      // Costruisci il risultato con i contatori
      const result = Object.entries(linguaggiMap).map(([lingua, count]) => {
          return count > 1 ? `* (x${count}) ${lingua}` : `* ${lingua}`;
      });

      return result.join(', ');
  },

  getCompetenzeArmi(personaggio: PersonaggioDND): string {
      let result = new Set<string>();

      // CLASSI
      const classiPersonaggio = personaggio.privilegi.map(p => p.classe);
      classiPersonaggio.forEach(classeCompleta => {
          const [nomeClasse, ...sottoclasse] = classeCompleta.toLowerCase().split(' ');
          const classeMatch = this.classi.find(classe => classe.nome.toLowerCase() === nomeClasse);
          classeMatch?.armi.forEach(arma => {
              result.add(`* ${duckcase(arma)}`);
          });
      });

      // RAZZA
      const razzaPersonaggio = personaggio.generali.find(p => p.key === 'razza');
      const razzaMatch = this.getRazza(razzaPersonaggio?.value + '');
      if (!razzaMatch) {
          console.error('razza non trovata', razzaPersonaggio);
          return '';
      }
      if (razzaMatch.armi?.length) {
          razzaMatch.armi.forEach(arma => {
              result.add(`* ${duckcase(arma)}`);
          });
      }

      return Array.from(result).join(', ');
  },

  getCompetenzeArmature(personaggio: PersonaggioDND): string {
      let result = new Set<string>();

      // RAZZA
      const razzaPersonaggio = personaggio.generali.find(g => g.key == 'razza');
      const razzaMatch = this.getRazza(razzaPersonaggio?.value + '');
      if (!razzaMatch) {
          console.error('razza non trovata', razzaPersonaggio);
          return '';
      }
      if (razzaMatch.armature?.length) {
          razzaMatch.armature.forEach(armatura => {
              result.add(`* ${duckcase(armatura)}`);
          });
      }

      // CLASSI
      personaggio.privilegi.forEach(privilegio => {
          const [nomeClasse, ...nomeSottoclasse] = privilegio.classe.toLowerCase().split(' ');
          const classeMatch = this.classi.find(classe => classe.nome.toLowerCase() === nomeClasse);
          if (classeMatch?.armature.length) {
              classeMatch.armature.forEach(armatura => {
                  result.add(`* ${duckcase(armatura)}`);
              });
          }
      });

      return Array.from(result).map(s => duckcase(s)).join(', ');
  },

  getCompetenzeStrumenti(personaggio: PersonaggioDND): string {
      let result = new Set<string>();

      // RAZZA
      const razzaPersonaggio = personaggio.generali.find(g => g.key == 'razza');
      const razzaMatch = this.getRazza(razzaPersonaggio?.value + '');
      if (!razzaMatch) {
          console.error('razza non trovata', razzaPersonaggio);
          return '';
      }
      if (razzaMatch.strumenti?.length) {
          result.add(`* ${razzaMatch.strumenti}`);
      }

      // BACKGROUND
      const backgroundPersonaggio = personaggio.generali.find(g => g.key == 'background');
      const backgroundMatch = this.getBackground(backgroundPersonaggio?.value + '');
      if (!backgroundMatch) {
          console.error('background non trovato', backgroundPersonaggio);
          return '';
      }
      if (backgroundMatch.strumenti?.length) {
          backgroundMatch.strumenti.forEach(strumento => {
              result.add(`* ${duckcase(strumento)}`);
          });
      }

      // CLASSI
      personaggio.privilegi.forEach(privilegio => {
          const [nomeClasse, ...nomeSottoclasse] = privilegio.classe.toLowerCase().split(' ');
          const classeMatch = this.classi.find(classe => classe.nome.toLowerCase() === nomeClasse);
          if (classeMatch?.strumenti.length) {
              classeMatch?.strumenti.forEach(strumento => {
                  result.add(`* ${duckcase(strumento)}`);
              });
          }
      });

      return Array.from(result).join(', ');
  },

  // valuta se l'abilità è disponibile
  getCompetenzaAbilita(punteggioIndex:number, abilitaIndex:number, personaggio:PersonaggioDND):string{
    const punteggio =personaggio.punteggi[punteggioIndex];
    const abilita = punteggio.abilities[abilitaIndex];
    const chiaviEscluse = new Set([
      'tiro salvezza','forza','destrezza','costituzione',
      'intelligenza','saggezza','carisma',
    ]);
    const tutteAbilita :string[] = personaggio.punteggi.flatMap((punteggio) =>
      punteggio.abilities
        .filter((abilita) => !chiaviEscluse.has(abilita.key))
        .map((abilita) => abilita.key)
    );
    const abilitaSelezionate :string[] =personaggio.punteggi.flatMap((score) =>
      score.abilities
        .filter((abilita) =>abilita.value === true && !chiaviEscluse.has(abilita.key))
        .map((abilita) => abilita.key)
    );    

    let result ='';
    const colore ={ classe:'text-danger', razza:'text-success', 
                    background:'text-primary', vuoto:'d-none'}
    const abilitaValida =(abilitaDaControllare:string) =>(
                          abilita.key.toLowerCase()===abilitaDaControllare.toLowerCase() ||
                          abilitaDaControllare==='extra' ||
                          abilitaDaControllare.toLowerCase().includes(abilita.key.toLowerCase()))&& 
                          abilita.key!=='tiro salvezza' && 
                          !abilita.value;    
        
    //  RAZZA
        const razzaPersonaggio = personaggio.generali.find(g=> g.key === 'razza')?.value ||'';
        const razzaMatch = this.getRazza(razzaPersonaggio+'')
        if(!razzaMatch || !razzaMatch.abilita?.length) {
          console.error('razza non trovata', razzaPersonaggio);
          return '';
        }
        razzaMatch?.abilita?.forEach(abilitaRazza=>{          
          if(abilitaValida(abilitaRazza)) result = colore.razza;
        })


    //  CLASSE
        const classeMatch = this.getClassi(personaggio)[0];
        if(!classeMatch.abilita){
          console.error('abilita non trovata', classeMatch);
          return ''
        }
        if(abilita.key=='tiro salvezza') 
          classeMatch?.tiriSalvezza.forEach(competenzaTS=>{
            if(punteggio.key==competenzaTS && !abilita.value) result = colore.classe;            
          })
        else classeMatch?.abilita.forEach(abilitaClasse=>{
          if(abilitaValida(abilitaClasse)) result = colore.classe;
        })

        
    //  BACKGROUND
        const backgroundPersonaggio = personaggio.generali.find(g=> g.key === 'background')?.value ||'';
        const backgroundMatch = this.getBackground(backgroundPersonaggio +'');
        if(!backgroundMatch){
          console.error('background non trovato', backgroundPersonaggio);
          return '';
        }
        backgroundMatch.abilita.forEach(abilitaBackground=>{
          if(abilitaValida(abilitaBackground)) result = colore.background;
        })

    return result ||'d-none';
  },

  oggetti:[
    { key: "abaco", prezzo: "2 mo", peso: 1 },
    { key: "abito comune", prezzo: "5 mo", peso: 1.5 },
    { key: "abito costume", prezzo: "5 mo", peso: 2 },
    { key: "abito da viaggiatore", prezzo: "2 mo", peso: 2 },
    { key: "abito pregiato", prezzo: "15 mo", peso: 3 },
    { key: "acciarino e pietra focaia", prezzo: "5 mr", peso: 0.5 },
    { key: "acido (fiala)", prezzo: "25 mo", peso: 0.5 },
    { key: "acqua santa (ampolla)", prezzo: "25 mo", peso: 0.5 },
    { key: "amuleto", prezzo: "5 mo", peso: 0.5 },
    { key: "anello con sigillo", prezzo: "5 mo", peso: 0.1 },
    { key: "antitossina (fiala)", prezzo: "50 mo", peso: 0.1 },
    { key: "ariete portatile", prezzo: "10 mo", peso: 17.5 },
    { key: "asta (3 metri)", prezzo: "5 mr", peso: 3.5 },
    { key: "attrezzi da scalatore", prezzo: "25 mo", peso: 6 },
    { key: "barile", prezzo: "2 mo", peso: 15 },
    { key: "bilancia da mercante", prezzo: "5 mo", peso: 1.5 },
    { key: "borsa", prezzo: "5 ma", peso: 0.5 },
    { key: "borsa del guaritore", prezzo: "5 mo", peso: 1.5 },
    { key: "borsa per componenti", prezzo: "25 mo", peso: 1 },
    { key: "bottiglia di vetro", prezzo: "2 mo", peso: 1 },
    { key: "brocca o caraffa", prezzo: "2 mr", peso: 2 },
    { key: "campanella", prezzo: "1 mo", peso: 0.1 },
    { key: "candela", prezzo: "1 mr", peso: 0.1 },
    { key: "canestro", prezzo: "4 mr", peso: 1.5 },
    { key: "canna da pesca", prezzo: "1 mo", peso: 2 },
    { key: "cannocchiale", prezzo: "1000 mo", peso: 1 },
    { key: "carta (un foglio)", prezzo: "2 mr", peso: 0.1 },
    { key: "carrucola e paranco", prezzo: "1 mo", peso: 2.5 },
    { key: "catena (3 metri)", prezzo: "5 mo", peso: 5 },
    { key: "cera per sigillo", prezzo: "5 mr", peso: 0.1 },
    { key: "chiodo da rocciatore", prezzo: "1 mo", peso: 0.125 },
    { key: "clessidra", prezzo: "25 mo", peso: 0.5 },
    { key: "coperta", prezzo: "5 mo", peso: 1.5 },
    { key: "corda di canapa (15 metri)", prezzo: "1 mo", peso: 5 },
    { key: "corda di seta (15 metri)", prezzo: "10 mo", peso: 2.5 },
    { key: "cote per affilare", prezzo: "1 mo", peso: 0.5 },
    { key: "custodia per mappe o pergamene", prezzo: "1 mo", peso: 0.5 },
    { key: "custodia per quadrelli da balestra", prezzo: "1 mo", peso: 1 },
    { key: "fiala", prezzo: "1 mo", peso: 0.1 },
    { key: "fischietto da richiamo", prezzo: "5 mr", peso: 0.1 },
    { key: "bacchetta", prezzo: "10 mo", peso: 0.5 },
    { key: "bastone", prezzo: "5 mo", peso: 2 },
    { key: "cristallo", prezzo: "10 mo", peso: 0.5 },
    { key: "globo", prezzo: "10 mo", peso: 1.5 },
    { key: "verga", prezzo: "10 mo", peso: 1 },
    { key: "bacchetta in legno di tasso", prezzo: "10 mo", peso: 0.5 },
    { key: "bastone di legno", prezzo: "5 mo", peso: 2 },
    { key: "rametto di vischio", prezzo: "1 mo", peso: 0.1 },
    { key: "totem", prezzo: "1 mo", peso: 0.5 },
    { key: "forziere", prezzo: "5 mo", peso: 12.5 },
    { key: "fuoco dell'alchimista (ampolla)", prezzo: "50 mo", peso: 0.5 },
    { key: "gavetta", prezzo: "2 mo", peso: 0.5 },
    { key: "gessetto (1 pezzo)", prezzo: "1 mr", peso: 0.1 },
    { key: "giaciglio", prezzo: "1 mo", peso: 2.5 },
    { key: "inchiostro (boccetta da 30 grammi)", prezzo: "10 mo", peso: 0.1 },
    { key: "lanterna a lente sporgente", prezzo: "10 mo", peso: 1 },
    { key: "lanterna schermabile", prezzo: "5 mo", peso: 1 },
    { key: "lente d'ingrandimento", prezzo: "100 mo", peso: 0.5 },
    { key: "libro", prezzo: "25 mo", peso: 2.5 },
    { key: "libro degli incantesimi", prezzo: "50 mo", peso: 1.5 },
    { key: "manette", prezzo: "2 mo", peso: 1.5 },
    { key: "martello di demolizione", prezzo: "5 mo", peso: 5 },
    { key: "munizioni", prezzo: "—", peso: 0 }, // peso gestito per singoli item sotto
    { key: "aghi da cerbottana (50)", prezzo: "1 mo", peso: 0.5 },
    { key: "frecce (20)", prezzo: "1 mo", peso: 0.5 },
    { key: "proiettili da fionda (20)", prezzo: "4 rm", peso: 0.75 },
    { key: "quadrelli da balestra (20)", prezzo: "1 mo", peso: 0.75 },
    { key: "olio (ampolla)", prezzo: "1 mr", peso: 0.5 },
    { key: "otre", prezzo: "2 mr", peso: 2.5 },
    { key: "pennino", prezzo: "2 mr", peso: 0.1 },
    { key: "pergamena (un foglio)", prezzo: "1 mo", peso: 0.1 },
    { key: "piccone da minatore", prezzo: "2 mo", peso: 5 },
    { key: "piede di porco", prezzo: "2 mo", peso: 2.5 },
    { key: "pozione di guarigione", prezzo: "50 mo", peso: 0.25 },
    { key: "profumo (fiala)", prezzo: "5 mo", peso: 0.1 },
    { key: "rampino", prezzo: "2 mo", peso: 2 },
    { key: "razioni (1 giornata)", prezzo: "5 mo", peso: 1 },
    { key: "sacco", prezzo: "1 rm", peso: 0.25 },
    { key: "sapone", prezzo: "2 mr", peso: 0.25 },
    { key: "scala a pioli (3 metri)", prezzo: "1 mo", peso: 12.5 },
    { key: "secchio", prezzo: "5 mr", peso: 1.5 },
    { key: "serratura", prezzo: "10 mo", peso: 0.5 },
    { key: "sfere metalliche (sacchetto da 1.000)", prezzo: "1 mo", peso: 1 },
    { key: "simbolo sacro", prezzo: "5 mo", peso: 0.5 },
    { key: "emblema", prezzo: "5 mo", peso: 0.5 },
    { key: "reliquiario", prezzo: "5 mo", peso: 0.5 },
    { key: "specchio piccolo di metallo", prezzo: "5 mo", peso: 0.25 },
    { key: "spuntoni, ferro (10)", prezzo: "2,5 mo", peso: 1.5 },
    { key: "tenda per due persone", prezzo: "2 mo", peso: 10 },
    { key: "torcia", prezzo: "1 rm", peso: 0.5 },
    { key: "triboli (sacchetto da 20)", prezzo: "1 mo", peso: 1 },
    { key: "vanga o badile", prezzo: "2 mo", peso: 2.5 },
    { key: "vaso di ferro", prezzo: "1 mo", peso: 5 },
    { key: "veleno, base (fiala)", prezzo: "100 mo", peso: 0.1 },
    { key: "veste", prezzo: "1 mo", peso: 2 },
    { key: "zaino", prezzo: "2 mo", peso: 2.5 },
    
    // Armature
    { key: "imbottita", prezzo: "5 mo", peso: 4, ca: des => 11 + des, furtivita: "svantaggio", armatura: "leggera" },
    { key: "cuoio", prezzo: "10 mo", peso: 5, ca: des => 11 + des, armatura: "leggera" },
    { key: "cuoio borchiato", prezzo: "45 mo", peso: 6.5, ca: des => 12 + des, armatura: "leggera" },
    { key: "pelle", prezzo: "10 mo", peso: 6, ca: des => 12 + Math.min(des, 2), armatura: "media" },
    { key: "giaco di maglia", prezzo: "50 mo", peso: 10, ca: des => 13 + Math.min(des, 2), armatura: "media" },
    { key: "corazza di scaglie", prezzo: "50 mo", peso: 22.5, ca: des => 14 + Math.min(des, 2), furtivita: "svantaggio", armatura: "media" },
    { key: "corazza di piastre", prezzo: "400 mo", peso: 10, ca: des => 14 + Math.min(des, 2), armatura: "media" },
    { key: "mezza armatura", prezzo: "750 mo", peso: 20, ca: des => 15 + Math.min(des, 2), furtivita: "svantaggio", armatura: "media" },
    { key: "corazza ad anelli", prezzo: "30 mo", peso: 20, ca: () => 14, furtivita: "svantaggio", armatura: "pesante" },
    { key: "cotta di maglia", prezzo: "75 mo", peso: 27.5, ca: () => 16, forza: 13, furtivita: "svantaggio", armatura: "pesante" },
    { key: "corazza a strisce", prezzo: "200 mo", peso: 30, ca: () => 17, forza: 15, furtivita: "svantaggio", armatura: "pesante" },
    { key: "armatura completa", prezzo: "1500 mo", peso: 32.5, ca: () => 18, forza: 15, furtivita: "svantaggio", armatura: "pesante" },
    { key: "scudo", prezzo: "10 mo", peso: 3, ca: () => 2, armatura: "scudo" },

    // Armi da Mischia Semplici
    { key: "ascia", prezzo: "5 mo", peso: 1, danno: "1d6 taglienti", proprietà: "lancio (6/18), leggera", arma: "da mischia semplice" },
    { key: "bastone ferrato", prezzo: "2 mo", peso: 2, danno: "1d8 contundenti", proprietà: "versatile (1d10)", arma: "da mischia semplice" },
    { key: "falcetto", prezzo: "1 mo", peso: 1, danno: "1d4 taglienti", proprietà: "leggera", arma: "da mischia semplice" },
    { key: "giavellotto", prezzo: "1 mo", peso: 1, danno: "1d6 perforanti", proprietà: "lancio (6/18)", arma: "da mischia semplice" },
    { key: "lancia", prezzo: "1 mo", peso: 1.5, danno: "1d6 perforanti", proprietà: "lancio (6/18), versatile (1d8)", arma: "da mischia semplice" },
    { key: "martello leggero", prezzo: "2 mo", peso: 1, danno: "1d4 contundenti", proprietà: "lancio (6/18), leggera", arma: "da mischia semplice" },
    { key: "mazza", prezzo: "5 mo", peso: 2, danno: "1d6 contundenti", arma: "da mischia semplice" },
    { key: "pugnale", prezzo: "2 mo", peso: 0.5, danno: "1d4 perforanti", proprietà: "accurata, lancio (6/18), leggera", arma: "da mischia semplice" },
    { key: "randello", prezzo: "1 rm", peso: 1, danno: "1d4 contundenti", arma: "da mischia semplice" },
    { key: "randello pesante", prezzo: "2 mo", peso: 5, danno: "1d8 contundenti", proprietà: "due mani", arma: "da mischia semplice" },
    
    // Armi a Distanza Semplici
    { key: "arco corto", prezzo: "25 mo", peso: 1, danno: "1d6 perforanti", proprietà: "due mani, munizioni (24/96)", arma: "a distanza semplice" },
    { key: "balestra leggera", prezzo: "25 mo", peso: 2.5, danno: "1d8 perforanti", proprietà: "due mani, munizioni (24/96), ricarica", arma: "a distanza semplice" },
    { key: "dardo", prezzo: "5 mr", peso: 0.125, danno: "1d4 perforanti", proprietà: "accurata, lancio (6/18)", arma: "a distanza semplice" },
    { key: "fionda", prezzo: "1 mr", peso: 0, danno: "1d4 contundenti", proprietà: "munizioni (9/36)", arma: "a distanza semplice" },

    // Armi da Mischia da Guerra
    { key: "alabarda", prezzo: "20 mo", peso: 3, danno: "1d10 taglienti", proprietà: "due mani, pesante, portata", arma: "da mischia da guerra" },
    { key: "ascia bipenne", prezzo: "30 mo", peso: 3.5, danno: "1d12 taglienti", proprietà: "due mani, pesante", arma: "da mischia da guerra" },
    { key: "ascia da battaglia", prezzo: "10 mo", peso: 2, danno: "1d8 taglienti", proprietà: "versatile (1d10)", arma: "da mischia da guerra" },
    { key: "falcione", prezzo: "20 mo", peso: 3, danno: "1d10 taglienti", proprietà: "due mani, pesante, portata", arma: "da mischia da guerra" },
    { key: "frusta", prezzo: "2 mo", peso: 1.5, danno: "1d4 taglienti", proprietà: "accurata, portata", arma: "da mischia da guerra" },
    { key: "lancia da cavaliere", prezzo: "10 mo", peso: 3, danno: "1d12 perforanti", proprietà: "portata, speciale", arma: "da mischia da guerra" },
    { key: "maglio", prezzo: "10 mo", peso: 5, danno: "2d6 contundenti", proprietà: "due mani, pesante", arma: "da mischia da guerra" },
    { key: "martello da guerra", prezzo: "15 mo", peso: 1, danno: "1d8 contundenti", proprietà: "versatile (1d10)", arma: "da mischia da guerra" },
    { key: "mazzafrusto", prezzo: "10 mo", peso: 1, danno: "1d8 contundenti", proprietà: "", arma: "da mischia da guerra" },
    { key: "morning star", prezzo: "15 mo", peso: 2, danno: "1d8 perforanti", proprietà: "", arma: "da mischia da guerra" },
    { key: "picca", prezzo: "5 mo", peso: 9, danno: "1d10 perforanti", proprietà: "due mani, pesante, portata", arma: "da mischia da guerra" },
    { key: "piccone da guerra", prezzo: "5 mo", peso: 1, danno: "1d8 perforanti", proprietà: "", arma: "da mischia da guerra" },
    { key: "scimitarra", prezzo: "25 mo", peso: 1.5, danno: "1d6 taglienti", proprietà: "accurata, leggera", arma: "da mischia da guerra" },
    { key: "spada corta", prezzo: "10 mo", peso: 1, danno: "1d6 perforanti", proprietà: "accurata, leggera", arma: "da mischia da guerra" },
    { key: "spada lunga", prezzo: "15 mo", peso: 1.5, danno: "1d8 taglienti", proprietà: "versatile (1d10)", arma: "da mischia da guerra" },
    { key: "spadone", prezzo: "50 mo", peso: 3, danno: "2d6 taglienti", proprietà: "due mani, pesante", arma: "da mischia da guerra" },
    { key: "stocco", prezzo: "25 mo", peso: 1, danno: "1d8 perforanti", proprietà: "accurata", arma: "da mischia da guerra" },
    { key: "tridente", prezzo: "5 mo", peso: 2, danno: "1d6 perforanti", proprietà: "lancio (6/18), versatile (1d8)", arma: "da mischia da guerra" },

    // Armi a Distanza da Guerra
    { key: "arco lungo", prezzo: "50 mo", peso: 1, danno: "1d8 perforanti", proprietà: "due mani, munizioni (45/180)", arma: "a distanza da guerra" },
    { key: "balestra a mano", prezzo: "75 mo", peso: 1.5, danno: "1d6 perforanti", proprietà: "accurata, munizioni (9/36), ricarica", arma: "a distanza da guerra" },
    { key: "balestra pesante", prezzo: "50 mo", peso: 9, danno: "1d10 perforanti", proprietà: "due mani, munizioni (30/120), ricarica", arma: "a distanza da guerra" },
    { key: "cerbottana", prezzo: "10 mo", peso: 0.5, danno: "1d1 perforanti", proprietà: "munizioni (7,5/30), ricarica", arma: "a distanza da guerra" },
    { key: "rete", prezzo: "1 mo", peso: 1.5, danno: "-", proprietà: "lancio (1,5/4,5), speciale", arma: "a distanza da guerra" },

    // Armi da fuoco  
    { key: "archibugio", prezzo: "250 mo", peso: 4.5, danno: "1d12 perforanti", proprietà: "due mani, munizioni (distinta), ricarica", arma: "a distanza da guerra" },
    { key: "moschetto", prezzo: "500 mo", peso: 5, danno: "1d12 perforanti", proprietà: "due mani, munizioni, ricarica", arma: "a distanza da guerra" },
    { key: "pistola", prezzo: "250 mo", peso: 1.5, danno: "1d10 perforanti", proprietà: "munizioni, ricarica", arma: "a distanza da guerra" },
    { key: "pistola da palmo", prezzo: "100 mo", peso: 0.5, danno: "1d8 perforanti", proprietà: "nascosta, munizioni, ricarica", arma: "a distanza da guerra" },
    { key: "rivoltina", prezzo: "500 mo", peso: 1.5, danno: "1d10 perforanti", proprietà: "speciale, munizioni", arma: "a distanza da guerra" },
    { key: "schioppo", prezzo: "300 mo", peso: 9, danno: "2d8 perforanti", proprietà: "due mani, ricarica, munizioni", arma: "a distanza da guerra" }
  ] as Oggetto[],

  peso(param: string | string[] =''): number{
    // se è una stringa
    if(typeof param === 'string' && param){
      const oggetto = this.oggetti.find(d => param.toLocaleLowerCase().includes(d.key.toLocaleLowerCase()));
      return oggetto ? oggetto.peso : 0;

    // se è un array di stringhe
    }else if(Array.isArray(param) && param.length > 0 && param.every(p => typeof p === 'string')){
      return param.reduce((acc, key) => acc + this.peso(key), 0);
    }
    return 0;
  },
  
  danno(nomeArma =''){
    const arma = this.oggetti.find(d => nomeArma.toLocaleLowerCase().includes(d.key.toLocaleLowerCase()));
    if(!arma || !arma.arma || !arma.danno){
      console.error('arma non trovata');
      return {dadi: '', tipo: ''};
    }
    const [dadi, tipo] = arma.danno.split(' ');
    return {dadi, tipo};
  },
  

  //  LOGICA DI SCHEDA
  // converte il punteggio di caratteristica nel suo modificatore
  getModificatore: (score:number) =>{ return Math.floor((score - 10) / 2)},
  /**
   * Calcola il bonus per un'abilità in funzione della caratteristica e della competenza
   * @param {any} character
   * @param {number} punteggioCaratteristica
   * @param {boolean} checkAbilita
   * @returns {string|number} Valore con segno quando positivo
   */
  abilityMod(character: PersonaggioDND, punteggioCaratteristica: number, checkAbilita: boolean){
    let result = this.getModificatore(punteggioCaratteristica);
    if(checkAbilita){
      result += this.getBonusCompetenza(character);
    }
    return result>0 ?`+${result}` :result;
  },
  /**
   * Calcola il livello del personaggio in base ai PE
   * @param {any} character
   * @returns {number}
   */
  getLivello(character: PersonaggioDND) {
    const pe = character.generali.find(g => g.key === 'punti_esperienza')?.value;
    if (typeof pe !== 'number') return 1;

    // Soglie dei PE per ogni livello
    const thresholds = [
      0,      // livello 1
      300,    // 2
      900,    // 3
      2700,   // 4
      6500,   // 5
      14000,  // 6
      23000,  // 7
      34000,  // 8
      48000,  // 9
      64000,  // 10
      85000,  // 11
      100000, // 12
      120000, // 13
      140000, // 14
      165000, // 15
      195000, // 16
      225000, // 17
      265000, // 18
      305000, // 19
      355000  // 20
    ];

    // Trova ultimo livello in cui pe >= soglia
    for (let lvl = thresholds.length; lvl > 0; lvl--) {
      if (pe >= thresholds[lvl - 1]) {
        return lvl;
      }
    }
    return 1; // fallback (non dovrebbe mai arrivarci)
  },

  /**
   * Bonus di Competenza derivato dal livello corrente
   * @param {any} character
   * @returns {number}
   */
  getBonusCompetenza(character: PersonaggioDND) {
    const livello = this.getLivello(character);
    if (typeof livello !== 'number' || livello < 1) return 0;

    return 2 + Math.floor((livello - 1) / 4);
  },

  //!COLONNA CENTRALE
  /**
   * Iniziativa = modificatore di Destrezza, formattato con segno se positivo
   * @param {any} character
   * @returns {string|number}
   */
  iniziativa(character :PersonaggioDND){
    const destrezza = character.punteggi.find(p => p.key === 'destrezza');
    if (!destrezza) return 0;
    const value =this.getModificatore(destrezza.value);
    return value>0?`+${value}`:value;
  },

  getClasseArmatura(personaggio:PersonaggioDND) :string{ 
    //  RECUPERA PUNTEGGI
        const modDes =this.getModificatore(personaggio.punteggi.find(p=> p.key=='destrezza')?.value ??-100);
        const modCos =this.getModificatore(personaggio.punteggi.find(p=> p.key=='costituzione')?.value ??-100);
        const modSag =this.getModificatore(personaggio.punteggi.find(p=> p.key=='saggezza')?.value ??-100);
        if(modDes<-10 || modCos<-10 || modSag<-10){
          console.error(`punteggi non validi\nDES: ${modDes}\nCOS: ${modCos}\nSAG: ${modSag}`);
          return '-';
        } 

    let result :string[] =[];
    //  CLASSE
        let ottenutaDifesaSenzaArmatura =false;
        const classiPersonaggio =personaggio.privilegi.map(p=> p.classe.toLowerCase());
        classiPersonaggio.forEach(classe=>{
          if(ottenutaDifesaSenzaArmatura) return; // un solo privilegio per la classe

          if(classe.includes('barbaro')){ 
            result.push(`* Barbaro: ${10+modDes+modCos}`);
            ottenutaDifesaSenzaArmatura=true;
          }
          if(classe.includes('monaco')){ 
            result.push(`* Monaco: ${10 +modDes +modSag}`);
            ottenutaDifesaSenzaArmatura=true;
          }
          if(classe.includes(' dra')){ // stregone
            result.push(`* Stregone: ${13 +modDes}`);
            ottenutaDifesaSenzaArmatura=true;
          }
        })
        if(!ottenutaDifesaSenzaArmatura) result.unshift(`* Standard: ${10 +modDes}`);

    //  EQUIPAGGIAMENTO
        const equipaggiamento =personaggio.equipaggiamento.map(ogg=> ogg.value.toLowerCase());
        equipaggiamento.forEach(nomeOggetto=>{
          const oggettoMatch =this.oggetti.find(ogg=> ogg.key==nomeOggetto && ogg.armatura);
          if(oggettoMatch) 
            result.push(`* ${duckcase(nomeOggetto)}: ${oggettoMatch?.ca?.(modDes)}`);
        })
        
    return result .join(', ');
  },

  /**
   * Ritorna l'array velocità per la razza del personaggio
   * @param {any} character
   * @returns {{key:string, value:number}[]|[]}
   */
  getVelocita(personaggio :PersonaggioDND) :string{
    let result :string[] =[];
    //  RAZZA
        const razzaPersonaggio =personaggio.generali.find(g => g.key === 'razza')?.value ||'';
        const razzaMatch =this.getRazza(razzaPersonaggio+'');
        if(!razzaMatch){
          console.error('razza non definita', razzaPersonaggio);
          return '-'
        }
        razzaMatch.velocita.forEach(opsione=>{
          result.push(`* ${duckcase(opsione.key)}: ${opsione.value}m`)
        })

    return result .join(' ')
  },

  /**
   * Dato il nome di una classe, restituisce il suo dado vita (X in dX).
   * Se la classe non è riconosciuta, usa 6 come default (d6).
   * @param {string} nomeClasse
   * @returns {number}
   */
  getDadoVita(nomeClasse :string) :number {
    const dadiVita = {
      'barbaro': 12, 'guerriero': 10, 'paladino': 10, 'ranger': 10,
      'chierico': 8, 'druido': 8, 'monaco': 8, 'ladro': 8, 'bardo': 8,
      'stregone': 6, 'mago': 6, 'artefice': 8,
    };
    return dadiVita[nomeClasse.toLowerCase() as keyof typeof dadiVita] || 6; // Ritorna 6 come default
  },
  /**
   * Restituisce i dadi vita combinati per il personaggio.
   * Output: array di oggetti { livello: n, dado: X } per formattare "n dX".
   * @param {any} character
   * @returns {{livello:number, dado:number}[]}
   */
  dadiVitaPersonaggio(character :PersonaggioDND){
    const result = this.getResocontoClassi(character).map(c => ({
      livello: c.livello,
      dado: this.getDadoVita(c.classe),
    }));
    return result.filter(r => r.dado !== 0 && r.livello !== 0);
  },

  /**
   * Calcola i PF massimi in base ai dadi vita per livello e al modificatore di Costituzione
   * @param {any} character
   * @returns {number}
   */
  puntiFeritaMassimi(character :PersonaggioDND){
    const costituzione = character.punteggi.find(p => p.key === 'costituzione')?.value;
    if (!costituzione){
      console.error('Punteggio non trovato');
      return 0
    }

    const conMod = this.getModificatore(costituzione);
    let pfTotali = 0;

    const privilegi = character.privilegi;
    privilegi.forEach((privilegio, index) => {
      const dadoVita = this.getDadoVita(privilegio.classe);

      if (index === 0) {
        pfTotali += dadoVita + conMod;
      } else {
        const mediaDadoVita = (dadoVita / 2) + 1;
        pfTotali += mediaDadoVita + conMod;
      }
    });

    return pfTotali;
  },

  /**
   * Calcola il bonus all'attacco per un'arma, applicando competenza e caratteristica corretta
   * @param {any} character
   * @param {string} [nomeArma]
   * @returns {string} Formattato con segno, oppure '—' se non calcolabile
   */
  bonusAttacco(character :PersonaggioDND, nomeArma =''){
    const arma = DND.oggetti.find(d => String(nomeArma || '').toLowerCase().trim().includes(String(d.key || '').toLowerCase().trim()));
    const puntiForza = character.punteggi.find(p => p.key === 'forza');  
    const puntiDestrezza = character.punteggi.find(p => p.key === 'destrezza');
    if(!arma || !puntiForza || !puntiDestrezza) return '—';

    const isRanged = (arma.arma || '').includes('a distanza');
    const hasFinesse = String(arma.proprietà || '').includes('accurata');
    let abilitaBase = isRanged
      ? puntiDestrezza.value
      : (hasFinesse && puntiDestrezza.value > puntiForza.value
          ? puntiDestrezza.value
          : puntiForza.value);
    const modificatore = this.getModificatore(abilitaBase) + this.getBonusCompetenza(character);
    return modificatore >=0 ? `+${modificatore}` : modificatore.toString();
  },

  /**
   * Calcola il danno dell'arma aggiungendo il modificatore caratteristica, es. "d8+3 tagliente"
   * @param {any} character
   * @param {string} nomeArma
   * @returns {string} Stringa danno oppure '—' se non calcolabile
   */
  bonusDanno(character :PersonaggioDND, nomeArma :string){
    const arma = DND.oggetti.find(d => String(nomeArma || '')
      .toLowerCase().trim().includes(String(d.key || '').toLowerCase().trim()));
    if(!arma || !arma.danno){
    console.error('arma non trovata');
    return '—';
    }

    const puntiForza =character.punteggi.find(p => p.key === 'forza');  
    const puntiDestrezza =character.punteggi.find(p => p.key === 'destrezza');
    if(!puntiForza || !puntiDestrezza){
      console.error('punteggi non trovati');
      return '—';
    }

    const isRanged = (arma.arma || '').includes('a distanza');
    const hasFinesse = String(arma.proprietà || '').includes('accurata');
    let abilitaBase = isRanged
      ? puntiDestrezza.value
      : (hasFinesse && puntiDestrezza.value > puntiForza.value
        ? puntiDestrezza.value
        : puntiForza.value);
    const modificatore_numerico :number = this.getModificatore(abilitaBase);
    const modificatore_stringa :string = 
        modificatore_numerico > 0  ? `+${modificatore_numerico}` 
      : modificatore_numerico==0 ? '' 
      : modificatore_numerico.toString();
    
    let [dadi, tipo] = arma.danno.split(' ');
    if(dadi.startsWith('1')) dadi = dadi.slice(1);
    return  dadi ? `${dadi}${modificatore_stringa} ${tipo}` : '—'; 
  },

  /**
   * Calcola il peso totale trasportato
   * @param {any} character
   * @returns {string} peso totale (kg)
   */
  trasporto(character :PersonaggioDND) :string{
    const pesoAttualeTrasportato :number = character.equipaggiamento
      .reduce((acc, e) => {
        const q = Number(e.qta) || 1;
        return acc + q * DND.peso(e.value);
      }, 0)

    const punteggioForza = character.punteggi .find(p => p.key =='forza')
    if(!punteggioForza){
      console.error('punteggio forza non trovato');
      return '—';
    }
    const massimoPesoTrasportabile = punteggioForza.value * 7.5 || 0;
    return pesoAttualeTrasportato.toFixed(2) +' / '+ massimoPesoTrasportabile.toFixed(2);
  },

  //COLONNA DESTRA
  /**
   * Mappa `character.privilegi` in oggetti con livello progressivo e privilegi risolti
   * @param {any} character
   * @returns {{name:string, privileges:any[], level:number, srcIndex?:number}[]}
  */
  privilegiMappati(character: PersonaggioDND) {
    const result: {
      classe: string,
      note: string,
      level: number,
      privileges: { privilege: string, description: string, scelta?: boolean }[]
    }[] = [];

    // CLASSE
    // Oggetto per tenere traccia dei contatori per ogni classe+sottoclasse
    const contatori: Record<string, number> = {};

    (character.privilegi || []).forEach((privilegio) => {
      const [nomeClasse, ...nomeSottoclasse] = String(privilegio.classe || '').split(' ');
      const classe = nomeClasse.toLowerCase();
      const sottoclasse = nomeSottoclasse.join(' ').toLowerCase();
      if(!classe ||typeof classe!='string' || 
         !sottoclasse ||typeof sottoclasse!='string') console.error('classe', classe, 'sottoclasse', sottoclasse);
      
      // Incrementa il contatore per la combinazione classe+sottoclasse
      const key = `${classe}_${sottoclasse}`;
      contatori[key] = (contatori[key] || 0) + 1;
      const level = contatori[key];
      
      // recupera i privilegi
      const privileges = DND.getPrivilegiClasse(classe, sottoclasse, level) ||[];
      if(!privileges) console.error('privilegi non trovati per', classe, sottoclasse, level);    
      
      result.push({
        classe: privilegio.classe,
        note: privilegio.note,
        level,
        privileges,
      });
    });

    return result;
  },
  
  getValorePassivoAbilita(nomeAbilita:string, personaggio:PersonaggioDND): number {
    let trovata =false
    let abilitaMatch =false;
    let modificatoreMatch =0;
    personaggio.punteggi.forEach(punteggio=>
      punteggio.abilities.find(abilita=>{
        if(abilita.key.toLowerCase()==nomeAbilita.toLowerCase()) {
          abilitaMatch =abilita.value;
          modificatoreMatch =this.getModificatore(punteggio.value);
          trovata =true;
        }
      })
    )
    if(!trovata){
      console.error('abilità non trovata');
      return 0;
    }
    const bonusCompetenza =DND.getBonusCompetenza(personaggio)
    if(!abilitaMatch) return 10 +modificatoreMatch;
    return 10 +modificatoreMatch +bonusCompetenza;
  }
}

export function inizializzaPersonaggio() :PersonaggioDND {
  return {
    nome_personaggio: 'Es: Bilbo Baggins',
    generali: [
      { key: 'background', value: 'Forestiero' },
      { key: 'nome_giocatore', value: 'Es: il tuo nome' },
      { key: 'razza', value: 'Umano' },
      { key: 'allineamento', value: 'Legale Buono' },
      { key: 'punti_esperienza', value: 0 },
    ],

    // colonna sinistra
    ispirazione: 0,
    punteggi: [
      { key: 'forza', value: 15, abilities: [
        { key: 'tiro salvezza', value: false }, 
        { key: 'atletica', value: false }
      ]},
      { key: 'destrezza', value: 14, abilities: [
        { key: 'tiro salvezza', value: false }, 
        { key: 'acrobazia', value: false }, 
        { key: 'rapidità di mano', value: false }, 
        { key: 'furtività', value: false }
      ]},
      { key: 'costituzione', value: 13, abilities: [
        { key: 'tiro salvezza', value: false }
      ]},
      { key: 'intelligenza', value: 12, abilities: [
        { key: 'tiro salvezza', value: false }, 
        { key: 'arcano', value: false }, 
        { key: 'indagare', value: false }, 
        { key: 'natura', value: false }, 
        { key: 'religione', value: false }, 
        { key: 'storia', value: false }
      ]},
      { key: 'saggezza', value: 10, abilities: [
        { key: 'tiro salvezza', value: false }, 
        { key: 'addestrare animali', value: false }, 
        { key: 'intuizione', value: false }, 
        { key: 'medicina', value: false }, 
        { key: 'percezione', value: false }, 
        { key: 'sopravvivenza', value: false }
      ]},
      { key: 'carisma', value: 8, abilities: [
        { key: 'tiro salvezza', value: false }, 
        { key: 'inganno', value: false }, 
        { key: 'intimidire', value: false }, 
        { key: 'intrattenere', value: false }, 
        { key: 'persuasione', value: false }
      ]},
    ],
    competenze:[
      {key:'linguaggi', value:'Comune, -'},
      {key:'armi', value:'Semplici, da guerra'},
      {key:'armature', value:'Leggere, medie e scudi, pesanti'},
      {key:'strumenti', value:'Giochi da tavolo'},
    ],
    
    // colonna centrale
    classe_armatura: 10,
    velocita: "Camminare: 9m",
    punti_ferita_attuali: 10,
    punti_ferita_temporanei: 0,
    ts_falliti: 0,
    ts_successi: 0,
    attacchi:[],
    equipaggiamento: [
      {qta:1, value:'Zaino'},
      {qta:1, value:'Giaciglio'},
      {qta:1, value:'Gavetta'},
      {qta:1, value:'Acciarino'},
      {qta:1, value:'Corda canapa'},
      {qta:10, value:'Torcia'},
      {qta:1, value:'Otre'},
      {qta:10, value:'Razioni'},
    ],
    monete: [ 
      { key: 'rame', value: 0 },
      { key: 'argento', value: 25 },
      { key: 'electrum', value: 0 },
      { key: 'oro', value: 0 },
      { key: 'platino', value: 0 }
    ],

    // colonna destra
    personalita: [
      {key:'tratti_caratteriali', value:''},
      {key:'ideali', value:''},
      {key:'legami', value:''},
      {key:'difetti', value:''},
    ],
    privilegi:[]
  }
}