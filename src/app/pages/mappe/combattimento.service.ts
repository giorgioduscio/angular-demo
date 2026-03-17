import { Injectable, signal } from '@angular/core';
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
      `${superaClasseArmatura ? 'X\tCOLPITO' : '-\tmancato'} \n`,
      `\t${attaccante.id} ->\t ${bersaglio.id} \n`,
      `\t(TPC=${tiroPerColpire}) \t (CA=${bersaglio.classeArmatura})`
    );
  }

  // Una squadra attacca l'altra
  turnoSquadra(idSquadra: string): void {
    // 1) identifica attori
    let squadra: Combattente[] = [];
    let nemici: Combattente[] = [];

    for (const combattente of this.combattenti()) {
      if (combattente.squadra === idSquadra) {
        squadra.push(combattente);
      } else {
        nemici.push(combattente);
      }
    }

    if (squadra.length === 0 || nemici.length === 0) {
      toast("Squadra o nemici non trovati", "danger");
      return;
    }

    // esegue tiri per colpire
    console.log(`\n\nTurno squadra '${idSquadra}'`);
    for (const attaccante of squadra) {
      let nemicoPrescelto = this.getCombattenteById(attaccante.target);
      if (!nemicoPrescelto) {
        nemicoPrescelto = nemici[Math.floor(Math.random() * nemici.length)];
      }

      this.tiraPerColpire(attaccante, nemicoPrescelto);
    }
  }
}
