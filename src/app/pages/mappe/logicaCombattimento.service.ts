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




  turnoSquadra(nomeSquadra: string, mappa: { [key: string]: string[] }, righe: number, colonne: number): void {
    const combattentiSquadra = [...this.combattenti]
      .filter(c => c.squadra === nomeSquadra)
      .sort((a, b) => b.numeroTurno - a.numeroTurno);

    if (combattentiSquadra.length === 0) {
      toast(`Squadra ${nomeSquadra} è vuota`, "danger");
      return;
    }

    const squadreNemiche = [...new Set(this.combattenti.map(c => c.squadra))].filter(s => s !== nomeSquadra);
    const nemici = this.combattenti.filter(c => squadreNemiche.includes(c.squadra));

    combattentiSquadra.forEach(combattente => {
      if (combattente.puntiFerita <= 0) {
        return;
      }

      const nemicoPiuVicino = this.trovaNemicoPiuVicino(combattente, nemici, mappa, righe, colonne);

      if (nemicoPiuVicino) {
        combattente.target = nemicoPiuVicino.id;

        if (combattente.tipo === "mischia") {
          const posizioneCombattente = this.trovaPosizione(combattente.id, mappa, righe, colonne);
          const posizioneNemico = this.trovaPosizione(nemicoPiuVicino.id, mappa, righe, colonne);

          if (posizioneCombattente && posizioneNemico) {
            const distanza = this.calcolaDistanza(posizioneCombattente, posizioneNemico);

            if (distanza === 1) {
              this.tiraPerColpire(combattente, nemicoPiuVicino);
            } else {
              this.muoviVersoNemico(combattente, nemicoPiuVicino, mappa, righe, colonne, 6);
            }
          }
        } else if (combattente.tipo === "distanza") {
          this.mantieniDistanza(combattente, nemicoPiuVicino, mappa, righe, colonne, 6);
          this.tiraPerColpire(combattente, nemicoPiuVicino);
        }
      } else {
        toast(`${combattente.id} non trova nemici!`, "danger");
      }
    });
  }

  trovaNemicoPiuVicino(combattente: Combattente, nemici: Combattente[], mappa: Mappa, righe: number, colonne: number): Combattente | null {
    let nemicoPiuVicino: Combattente | null = null;
    let distanzaMinima = Infinity;

    const posizioneCombattente = this.trovaPosizione(combattente.id, mappa, righe, colonne);
    if (!posizioneCombattente) return null;

    nemici.forEach(nemico => {
      const posizioneNemico = this.trovaPosizione(nemico.id, mappa, righe, colonne);
      if (!posizioneNemico) return;

      const distanza = Math.abs(posizioneCombattente.riga.charCodeAt(0) - posizioneNemico.riga.charCodeAt(0)) +
        Math.abs(posizioneCombattente.colonna - posizioneNemico.colonna);

      if (distanza < distanzaMinima) {
        distanzaMinima = distanza;
        nemicoPiuVicino = nemico;
      }
    });

    return nemicoPiuVicino;
  }

  trovaPosizione(id: string, mappa: { [key: string]: string[] }, righe: number, colonne: number): { riga: string, colonna: number } | null {
    const lettereRighe = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();

    for (let i = 0; i < righe; i++) {
      const letteraRiga = lettereRighe[i];
      const riga = mappa[letteraRiga];
      if (!riga) continue;

      for (let j = 0; j < colonne; j++) {
        if (riga[j] === id) {
          return { riga: letteraRiga, colonna: j };
        }
      }
    }

    return null;
  }

  calcolaDistanza(posizione1: { riga: string, colonna: number }, posizione2: { riga: string, colonna: number }): number {
    const distanzaRighe = Math.abs(posizione1.riga.charCodeAt(0) - posizione2.riga.charCodeAt(0));
    const distanzaColonne = Math.abs(posizione1.colonna - posizione2.colonna);
    return Math.max(distanzaRighe, distanzaColonne);
  }

  muoviVersoNemico(combattente: Combattente, nemico: Combattente, mappa: { [key: string]: string[] }, righe: number, colonne: number, passi: number): void {
    const posizioneCombattente = this.trovaPosizione(combattente.id, mappa, righe, colonne);
    const posizioneNemico = this.trovaPosizione(nemico.id, mappa, righe, colonne);

    if (!posizioneCombattente || !posizioneNemico) return;

    let nuovaRiga = posizioneCombattente.riga;
    let nuovaColonna = posizioneCombattente.colonna;

    for (let i = 0; i < passi; i++) {
      const direzioneRiga = posizioneNemico.riga.charCodeAt(0) - nuovaRiga.charCodeAt(0);
      const direzioneColonna = posizioneNemico.colonna - nuovaColonna;

      if (direzioneRiga !== 0) {
        const nuovaRigaTemp = String.fromCharCode(nuovaRiga.charCodeAt(0) + Math.sign(direzioneRiga));
        if (mappa[nuovaRigaTemp] && nuovaRigaTemp.charCodeAt(0) >= 65 && nuovaRigaTemp.charCodeAt(0) < 65 + righe) {
          nuovaRiga = nuovaRigaTemp;
        }
      } else if (direzioneColonna !== 0) {
        const nuovaColonnaTemp = nuovaColonna + Math.sign(direzioneColonna);
        if (nuovaColonnaTemp >= 0 && nuovaColonnaTemp < colonne) {
          nuovaColonna = nuovaColonnaTemp;
        }
      }
    }

    if (mappa[nuovaRiga] && nuovaColonna >= 0 && nuovaColonna < mappa[nuovaRiga].length) {
      mappa[posizioneCombattente.riga][posizioneCombattente.colonna] = '';
      mappa[nuovaRiga][nuovaColonna] = combattente.id;
    }
  }

  mantieniDistanza(combattente: Combattente, nemico: Combattente, mappa: { [key: string]: string[] }, righe: number, colonne: number, distanzaIdeale: number): void {
    const posizioneCombattente = this.trovaPosizione(combattente.id, mappa, righe, colonne);
    const posizioneNemico = this.trovaPosizione(nemico.id, mappa, righe, colonne);

    if (!posizioneCombattente || !posizioneNemico) return;

    const distanzaAttuale = this.calcolaDistanza(posizioneCombattente, posizioneNemico);

    if (distanzaAttuale === distanzaIdeale) return;

    let nuovaRiga = posizioneCombattente.riga;
    let nuovaColonna = posizioneCombattente.colonna;

    const direzioneRiga = posizioneNemico.riga.charCodeAt(0) - posizioneCombattente.riga.charCodeAt(0);
    const direzioneColonna = posizioneNemico.colonna - posizioneCombattente.colonna;

    if (distanzaAttuale < distanzaIdeale) {
      for (let i = 0; i < distanzaIdeale - distanzaAttuale; i++) {
        if (direzioneRiga !== 0) {
          const nuovaRigaTemp = String.fromCharCode(nuovaRiga.charCodeAt(0) - Math.sign(direzioneRiga));
          if (mappa[nuovaRigaTemp] && nuovaRigaTemp.charCodeAt(0) >= 65 && nuovaRigaTemp.charCodeAt(0) < 65 + righe) {
            nuovaRiga = nuovaRigaTemp;
          }
        } else if (direzioneColonna !== 0) {
          const nuovaColonnaTemp = nuovaColonna - Math.sign(direzioneColonna);
          if (nuovaColonnaTemp >= 0 && nuovaColonnaTemp < colonne) {
            nuovaColonna = nuovaColonnaTemp;
          }
        }
      }
    } else if (distanzaAttuale > distanzaIdeale) {
      for (let i = 0; i < distanzaAttuale - distanzaIdeale; i++) {
        if (direzioneRiga !== 0) {
          const nuovaRigaTemp = String.fromCharCode(nuovaRiga.charCodeAt(0) + Math.sign(direzioneRiga));
          if (mappa[nuovaRigaTemp] && nuovaRigaTemp.charCodeAt(0) >= 65 && nuovaRigaTemp.charCodeAt(0) < 65 + righe) {
            nuovaRiga = nuovaRigaTemp;
          }
        } else if (direzioneColonna !== 0) {
          const nuovaColonnaTemp = nuovaColonna + Math.sign(direzioneColonna);
          if (nuovaColonnaTemp >= 0 && nuovaColonnaTemp < colonne) {
            nuovaColonna = nuovaColonnaTemp;
          }
        }
      }
    }

    if (mappa[nuovaRiga] && nuovaColonna >= 0 && nuovaColonna < mappa[nuovaRiga].length) {
      mappa[posizioneCombattente.riga][posizioneCombattente.colonna] = '';
      mappa[nuovaRiga][nuovaColonna] = combattente.id;
    }
  }

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
