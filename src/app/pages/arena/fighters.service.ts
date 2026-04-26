import { effect, Injectable, signal } from '@angular/core';
import { agree } from "../../tools/feedbacksUI";
import { statisticheGradoSfida } from "./gradiSfida";
import { MappaService } from "./mappa.service";

export interface Combattente {
  id: string;
  tipo: "mischia" | "distanza";
  target: string[];
  squadra: string;
  numeroTurno: number;
  puntiFerita: number;
  danni: number;
  bonusAttacco: number;
  classeArmatura: number;
  npc: boolean;
}

@Injectable({ providedIn: 'root' })
export class FightersService {
  constructor(private mappaService: MappaService) {
    effect(() => {
      const current = this.combattenti();
      this.saveToStorage(current);
      this.listaCombattenti = [...current].sort((a, b) => b.numeroTurno - a.numeroTurno);
    });
  }
  
  // STORAGE
  private readonly STORAGE_KEY = 'combattenti_data';
  private saveToStorage(data: Combattente[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }
  private loadFromStorage(): Combattente[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }
  
  combattenti = signal<Combattente[]>(this.loadFromStorage());
  listaCombattenti: Combattente[] = [];
  giocatoreUltimoTurno = '';
  private numeroMassimoCombattenti = 28;
  getCombattenteById(combattenteId: string): Combattente | undefined {
    const idLower = combattenteId.toLowerCase();
    return this.combattenti().find(c => c.id.toLowerCase() === idLower);
  }

  // COLORI
  private colors_value = {
    a: 'success',
    b: 'primary',
    c: 'secondary',
    d: 'info'
  } as const;
  colors_getbyName(squadra: string): string {
    const _squadra = squadra as keyof typeof this.colors_value;
    return this.colors_value[_squadra];
  }

  private getNomeRandom(): string {
    const nomiDefault = [
      'Rosso', 'Blu', 'Giallo', 'Verde', 'Arancione', 'Viola', 'Nero', 'Bianco',
      'Marrone', 'Grigio', 'Celeste', 'Magenta', 'Ciano', 'Arancio', 'Indaco',
      'Avorio', 'Cacao', 'Citrino', 'Dorato', 'Ebano', 'Kaki', 'Lavanda',
      'Nocciola', 'Fucsia', 'Oliva', 'Perla', 'Rosa', 'Salmone', 'Turchese'
    ];
    const nomiNonselezionati = nomiDefault.filter(nome => !this.combattenti().some(c => c.id === nome));
    return nomiNonselezionati[Math.floor(Math.random() * nomiNonselezionati.length)];
  }

  addCombattente(
    nomeSquadra: string,
    gradoSfida: string,
    nomePersonaggio: string,
    classeArmatura: number,
    puntiFerita: number,
    iniziativa = Math.random()*20,
    tipoCombettente: 'mischia' | 'distanza' = 'mischia'
  ): string | null {
    if(this.combattenti().length >= this.numeroMassimoCombattenti) {
      return "Superato il numero massimo di combattenti";
    }
    const numeroTurno = iniziativa;
    const matchGradoSfida = statisticheGradoSfida.find(gs => gs.gradoSfida === gradoSfida);
    const nuovoNome = nomePersonaggio.trim() !== '' ? nomePersonaggio.trim() : this.getNomeRandom();
    const nuoviHP = puntiFerita ? puntiFerita : matchGradoSfida?.puntiFerita ?? 0;

    if (!nuovoNome || !nomeSquadra) {
      return "Nome o squadra non validi";
    }

    const nuovoCombattente: Combattente = {
      id: nuovoNome,
      tipo: tipoCombettente,
      puntiFerita: nuoviHP,
      danni: matchGradoSfida?.danniRound ?? 0,
      bonusAttacco: matchGradoSfida?.bonusAttacco ?? 0,
      classeArmatura: classeArmatura ? classeArmatura : matchGradoSfida?.classeArmatura ?? 10,
      target: [],
      squadra: nomeSquadra,
      numeroTurno: numeroTurno,
      npc: !!(matchGradoSfida?.bonusAttacco && matchGradoSfida?.danniRound)
    };

    this.combattenti.update(combattenti => [...combattenti, nuovoCombattente]);
    return null;
  }

  async rimuoviCombattente(combattenteId: string, showAgree = false): Promise<string | null> {
    if (showAgree && !await agree.danger(`Rimuovere ${combattenteId}?`, "Rimuovi")) return null;

    const idLower = combattenteId.toLowerCase();
    const combattentiAggiornati = this.combattenti().filter(c => c.id.toLowerCase() !== idLower);

    this.combattenti.set(combattentiAggiornati);
    this.mappaService.mappa_removeSymbol(combattenteId);

    const combattenteEsisteAncora = this.combattenti().some(c => c.id.toLowerCase() === idLower);
    if(combattenteEsisteAncora) return "Combattente non rimosso correttamente";
    return null;
  }

  async rimuoviTuttiCombattenti(): Promise<string | null> {
    if (!await agree.danger("Rimuovere tutti i combattenti?", "Rimuovi tutti")) return null;

    for (const combattente of this.combattenti()) {
      this.mappaService.mappa_removeSymbol(combattente.id);
    }
    this.combattenti.set([]);
    
    if(this.combattenti().length) return "Combattenti non rimossi";
    return null;
  }

  vitalitaPersonaggio(combattenteId: string, bonus: number): string | null {
    const combattente = this.getCombattenteById(combattenteId);
    if (!combattente) {
      return "Combattente non trovato";
    }

    const hpIniziali = combattente.puntiFerita;
    const combattentiAggiornati = this.combattenti().map(c => {
      if (c.id.toLowerCase() === combattenteId.toLowerCase()) {
        return { ...c, puntiFerita: c.puntiFerita + bonus };
      }
      return c;
    });

    this.combattenti.set(combattentiAggiornati);
    const aggiornato = combattentiAggiornati.find(c => c.id.toLowerCase() === combattenteId.toLowerCase());
   
    if(!aggiornato) return "Combattente non trovato";

    if (aggiornato.puntiFerita <= 0) {
      this.rimuoviCombattente(combattenteId);
      if (this.getCombattenteById(combattenteId)) {
        return "Combattente non eliminato correttamente";
      }
    }

    if (hpIniziali == aggiornato.puntiFerita) return `HP non aggiornati correttamente`;
    return null;
  }
}
