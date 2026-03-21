import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { agree, toast } from "../../tools/feedbacksUI";
import { statisticheGradoSfida } from "./gradiSfida";
import { Mappa, MappaService } from "./mappa.service";

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
  constructor(private mappa:MappaService) {
    effect(()=>{
      // lista decrescente dei combattenti per numeroTurno
      this.listaCombattenti = this.combattenti()
        .sort((a, b) => b.numeroTurno - a.numeroTurno);
    })
  }
  combattenti = signal<Combattente[]>([]);

  // Ottieni combattenti
  listaCombattenti!:Combattente[];
  giocatoreUltimoTurno='';
  getCombattenteById(combattenteId: string): Combattente | undefined {
    combattenteId = combattenteId.toLocaleLowerCase();
    return this.combattenti().find(c => c.id.toLocaleLowerCase() === combattenteId);
  }

  // Rimuovi un combattente
  async rimuoviCombattente(combattenteId: string, showAgree = false): Promise<void> {
    if(showAgree && !await agree(`Rimuovere ${combattenteId}?`, "Rimuovi", "danger")) return;

    combattenteId = combattenteId.toLocaleLowerCase();
    const combattentiAggiornati = this.combattenti().filter(
      c => c.id.toLocaleLowerCase() !== combattenteId
    );

    this.combattenti.set(combattentiAggiornati);
    this.mappa.rimuoviSimbolo(combattenteId);

    const test = combattentiAggiornati.find(c => c.id.toLocaleLowerCase() === combattenteId);
    if (test) {
      console.error("Combattente non rimosso", test);
      return;
    }
    toast(`${combattenteId} rimosso`, "success");
  }

  // Ottieni un nome casuale per un combattente
  private coloriSquadre={
    a: '#009494ff',
    b: '#009900ff',
    c: '#0000ddff',
    d: '#888800ff',
    e: '#a100a1ff',
    f: '#aa0000ff',
    g: '#8c5b00ff',
    h: '#800080',
    i: '#b74357ff',
    j: '#891616ff'
  } as const;
  getColoreSquadra(squadra: string): string {
    return this.coloriSquadre[squadra as keyof typeof this.coloriSquadre];
  }

  private getNomeRandom(): string {
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
    const numeroTurno = (Math.random() * 20) + bonusIniziativa;
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
  vitalitaPersonaggio(combattenteId: string, bonus: number): void {
    const combattente = this.getCombattenteById(combattenteId.toLocaleLowerCase());
    if (!combattente) {
      toast("Combattente non trovato", "danger");
      return;
    }

    const hpIniziali = combattente.puntiFerita;
    const combattentiAggiornati = this.combattenti().map(c => {
      if (c.id.toLocaleLowerCase() === combattenteId.toLocaleLowerCase()) {
        return { ...c, puntiFerita: c.puntiFerita + bonus };
      }
      return c;
    });

    this.combattenti.set(combattentiAggiornati);

    const combattenteAggiornato = combattentiAggiornati.find(c => c.id.toLocaleLowerCase() === combattenteId.toLocaleLowerCase());
    if (!combattenteAggiornato) return;

    if (combattenteAggiornato.puntiFerita <= 0) {
      this.rimuoviCombattente(combattenteId.toLocaleLowerCase());
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
    const danni =(attaccante.danni);

    if (superaClasseArmatura) {
      this.vitalitaPersonaggio(bersaglio.id, -danni);
      toast(`${attaccante.id} infligge ${danni} danni a ${bersaglio.id}`, "success");
    } else toast(`${attaccante.id} manca ${bersaglio.id}`, "danger");

    attaccante.target = bersaglio.id;

    console.log(
      `${superaClasseArmatura ? 'X' : '*'}\t`,
      `${attaccante.id.substring(0, 7)} ${superaClasseArmatura ? 'COLPISCE' : 'manca'} ${bersaglio.id} \n`,
      `\t(TPC=${tiroPerColpire}) \t\t (CA=${bersaglio.classeArmatura})`
    );
  }

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
  scegliNemico(attaccante: Combattente, nemici: Combattente[], mappa?: Mappa): Combattente | null {
    if(nemici.length === 0){
      console.error("non risultano nemici disponibili");
      return null;
    }

    //  Se esiste già un target, lo cerca nella mappa
        if (attaccante.target) {
          const nemico = this.getCombattenteById(attaccante.target);
          if (nemico) return nemico;
        }

        // mappa non disponibile
        if(!mappa){
          console.error("mappa non disponibile");
          return null;
        }
        
        // coordinate dell'attaccante 
        const coordinateAttaccante = this.coordinateCombattente(mappa, attaccante.id);
        if (!coordinateAttaccante) {
          console.error(`Coordinate di ${attaccante.id} non trovate`);
          return null;
        }

    //  Calcolo la distanza tra l'attaccante e ogni nemico
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

        if(!nemicoPiuVicino) {
          console.error(attaccante.id, "non trova nemici vicini");
          return null;
        }
        // console.log(`${attaccante.id} sceglie ${nemicoPiuVicino.id}`);

    return nemicoPiuVicino;
  }

  sonoPortata(attaccante: Combattente, avversario: Combattente, mappa: Mappa): boolean {
    const coordAttaccante = this.coordinateCombattente(mappa, attaccante.id);
    const coordAvversario = this.coordinateCombattente(mappa, avversario.id);

    if (!coordAttaccante || !coordAvversario) {
      console.error(`coordinate assenti\n`, 
                    `${attaccante.id} (${coordAttaccante?.riga}-${coordAttaccante?.colonna})\n`, 
                    `${avversario.id}(${coordAvversario?.riga}-${coordAvversario?.colonna})`);
      return false;
    }

    const rigaAttaccante = this.convertiRigaInNumero(coordAttaccante.riga);
    const rigaAvversario = this.convertiRigaInNumero(coordAvversario.riga);

    const deltaRighe = Math.abs(rigaAttaccante - rigaAvversario);
    const deltaColonne = Math.abs(coordAttaccante.colonna - coordAvversario.colonna);

    // Mischia: distanza <= 1 (8 celle circostanti)
    if (attaccante.tipo === 'mischia') {
      return deltaRighe <= 1 && deltaColonne <= 1 && (deltaRighe + deltaColonne > 0);
    }
    // Distanza: portata <= 6 quadrati (in linea d'aria, incluse diagonali)
    else if (attaccante.tipo === 'distanza') {
      const distanza = Math.sqrt(Math.pow(deltaRighe, 2) + Math.pow(deltaColonne, 2));      
      return distanza <= 6;
    }

    return false;
  }

  movimento(attaccante: Combattente, avversario: Combattente, mappa: WritableSignal<Mappa>): void {
    // trova coordinate
    const coordAttaccante = this.coordinateCombattente(mappa(), attaccante.id);
    const coordAvversario = this.coordinateCombattente(mappa(), avversario.id);

    if (!coordAttaccante || !coordAvversario) {
      console.error(`Coordinate non trovate:
        ${attaccante.id}: ${coordAttaccante?.riga}-${coordAttaccante?.colonna}
        ${avversario.id}: ${coordAvversario?.riga}-${coordAvversario?.colonna}`);
      return;
    }

    const rigaAttaccante = this.convertiRigaInNumero(coordAttaccante.riga);
    const colonnaAttaccante = coordAttaccante.colonna;
    const rigaAvversario = this.convertiRigaInNumero(coordAvversario.riga);
    const colonnaAvversario = coordAvversario.colonna;

    // Direzioni possibili (8 celle adiacenti)
    const direzioni = [
      { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
      { dr: 0, dc: -1 },                     { dr: 0, dc: 1 },
      { dr: 1, dc: -1 },  { dr: 1, dc: 0 }, { dr: 1, dc: 1 }
    ];

    // Genera tutte le posizioni adiacenti valide
    const possibiliPosizioni = direzioni
      .map(direzione => ({
        riga: String.fromCharCode(65 + rigaAttaccante + direzione.dr),
        colonna: colonnaAttaccante + direzione.dc,
        // Ritorna il quadrato della distanza euclidea tra due punti
        distanza: Math.sqrt(
          Math.pow(rigaAttaccante + direzione.dr - rigaAvversario, 2) +
          Math.pow(colonnaAttaccante + direzione.dc - colonnaAvversario, 2)
        )
      }))
      .filter(pos =>
        mappa()[pos.riga] !== undefined &&
        pos.colonna >= 0 &&
        pos.colonna < mappa()[pos.riga].length &&
        mappa()[pos.riga][pos.colonna] === ''
      )
      .sort((a, b) => a.distanza - b.distanza); // Ordina per vicinanza all'avversario

    // Scegli la prima posizione valida (più vicina all'avversario)
    const nuovaPosizione = possibiliPosizioni[0];
    if (nuovaPosizione) {
      // console.log(`${attaccante.id} in ${nuovaPosizione.riga}${nuovaPosizione.colonna}`);
      const nuovaMappa = structuredClone(mappa());
      nuovaMappa[coordAttaccante.riga][coordAttaccante.colonna] = '';
      nuovaMappa[nuovaPosizione.riga][nuovaPosizione.colonna] = attaccante.id;
      mappa.set(nuovaMappa);
    } else {
      console.warn(`${attaccante.id} non può muoversi: tutte le celle adiacenti sono occupate.`);
    }
  }

  private coordinateCombattente(mappa: Mappa, combattenteId: string)
    : { riga: string; colonna: number } | null {
    for (const [riga, colonne] of Object.entries(mappa)) {
      const index = colonne.findIndex(id => id.toLowerCase() === combattenteId.toLowerCase());
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



