import { Injectable } from '@angular/core';
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

@Injectable({  providedIn: 'root' })
export class CombattimentoService {
  constructor() { }
  
  combattenti: Combattente[] = [];
  getCombattenteById(idCombattente: string): Combattente | undefined {
    idCombattente = idCombattente.toLocaleLowerCase();
    return this.combattenti.find(c => c.id.toLocaleLowerCase() === idCombattente);
  }
  removeCombattente(idCombattente: string): void {
    idCombattente = idCombattente.toLocaleLowerCase();
    this.combattenti = this.combattenti.filter(c => c.id.toLocaleLowerCase() !== idCombattente);
  }

  // INIZIO COMBATTIMENTO
  getNomeRandom(): string {
    const nomiDefault = ['Rosso', 'Blu', 'Giallo', 
      'Verde', 'Arancione', 'Viola', 'Nero', 'Bianco', 
      'Marrone', 'Grigio', 'Celeste', 'Magenta', 'Ciano', 
      'Arancio', 'Indaco', 'Avorio', 'Cacao', 'Citrino', 
      'Dorato', 'Ebano', 'Kaki', 'Lavanda', 'Nocciola', 
      'Fucsia', 'Oliva', 'Perla', 'Rosa', 'Salmone', 'Turchese'
    ];
    const nomiDisponibili = nomiDefault.filter(nome => !this.combattenti.some(c => c.id === nome));
    return nomiDisponibili[Math.floor(Math.random() * nomiDisponibili.length)];
  }

  // AGGIUNGI UN COMBATTENTE ALLA LISTA
  addCombattente(nomeSquadra: string, bonusIniziativa: number, 
                gradoSfida: string, nomePersonaggio: string, 
                classeArmatura: number, 
                tipoCombettente: 'mischia' | 'distanza' = 'mischia'
              ): void {
    const numeroTurno = Math.floor(Math.random() * 20) + bonusIniziativa;
    const matchGradoSfida = statisticheGradoSfida.find(gs => gs.gradoSfida === gradoSfida);
    const nuovoNome = nomePersonaggio.trim() !== ''
      ? nomePersonaggio.trim()
      : this.getNomeRandom();

    if (!nuovoNome || !nomeSquadra) {
      console.error("errore", { nomeSquadra, nuovoNome });
      return;
    }

    const nuovoCombattente: Combattente = {
      id: nuovoNome,
      tipo: tipoCombettente,
      puntiFerita: matchGradoSfida?.puntiFerita ?? 0,
      danni: matchGradoSfida?.danniRound ?? 0,
      bonusAttacco: matchGradoSfida?.bonusAttacco ?? 0,
      classeArmatura: classeArmatura ? classeArmatura : matchGradoSfida?.classeArmatura ?? 10,
      target: "",
      squadra: nomeSquadra,
      numeroTurno: numeroTurno,
    };
    this.combattenti.push(nuovoCombattente);
  }

  // POSIZIONA I COMBATTENTI SU LATI OPPOSTI DELLA MAPPA
  posizionamento(mappa: Mappa, righe: number, colonne: number): void {
    if (!mappa || righe === 0 || colonne === 0) {
      toast("Giocatore non inseribile nella mappa", "danger");
      return;
    }

    const lettereRighe = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      if (mappa[letteraRiga]) {
        mappa[letteraRiga].fill('');
      }
    }

    const squadre = [...new Set(this.combattenti.map(c => c.squadra))];

    if (squadre.length === 0) {
      toast("Nessuna squadra da posizionare", "danger");
      return;
    }

    squadre.forEach((squadra, index) => {
      const combattentiSquadra = this.combattenti.filter(c => c.squadra === squadra);
      const isLeft = index % 2 === 0;
      const step = Math.max(1, Math.floor(righe / combattentiSquadra.length));

      combattentiSquadra.forEach((combattente, indiceCombattente) => {
        const riga = String.fromCharCode(65 + indiceCombattente * step);
        const colonna = isLeft ? 0 : colonne - 1;

        if (mappa[riga] && colonna >= 0 && colonna < mappa[riga].length) {
          mappa[riga][colonna] = combattente.id;
        }
      });
    });

    toast("Combattenti posizionati con successo!", "success");
  }

  // DANNEGGIA O GUARISCE UN PERSONAGGIO
  vitalita_personaggio(idCombattente: string, bonus: number): void {
    const combattente = this.getCombattenteById(idCombattente.toLocaleLowerCase());
    if (!combattente) {
      toast("combattente non trovato", "danger");
      return;
    }
    const hpIniziali = combattente.puntiFerita;
    combattente.puntiFerita += bonus;

    if (combattente.puntiFerita <= 0) {
      this.removeCombattente(idCombattente.toLocaleLowerCase());
      return toast(`${combattente.id} sconfitto`, "danger");
    }
    if(hpIniziali!==combattente.puntiFerita){
      toast(`HP ${combattente.id} aggiornati`, 'success');
    }
  }

  // PERSONAGGI DI UNA SQUADRA ATTACCANO GLI AVVERSARI
  // dipende da vitalita_personaggio
  tiraPerColpire(attaccante: Combattente, bersaglio: Combattente): void {
    const tiroPerColpire = attaccante.bonusAttacco + Math.floor(Math.random() * 20);
    const superaClasseArmatura = tiroPerColpire >= bersaglio.classeArmatura;
    if (superaClasseArmatura) {
      this.vitalita_personaggio(bersaglio.id, -attaccante.danni);
    } else {
      toast(`${attaccante.id} manca ${bersaglio.id}`);
    }
    attaccante.target = bersaglio.id;

    console.log(`${superaClasseArmatura ? 'COLPITO' : 'mancato'} \n`,
      `\t${attaccante.id} ->\t ${bersaglio.id} \n`,
      `\t(TPC=${tiroPerColpire}) \t (CA=${bersaglio.classeArmatura})`);
  }

}
