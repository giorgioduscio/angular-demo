import { Injectable, WritableSignal } from '@angular/core';
import { toast } from "../../tools/feedbacksUI";
import { Mappa, MappaService } from "./mappa.service";
import { Combattente, FightersService } from "./fighters.service";

/**
 * Service dedicato alla gestione della logica di combattimento,
 * inclusi il posizionamento, gli attacchi e il movimento sulla mappa.
 */
@Injectable({ providedIn: 'root' })
export class CombatService {
  constructor(
    private mappaService: MappaService,
    private fightersService: FightersService
  ) {}

  /** 
   * Distribuisce automaticamente i combattenti sulla mappa all'inizio del gioco.
   * Divide le squadre nei quattro angoli della mappa e posiziona i membri
   * in modo compatto cercando le prime celle libere adiacenti all'angolo.
   */
  posizionamento(): void {
    const mappaOriginale = this.mappaService.mappa_value();
    const mappa = JSON.parse(JSON.stringify(mappaOriginale)) as Mappa;
    const righeKeys = this.mappaService.mappa_righe();
    const colonneArray = this.mappaService.mappa_colonne().length;

    if (!mappa || righeKeys.length === 0 || colonneArray === 0) {
      toast.danger("Mappa non valida");
      return;
    }

    const combattenti = this.fightersService.combattenti();
    const squadre = [...new Set(combattenti.map(c => c.squadra))];
    
    if (squadre.length === 0) {
      console.error("Nessuna squadra da posizionare");
      return;
    }

    // Pulisce la mappa dai nomi dei combattenti precedenti prima del riposizionamento
    const ids = combattenti.map(c => c.id.toLowerCase());
    for (const riga of Object.keys(mappa.value)) {
      mappa.value[riga] = mappa.value[riga].map(cell => 
        ids.includes(cell.toLowerCase()) ? '' : cell
      );
    }

    // Coordinate degli angoli: [Alto-Sx, Alto-Dx, Basso-Dx, Basso-Sx]
    const angoli = [
      { riga: 0, colonna: 0 },
      { riga: 0, colonna: colonneArray - 1 },
      { riga: righeKeys.length - 1, colonna: colonneArray - 1 },
      { riga: righeKeys.length - 1, colonna: 0 }
    ];

    squadre.forEach((squadra, index) => {
      const angolo = angoli[index % 4];
      const combattentiSquadra = combattenti.filter(c => c.squadra === squadra);

      let rigaCorrente = angolo.riga;
      let colonnaCorrente = angolo.colonna;

      for (const combattente of combattentiSquadra) {
        let posizioneTrovata = false;
        
        // Verifica prima se l'angolo stesso è libero
        const letteraAngolo = righeKeys[angolo.riga];
        if (mappa.value[letteraAngolo] && mappa.value[letteraAngolo][angolo.colonna] === '') {
          mappa.value[letteraAngolo][angolo.colonna] = combattente.id;
          posizioneTrovata = true;
        }

        if (!posizioneTrovata) {
          // Direzioni di espansione prioritarie: Est, Sud, Ovest, Nord
          const direzioni = [
            { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: -1, dc: 0 }
          ];

          for (const direzione of direzioni) {
            const nuovaRiga = rigaCorrente + direzione.dr;
            const nuovaColonna = colonnaCorrente + direzione.dc;
            const letteraRiga = righeKeys[nuovaRiga];

            if (
              letteraRiga !== undefined &&
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
        }

        // Se le celle adiacenti sono piene, cerca in un raggio più ampio attorno all'angolo
        if (!posizioneTrovata) {
          for (let dr = -3; dr <= 3; dr++) {
            for (let dc = -3; dc <= 3; dc++) {
              const nuovaRiga = angolo.riga + (angolo.riga === 0 ? dr : -dr);
              const nuovaColonna = angolo.colonna + (angolo.colonna === 0 ? dc : -dc);
              
              if (nuovaRiga < 0 || nuovaRiga >= righeKeys.length || nuovaColonna < 0 || nuovaColonna >= colonneArray) continue;
              
              const letteraRiga = righeKeys[nuovaRiga];
              if (mappa.value[letteraRiga][nuovaColonna] === '') {
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

    // Aggiorna il segnale della mappa per forzare il refresh della UI
    this.mappaService.mappa_value.set(mappa);

    // CONTROLLO DI VALIDAZIONE OTTIMIZZATO (O(R*C + N))
    const idPresentiSullaMappa = new Set(Object.values(mappa.value).flat().map(v => v.toLowerCase()));
    const combattentiMancanti = combattenti.filter(c => !idPresentiSullaMappa.has(c.id.toLowerCase()));

    if (combattentiMancanti.length === 0) {
      toast.success("Combattenti posizionati con successo!");
    } else {
      const nomiMancanti = combattentiMancanti.map(c => c.id).join(", ");
      toast.warning(`Mappa troppo piccola o affollata. Mancano: ${nomiMancanti}`);
    }
  }

  /**
   * Esegue un tiro per colpire basato su D20 + bonus attacco contro la CA del bersaglio.
   * In caso di successo, applica i danni riducendo la vitalità del bersaglio.
   * @param attaccante Il combattente che effettua l'attacco.
   * @param bersaglio Il combattente che subisce l'attacco.
   */
  tiraPerColpire(attaccante: Combattente, bersaglio: Combattente): void {
    const tiroPerColpire = attaccante.bonusAttacco + Math.floor(Math.random() * 20);
    const superaClasseArmatura = tiroPerColpire >= bersaglio.classeArmatura;
    const danni = attaccante.danni;

    if (superaClasseArmatura) {
      this.fightersService.vitalitaPersonaggio(bersaglio.id, -danni);
    } else {
      toast.danger(`${attaccante.id} manca ${bersaglio.id}`);
    }

    // Imposta il bersaglio come target corrente (ultimo nemico ingaggiato)
    attaccante.target = [bersaglio.id];

    console.log(
      `${superaClasseArmatura ? 'X' : '*'}\t`,
      `${attaccante.id.substring(0, 7)} ${superaClasseArmatura ? 'COLPISCE' : 'manca'} ${bersaglio.id} \n`,
      `\t(TPC=${tiroPerColpire}) \t\t (CA=${bersaglio.classeArmatura})`
    );
  }

  /**
   * Filtra i combattenti per ottenere i membri di una squadra specifica e i loro avversari.
   * @param inSquadra Identificativo della squadra (es: 'a', 'b').
   * @returns Oggetto contenente l'elenco dei membri e degli avversari.
   */
  getMembriSquadra(inSquadra: string): { membri: Combattente[], avversari: Combattente[] } {
    const combattenti = this.fightersService.combattenti();
    const membri = combattenti.filter(c => c.squadra === inSquadra);
    const avversari = combattenti.filter(c => c.squadra !== inSquadra);
    return { membri, avversari };
  }

  /**
   * Seleziona il nemico ottimale da attaccare.
   * Priorità: 
   * 1. Target corrente se ancora valido.
   * 2. Nemico più vicino calcolato tramite distanza euclidea.
   * @param attaccante Il combattente che deve scegliere il nemico.
   * @param nemici Lista dei possibili avversari.
   * @param mappa Stato corrente della mappa.
   */
  scegliNemico(attaccante: Combattente, nemici: Combattente[], mappa?: Mappa): Combattente | null {
    if (nemici.length === 0) return null;

    // Se esiste già un target finale nell'array, lo recuperiamo
    if (attaccante.target.length > 0) {
      const targetId = attaccante.target[attaccante.target.length - 1];
      const nemico = this.fightersService.getCombattenteById(targetId);
      if (nemico) return nemico;
    }

    if (!mappa) return null;
    
    const coordinateAttaccante = this.coordinateCombattente(mappa, attaccante.id);
    if (!coordinateAttaccante) return null;

    let nemicoPiuVicino = nemici[0];
    let distanzaMinima = Infinity;

    for (const nemico of nemici) {
      const coordinateNemico = this.coordinateCombattente(mappa, nemico.id);
      if (!coordinateNemico) continue;

      // Calcolo distanza Pitagorica (linea d'aria)
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

  /**
   * Verifica se un avversario è a portata di attacco.
   * - Mischia: Entro 1 cella di distanza (anche diagonale).
   * - Distanza: Entro 6 celle di distanza.
   */
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

  /**
   * Gestisce il movimento di un combattente verso un avversario.
   * Utilizza un sistema di waypoint: se il percorso è vuoto o il target è cambiato,
   * calcola un nuovo percorso BFS e lo memorizza nell'array 'target'.
   * Ad ogni chiamata, il combattente si muove di una singola cella verso il prossimo waypoint.
   */
  movimento(attaccante: Combattente, avversario: Combattente, mappaSignal: WritableSignal<Mappa>): void {
    const mappa = mappaSignal();
    const coordAttaccante = this.coordinateCombattente(mappa, attaccante.id);
    if (!coordAttaccante) return;

    // Se non abbiamo waypoint o il nemico è cambiato, ricalcoliamo il percorso completo
    const targetFinale = attaccante.target[attaccante.target.length - 1];
    if (attaccante.target.length === 0 || targetFinale !== avversario.id) {
      const percorso = this.trovaPercorso(mappa, coordAttaccante, avversario.id);
      attaccante.target = percorso;
    }

    // Preleviamo il primo waypoint dell'elenco
    const prossimoTarget = attaccante.target[0];
    if (!prossimoTarget) return;

    // Se il waypoint è l'avversario stesso, controlliamo se siamo già a portata
    if (prossimoTarget === avversario.id) {
      if (this.sonoPortata(attaccante, avversario, mappa)) {
        attaccante.target = []; // Percorso concluso
        return;
      }
    }

    // Traduzione del waypoint ("b3") in coordinate numeriche
    const coordTarget = this.parseCoord(prossimoTarget) || this.coordinateCombattente(mappa, prossimoTarget);
    if (coordTarget) {
      const letteraRiga = coordTarget.riga;
      const colonna = coordTarget.colonna;
      
      // Eseguiamo lo spostamento solo se la cella è effettivamente libera
      if (mappa.value[letteraRiga][colonna] === '' || mappa.value[letteraRiga][colonna].toLowerCase() === attaccante.id.toLowerCase()) {
        const nuovaMappa = structuredClone(mappa);
        nuovaMappa.value[coordAttaccante.riga][coordAttaccante.colonna] = '';
        nuovaMappa.value[letteraRiga][colonna] = attaccante.id;
        mappaSignal.set(nuovaMappa);
        attaccante.target.shift(); // Waypoint raggiunto, lo rimuoviamo
      } else {
        // Se la cella è diventata occupata (es. da un altro alleato), resettiamo per ricalcolare il percorso
        attaccante.target = [];
      }
    }
  }

  /**
   * Calcola il percorso più breve tra due punti sulla griglia utilizzando BFS (Breadth-First Search).
   * Considera le celle occupate (tranne il bersaglio finale) come ostacoli invalicabili.
   * @param mappa Stato attuale della mappa.
   * @param partenza Coordinate iniziali del combattente.
   * @param targetId ID del nemico da raggiungere.
   * @returns Array di stringhe rappresentanti le coordinate dei waypoint (es: ["b3", "c4", "NemicoID"]).
   */
  private trovaPercorso(mappa: Mappa, partenza: { riga: string; colonna: number }, targetId: string): string[] {
    const targetCoord = this.coordinateCombattente(mappa, targetId);
    const righeKeys = Object.keys(mappa.value);
    if (!targetCoord) return [];

    // Coda per BFS: memorizza riga, colonna e il percorso accumulato fino a quel punto
    const queue: { r: number; c: number; path: string[] }[] = [
      { r: this.convertiRigaInNumero(partenza.riga), c: partenza.colonna, path: [] }
    ];
    
    // Set per evitare di visitare più volte la stessa cella (previene loop infiniti)
    const visited = new Set<string>();
    visited.add(`${partenza.riga}${partenza.colonna}`);

    while (queue.length > 0) {
      const { r, c, path } = queue.shift()!;

      // Condizione di uscita: abbiamo raggiunto la cella occupata dal target
      if (r === this.convertiRigaInNumero(targetCoord.riga) && c === targetCoord.colonna) {
        return path.concat(targetId);
      }

      // Direzioni possibili: 8 celle circostanti (inclusi i movimenti diagonali)
      const direzioni = [
        { dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
        { dr: -1, dc: -1 }, { dr: -1, dc: 1 }, { dr: 1, dc: -1 }, { dr: 1, dc: 1 }
      ];

      for (const { dr, dc } of direzioni) {
        const nr = r + dr;
        const nc = c + dc;
        const nRiga = righeKeys[nr];
        const key = `${nRiga}${nc}`;

        if (
          nRiga !== undefined &&
          mappa.value[nRiga] !== undefined &&
          nc >= 0 && nc < mappa.value[nRiga].length &&
          !visited.has(key) &&
          // La cella deve essere vuota OPPURE essere la cella occupata dal target nemico
          (mappa.value[nRiga][nc] === '' || (nr === this.convertiRigaInNumero(targetCoord.riga) && nc === targetCoord.colonna))
        ) {
          visited.add(key);
          queue.push({ r: nr, c: nc, path: path.concat(key) });
        }
      }
    }

    // Se non esiste un percorso libero, punta direttamente all'avversario (tentativo disperato)
    return [targetId];
  }

  /**
   * Helper per decodificare una stringa coordinata (es: "a3") in oggetto strutturato.
   */
  private parseCoord(coord: string): { riga: string; colonna: number } | null {
    const match = coord.match(/^([a-z])(\d+)$/);
    if (!match) return null;
    return { riga: match[1], colonna: parseInt(match[2], 10) };
  }

  /**
   * Cerca sulla mappa le coordinate correnti di un combattente tramite il suo ID.
   */
  private coordinateCombattente(mappa: Mappa, combattenteId: string): { riga: string; colonna: number } | null {
    for (const [riga, colonne] of Object.entries(mappa.value)) {
      const index = colonne.findIndex(id => id.toLowerCase() === combattenteId.toLowerCase());
      if (index !== -1) return { riga, colonna: index };
    }
    return null;
  }

  /**
   * Converte la lettera della riga in indice numerico (a -> 0, b -> 1, ...).
   */
  private convertiRigaInNumero(riga: string): number {
    return riga.toLowerCase().charCodeAt(0) - 97; 
  }
}
