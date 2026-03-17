import { Injectable, signal, WritableSignal } from '@angular/core';
import { toast } from "../../tools/feedbacksUI";
import { statisticheGradoSfida } from "./gradiSfida";
import { Mappa } from "./mappa.service";

export interface Combattente {
  id: string;
  tipo: "mischia" | "distanza";
  target: string;
  squadra: string;
  numeroTurno: number;
  puntiFerita: number;
  danni: number;
  bonusAttacco: number;
  classeArmatura: number;
}

@Injectable({ providedIn: 'root' })
export class CombattimentoService {
  constructor() {}
  combattenti = signal<Combattente[]>([]);

  // Ottieni un combattente per ID
  getCombattenteById(idCombattente: string): Combattente | undefined {
    idCombattente = idCombattente.toLocaleLowerCase();
    return this.combattenti().find(c => c.id.toLocaleLowerCase() === idCombattente);
  }

  // Rimuovi un combattente
  removeCombattente(idCombattente: string): void {
    idCombattente = idCombattente.toLocaleLowerCase();
    const combattentiAggiornati = this.combattenti().filter(
      c => c.id.toLocaleLowerCase() !== idCombattente
    );

    this.combattenti.set(combattentiAggiornati);

    const test = combattentiAggiornati.find(c => c.id.toLocaleLowerCase() === idCombattente);
    if (test) {
      console.error("Combattente non rimosso", test);
      return;
    }
    toast(`${idCombattente} rimosso`, "success");
  }

  // Ottieni un nome casuale per un combattente
  getNomeRandom(): string {
    const nomiDefault = [
      'Rosso', 'Blu', 'Giallo', 'Verde', 'Arancione', 'Viola', 'Nero', 'Bianco',
      'Marrone', 'Grigio', 'Celeste', 'Magenta', 'Ciano', 'Arancio', 'Indaco',
      'Avorio', 'Cacao', 'Citrino', 'Dorato', 'Ebano', 'Kaki', 'Lavanda',
      'Nocciola', 'Fucsia', 'Oliva', 'Perla', 'Rosa', 'Salmone', 'Turchese'
    ];

    const nomiDisponibili = nomiDefault.filter(
      nome => !this.combattenti().some(c => c.id === nome)
    );

    return nomiDisponibili[Math.floor(Math.random() * nomiDisponibili.length)];
  }

  // Aggiungi un combattente alla lista
  addCombattente(
    nomeSquadra: string,
    bonusIniziativa: number,
    gradoSfida: string,
    nomePersonaggio: string,
    classeArmatura: number,
    puntiFerita: number,
    tipoCombettente: 'mischia' | 'distanza' = 'mischia'
  ): void {
    const numeroTurno = Math.floor(Math.random() * 20) + bonusIniziativa;
    const matchGradoSfida = statisticheGradoSfida.find(gs => gs.gradoSfida === gradoSfida);
    const nuovoNome = nomePersonaggio.trim() !== '' ? nomePersonaggio.trim() : this.getNomeRandom();
    const nuoviHP = puntiFerita ? puntiFerita 
                  : matchGradoSfida?.puntiFerita ?? 0;
    if (!nuovoNome || !nomeSquadra) {
      console.error("Errore", { nomeSquadra, nuovoNome });
      return;
    }

    const nuovoCombattente: Combattente = {
      id: nuovoNome,
      tipo: tipoCombettente,
      puntiFerita: nuoviHP,
      danni: matchGradoSfida?.danniRound ?? 0,
      bonusAttacco: matchGradoSfida?.bonusAttacco ?? 0,
      classeArmatura: classeArmatura ? classeArmatura : matchGradoSfida?.classeArmatura ?? 10,
      target: "",
      squadra: nomeSquadra,
      numeroTurno: numeroTurno,
    };

    // Aggiungi il nuovo combattente alla lista
    this.combattenti.update(combattenti => [...combattenti, nuovoCombattente]);
  }

  // Posiziona i combattenti su lati opposti della mappa
  posizionamento(mappa: Mappa, righe: number, colonne: number): void {
    if (!mappa || righe === 0 || colonne === 0) {
      toast("Mappa non valida", "danger");
      return;
    }

    // reset della mappa
    const lettereRighe = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      if (mappa[letteraRiga]) {
        mappa[letteraRiga].fill('');
      }
    }

    // recupero le squadre
    const squadre = [...new Set(this.combattenti().map(c => c.squadra))];
    if (squadre.length === 0) {
      toast("Nessuna squadra da posizionare", "danger");
      return;
    }

    // posizionamento delle squadre
    squadre.forEach((squadra, index) => {
      const combattentiSquadra = this.combattenti().filter(c => c.squadra === squadra);
      const isLeft = index % 2 === 0;
      // distribuzione uniforme sulla colonna
      const step = Math.max(1, Math.floor(righe / combattentiSquadra.length));

      combattentiSquadra.forEach((combattente, indiceCombattente) => {
        // calcolo la riga e la colonna
        const riga = String.fromCharCode(65 + indiceCombattente * step);
        const colonna = isLeft ? 0 : colonne - 1;
        // se esiste riga e colonne sono nel range della mappa
        if (mappa[riga] && colonna >= 0 && colonna < mappa[riga].length) {
          // inserisce l'id del combattente nella mappa
          mappa[riga][colonna] = combattente.id; 
        }
      });
    });

    toast("Combattenti posizionati con successo!", "success");
  }

  // Danneggia o guarisce un personaggio
  vitalitaPersonaggio(idCombattente: string, bonus: number): void {
    const combattente = this.getCombattenteById(idCombattente.toLocaleLowerCase());
    if (!combattente) {
      toast("Combattente non trovato", "danger");
      return;
    }

    const hpIniziali = combattente.puntiFerita;
    const combattentiAggiornati = this.combattenti().map(c => {
      if (c.id.toLocaleLowerCase() === idCombattente.toLocaleLowerCase()) {
        return { ...c, puntiFerita: c.puntiFerita + bonus };
      }
      return c;
    });

    this.combattenti.set(combattentiAggiornati);

    const combattenteAggiornato = combattentiAggiornati.find(c => c.id.toLocaleLowerCase() === idCombattente.toLocaleLowerCase());
    if (!combattenteAggiornato) return;

    if (combattenteAggiornato.puntiFerita <= 0) {
      this.removeCombattente(idCombattente.toLocaleLowerCase());
      return toast(`${combattenteAggiornato.id} sconfitto`, "danger");
    }

    if (hpIniziali !== combattenteAggiornato.puntiFerita) {
      toast(`HP ${combattenteAggiornato.id} aggiornati`, 'success');
    }
  }

  // Personaggi di una squadra attaccano gli avversari
  tiraPerColpire(attaccante: Combattente, bersaglio: Combattente): void {
    const tiroPerColpire = attaccante.bonusAttacco + Math.floor(Math.random() * 20);
    const superaClasseArmatura = tiroPerColpire >= bersaglio.classeArmatura;

    if (superaClasseArmatura) {
      this.vitalitaPersonaggio(bersaglio.id, -attaccante.danni);
    } else {
      toast(`${attaccante.id} manca ${bersaglio.id}`);
    }

    attaccante.target = bersaglio.id;

    console.log(
      `${superaClasseArmatura ? 'X\tCOLPITO' : '*\tMancato'} \n`,
      `\t${attaccante.id.substring(0, 7)} ->\t ${bersaglio.id} \n`,
      `\t(TPC=${tiroPerColpire}) \t (CA=${bersaglio.classeArmatura})`
    );
  }

  // Una squadra attacca l'altra ??
  // turnoSquadra(idSquadra: string, mappa: Mappa): void {
  //   // 1) Identifica attori
  //   const squadra = this.combattenti().filter(c => c.squadra === idSquadra);
  //   const nemici = this.combattenti().filter(c => c.squadra !== idSquadra);

  //   if (squadra.length === 0 || nemici.length === 0) {
  //     toast("Squadra o nemici non trovati", "danger");
  //     return;
  //   }

  //   // 2) Fase d'azione per ogni combattente della squadra
  //   console.log(`\n\nTurno squadra '${idSquadra}'`);
  //   for (const attaccante of squadra) {
  //     // Sceglie il nemico 
  //     const nemicoPrescelto = this.scegliNemico(attaccante, nemici, mappa);
  //     // si muove di 6 quadrati verso il nemico
  //     this.movimento(attaccante, nemicoPrescelto, mappa);
  //     // Attacca il nemico 
  //     this.tiraPerColpire(attaccante, nemicoPrescelto);
  //   }
  // }

  // turno squadra
  getMembriSquadra(inSquadra:string)
  : {membri: Combattente[], avversari: Combattente[]} {
    const membri = this.combattenti().filter(c => c.squadra === inSquadra);
    const avversari = this.combattenti().filter(c => c.squadra !== inSquadra);
    return { membri, avversari };
  }

  /*  Sceglie il nemico da attaccare
    - dipende da: convertiRigaInNumero() e coordinateCombattente()
  */
  scegliNemico(attaccante: Combattente, nemici: Combattente[], mappa?: Mappa): Combattente {
    if(nemici.length === 0){
      console.error("non risultano nemici disponibili");
      return null as unknown as Combattente;
    }

    // 1) Se esiste già un target, lo cerco nella mappa
    if (attaccante.target) {
      const nemico = this.getCombattenteById(attaccante.target);
      if (nemico) return nemico;
    }

    // 2) Nemico a caso
    function nemicoCasuale() {
      console.warn(`${attaccante.id} sceglie nemico casuale`, mappa ? "" : "MAPPA ASSENTE");
      return nemici[Math.floor(Math.random() * nemici.length)];
    }
    // mappa non disponibile
    if(!mappa) return nemicoCasuale();
    
    // Se non trovo le coordinate dell'attaccante 
    const coordinateAttaccante = this.coordinateCombattente(mappa, attaccante.id);
    if (!coordinateAttaccante) {
      // ritorno un nemico random
      console.warn(`${attaccante.id} non trova un avversario. Perciò sceglie casualmente`);
      return nemicoCasuale();
    }

    // 3) Calcolo la distanza tra l'attaccante e ogni nemico
    let nemicoPiuVicino = nemici[0];
    let distanzaMinima = Infinity;

    for (const nemico of nemici) {
      const coordinateNemico = this.coordinateCombattente(mappa, nemico.id);
      if (!coordinateNemico) continue;

      const distanza = Math.sqrt(
        Math.pow(coordinateNemico.colonna - coordinateAttaccante.colonna, 2) +
        Math.pow(this.convertiRigaInNumero(coordinateNemico.riga) 
                -this.convertiRigaInNumero(coordinateAttaccante.riga), 2)
      );

      if (distanza < distanzaMinima) {
        distanzaMinima = distanza;
        nemicoPiuVicino = nemico;
      }
    }

    return nemicoPiuVicino;
  }

  movimento(attaccante: Combattente, avversario: Combattente, mappa: WritableSignal<Mappa>): void {
    if (attaccante.tipo == 'mischia'){
      // Trova le coordinate dell'attaccante e dell'avversario
      const coordAttaccante = this.coordinateCombattente(mappa(), attaccante.id);
      const coordAvversario = this.coordinateCombattente(mappa(), avversario.id);
  
      if (!coordAttaccante || !coordAvversario) {
        console.error("Coordinate non trovate per attaccante o avversario");
        return;
      }
  
      // Calcola la direzione del movimento (1 quadrato verso l'avversario)
      const rigaAttaccante = this.convertiRigaInNumero(coordAttaccante.riga);
      const rigaAvversario = this.convertiRigaInNumero(coordAvversario.riga);
      const colonnaAttaccante = coordAttaccante.colonna;
      const colonnaAvversario = coordAvversario.colonna;
  
      // Determina la direzione preferita (verso l'avversario)
      const direzioneRigaPreferita = rigaAttaccante < rigaAvversario ? 1 : (rigaAttaccante > rigaAvversario ? -1 : 0);
      const direzioneColonnaPreferita = colonnaAttaccante < colonnaAvversario ? 1 : (colonnaAttaccante > colonnaAvversario ? -1 : 0);
  
      // Genera le 3 celle adiacenti prioritarie (sinistra, destra, sopra/sotto)
      const possibiliPosizioni = [
        // 1. Direzione preferita (verso l'avversario)
        {
          riga: String.fromCharCode(65 + rigaAttaccante + direzioneRigaPreferita),
          colonna: colonnaAttaccante + direzioneColonnaPreferita,
        },
        // 2. Alternativa orizzontale
        {
          riga: coordAttaccante.riga,
          colonna: colonnaAttaccante + (direzioneColonnaPreferita !== 0 ? -direzioneColonnaPreferita : 1),
        },
        // 3. Alternativa verticale
        {
          riga: String.fromCharCode(65 + rigaAttaccante + (direzioneRigaPreferita !== 0 ? -direzioneRigaPreferita : 1)),
          colonna: colonnaAttaccante,
        },
      ];
  
      // Trova la prima posizione valida e libera
      let nuovaPosizione = null;
      for (const pos of possibiliPosizioni) {
        if (
          mappa()[pos.riga] !== undefined &&
          pos.colonna >= 0 &&
          pos.colonna < mappa()[pos.riga].length &&
          mappa()[pos.riga][pos.colonna] === ''
        ) {
          nuovaPosizione = pos;
          break;
        }
      }
  
      // Se trovata una posizione valida, aggiorna la mappa
      if (nuovaPosizione) {
        const nuovaMappa = structuredClone(mappa());
        nuovaMappa[coordAttaccante.riga][coordAttaccante.colonna] = '';
        nuovaMappa[nuovaPosizione.riga][nuovaPosizione.colonna] = attaccante.id;
        mappa.set(nuovaMappa);
      }
    } else if (attaccante.tipo == 'distanza') {
      return;
    }
  }



  // controlla se due giocatori sono vicini
  sonoVicini(attaccante: Combattente, avversario: Combattente, mappa: Mappa): boolean {
    const coordAttaccante = this.coordinateCombattente(mappa, attaccante.id);
    const coordAvversario = this.coordinateCombattente(mappa, avversario.id);

    if (!coordAttaccante || !coordAvversario) {
      return false;
    }

    const rigaAttaccante = this.convertiRigaInNumero(coordAttaccante.riga);
    const rigaAvversario = this.convertiRigaInNumero(coordAvversario.riga);

    const deltaRighe = Math.abs(rigaAttaccante - rigaAvversario);
    const deltaColonne = Math.abs(coordAttaccante.colonna - coordAvversario.colonna);

    // Sono vicini se la distanza è <= 1 in entrambe le direzioni (8 celle circostanti)
    // console.log(attaccante.id, {deltaRighe, deltaColonne});
    return deltaRighe <= 1 && deltaColonne <= 1 
        && (deltaRighe + deltaColonne > 0);
  }

  private coordinateCombattente(mappa: Mappa, idCombattente: string)
    : { riga: string; colonna: number } | null {
    for (const [riga, colonne] of Object.entries(mappa)) {
      const index = colonne.findIndex(id => id === idCombattente);
      if (index !== -1) {
        return { riga, colonna: index };
      }
    }
    return null;
  }

  // 'A' -> 0, 'B' -> 1, etc.
  private convertiRigaInNumero(riga: string): number {
    return riga.charCodeAt(0) - 65; 
  }


}
