import { Injectable, WritableSignal } from '@angular/core';
import { toast } from "../../tools/feedbacksUI";
import { Mappa, MappaService } from "./mappa.service";
import { Combattente, FightersService } from "./fighters.service";

@Injectable({ providedIn: 'root' })
export class CombattimentoService {
  constructor(
    private mappaService: MappaService,
    private fightersService: FightersService
  ) {}

  /** Posiziona tutti i combattenti sulla mappa, distribuendo le squadre in angoli opposti. */
  posizionamento(): void {
    const mappa = this.mappaService.mappa_value();
    const righe = this.mappaService.mappa_righe().length;
    const colonne = this.mappaService.mappa_colonne().length;

    if (!mappa || righe === 0 || colonne === 0) {
      toast.danger("Mappa non valida");
      return;
    }

    const combattenti = this.fightersService.combattenti();
    const squadre = [...new Set(combattenti.map(c => c.squadra))];
    if (squadre.length === 0) {
      console.error("Nessuna squadra da posizionare");
      return;
    }

    // Reset delle celle occupate
    for (const [riga, colonneArray] of Object.entries(mappa.value)) {
      if (colonneArray.some(id => id !== '')) {
        mappa.value[riga].fill('');
      }
    }

    const angoli = [
      { riga: 0, colonna: 0 },
      { riga: 0, colonna: colonne - 1 },
      { riga: righe - 1, colonna: colonne - 1 },
      { riga: righe - 1, colonna: 0 }
    ];

    squadre.forEach((squadra, index) => {
      const angolo = angoli[index % 4];
      const combattentiSquadra = combattenti.filter(c => c.squadra === squadra);

      let rigaCorrente = angolo.riga;
      let colonnaCorrente = angolo.colonna;

      for (const combattente of combattentiSquadra) {
        let posizioneTrovata = false;
        const direzioni = [
          { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: -1, dc: 0 }
        ];

        for (const direzione of direzioni) {
          const nuovaRiga = rigaCorrente + direzione.dr;
          const nuovaColonna = colonnaCorrente + direzione.dc;
          const letteraRiga = String.fromCharCode(65 + nuovaRiga);

          if (
            mappa.value[letteraRiga] !== undefined &&
            nuovaColonna >= 0 &&
            nuovaColonna < mappa.value[letteraRiga].length &&
            mappa.value[letteraRiga][nuovaColonna] === ''
          ) {
            mappa.value[letteraRiga][nuovaColonna] = combattente.id;
            rigaCorrente = nuovaRiga;
            colonnaCorrente = nuovaColonna;
            posizioneTrovata = true;
            break;
          }
        }

        if (!posizioneTrovata) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nuovaRiga = angolo.riga + dr;
              const nuovaColonna = angolo.colonna + dc;
              const letteraRiga = String.fromCharCode(65 + nuovaRiga);

              if (
                mappa.value[letteraRiga] !== undefined &&
                nuovaColonna >= 0 &&
                nuovaColonna < mappa.value[letteraRiga].length &&
                mappa.value[letteraRiga][nuovaColonna] === ''
              ) {
                mappa.value[letteraRiga][nuovaColonna] = combattente.id;
                posizioneTrovata = true;
                break;
              }
            }
            if (posizioneTrovata) break;
          }
        }
      }
    });

    toast.success("Combattenti posizionati con successo!");
  }

  tiraPerColpire(attaccante: Combattente, bersaglio: Combattente): void {
    const tiroPerColpire = attaccante.bonusAttacco + Math.floor(Math.random() * 20);
    const superaClasseArmatura = tiroPerColpire >= bersaglio.classeArmatura;
    const danni = attaccante.danni;

    if (superaClasseArmatura) {
      this.fightersService.vitalitaPersonaggio(bersaglio.id, -danni);
    } else {
      toast.danger(`${attaccante.id} manca ${bersaglio.id}`);
    }

    attaccante.target = bersaglio.id;

    console.log(
      `${superaClasseArmatura ? 'X' : '*'}\t`,
      `${attaccante.id.substring(0, 7)} ${superaClasseArmatura ? 'COLPISCE' : 'manca'} ${bersaglio.id} \n`,
      `\t(TPC=${tiroPerColpire}) \t\t (CA=${bersaglio.classeArmatura})`
    );
  }

  getMembriSquadra(inSquadra: string): { membri: Combattente[], avversari: Combattente[] } {
    const combattenti = this.fightersService.combattenti();
    const membri = combattenti.filter(c => c.squadra === inSquadra);
    const avversari = combattenti.filter(c => c.squadra !== inSquadra);
    return { membri, avversari };
  }

  scegliNemico(attaccante: Combattente, nemici: Combattente[], mappa?: Mappa): Combattente | null {
    if (nemici.length === 0) {
      console.error("non risultano nemici disponibili");
      return null;
    }

    if (attaccante.target) {
      const nemico = this.fightersService.getCombattenteById(attaccante.target);
      if (nemico) return nemico;
    }

    if (!mappa) {
      console.error("mappa non disponibile");
      return null;
    }
    
    const coordinateAttaccante = this.coordinateCombattente(mappa, attaccante.id);
    if (!coordinateAttaccante) {
      console.error(`Coordinate di ${attaccante.id} non trovate`);
      return null;
    }

    let nemicoPiuVicino = nemici[0];
    let distanzaMinima = Infinity;

    for (const nemico of nemici) {
      const coordinateNemico = this.coordinateCombattente(mappa, nemico.id);
      if (!coordinateNemico) continue;

      const distanza = Math.sqrt(
        Math.pow(coordinateNemico.colonna - coordinateAttaccante.colonna, 2) +
        Math.pow(this.convertiRigaInNumero(coordinateNemico.riga) 
                - this.convertiRigaInNumero(coordinateAttaccante.riga), 2)
      );

      if (distanza < distanzaMinima) {
        distanzaMinima = distanza;
        nemicoPiuVicino = nemico;
      }
    }

    return nemicoPiuVicino;
  }

  sonoPortata(attaccante: Combattente, avversario: Combattente, mappa: Mappa): boolean {
    const coordAttaccante = this.coordinateCombattente(mappa, attaccante.id);
    const coordAvversario = this.coordinateCombattente(mappa, avversario.id);

    if (!coordAttaccante || !coordAvversario) return false;

    const rigaAttaccante = this.convertiRigaInNumero(coordAttaccante.riga);
    const rigaAvversario = this.convertiRigaInNumero(coordAvversario.riga);
    const deltaRighe = Math.abs(rigaAttaccante - rigaAvversario);
    const deltaColonne = Math.abs(coordAttaccante.colonna - coordAvversario.colonna);

    if (attaccante.tipo === 'mischia') {
      return deltaRighe <= 1 && deltaColonne <= 1 && (deltaRighe + deltaColonne > 0);
    } else if (attaccante.tipo === 'distanza') {
      const distanza = Math.sqrt(Math.pow(deltaRighe, 2) + Math.pow(deltaColonne, 2));      
      return distanza <= 6;
    }
    return false;
  }

  movimento(attaccante: Combattente, avversario: Combattente, mappaSignal: WritableSignal<Mappa>): void {
    const mappa = mappaSignal();
    if (this.sonoPortata(attaccante, avversario, mappa)) return;

    const coordAttaccante = this.coordinateCombattente(mappa, attaccante.id);
    const coordAvversario = this.coordinateCombattente(mappa, avversario.id);

    if (!coordAttaccante || !coordAvversario) return;

    const direzioni = [
      { dr: -1, dc: 0 }, { dr: -1, dc: 1 }, { dr: 0, dc: 1 }, { dr: 1, dc: 1 },
      { dr: 1, dc: 0 }, { dr: 1, dc: -1 }, { dr: 0, dc: -1 }, { dr: -1, dc: -1 }
    ];

    const direzioniConsentite = direzioni.filter(({ dr, dc }) => {
      const nuovaRiga = String.fromCharCode(coordAttaccante.riga.charCodeAt(0) + dr);
      const nuovaColonna = coordAttaccante.colonna + dc;
      return (
        mappa.value[nuovaRiga] !== undefined &&
        nuovaColonna >= 0 &&
        nuovaColonna < mappa.value[nuovaRiga].length &&
        mappa.value[nuovaRiga][nuovaColonna] === ''
      );
    });

    if (direzioniConsentite.length === 0) return;

    const rigaAttaccante = this.convertiRigaInNumero(coordAttaccante.riga);
    const colonnaAttaccante = coordAttaccante.colonna;
    const rigaAvversario = this.convertiRigaInNumero(coordAvversario.riga);
    const colonnaAvversario = coordAvversario.colonna;

    let direzioneOttimale = { dr: 0, dc: 0 };
    if (rigaAttaccante < rigaAvversario) direzioneOttimale.dr = 1;
    else if (rigaAttaccante > rigaAvversario) direzioneOttimale.dr = -1;

    if (colonnaAttaccante < colonnaAvversario) direzioneOttimale.dc = 1;
    else if (colonnaAttaccante > colonnaAvversario) direzioneOttimale.dc = -1;

    let direzioneScelta = direzioniConsentite[0];
    let distanzaMinima = Infinity;

    for (const direzione of direzioniConsentite) {
      const distanza = Math.abs(direzione.dr - direzioneOttimale.dr) + Math.abs(direzione.dc - direzioneOttimale.dc);
      if (distanza < distanzaMinima) {
        distanzaMinima = distanza;
        direzioneScelta = direzione;
      }
    }

    const nuovaRiga = String.fromCharCode(coordAttaccante.riga.charCodeAt(0) + direzioneScelta.dr);
    const nuovaColonna = coordAttaccante.colonna + direzioneScelta.dc;

    const nuovaMappa = structuredClone(mappa);
    nuovaMappa.value[coordAttaccante.riga][coordAttaccante.colonna] = '';
    nuovaMappa.value[nuovaRiga][nuovaColonna] = attaccante.id;
    mappaSignal.set(nuovaMappa);
  }

  private coordinateCombattente(mappa: Mappa, combattenteId: string): { riga: string; colonna: number } | null {
    for (const [riga, colonne] of Object.entries(mappa.value)) {
      const index = colonne.findIndex(id => id.toLowerCase() === combattenteId.toLowerCase());
      if (index !== -1) return { riga, colonna: index };
    }
    return null;
  }

  private convertiRigaInNumero(riga: string): number {
    return riga.charCodeAt(0) - 65; 
  }
}
