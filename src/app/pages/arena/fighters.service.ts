import { effect, Injectable, signal } from '@angular/core';
import { agree, toast } from "../../tools/feedbacksUI";
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
  private readonly STORAGE_KEY = 'combattenti_data';
  combattenti = signal<Combattente[]>(this.loadFromStorage());
  listaCombattenti: Combattente[] = [];
  giocatoreUltimoTurno = '';

  
  constructor(private mappaService: MappaService) {
    effect(() => {
      const current = this.combattenti();
      this.saveToStorage(current);
      this.listaCombattenti = [...current].sort((a, b) => b.numeroTurno - a.numeroTurno);
    });
  }
  
  private saveToStorage(data: Combattente[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Errore salvataggio LocalStorage:", e);
    }
  }
  
  private loadFromStorage(): Combattente[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Errore caricamento LocalStorage:", e);
      return [];
    }
  }
  
  getCombattenteById(combattenteId: string): Combattente | undefined {
    const idLower = combattenteId.toLowerCase();
    return this.combattenti().find(c => c.id.toLowerCase() === idLower);
  }
  
  private colors_value = {
    a: 'success',
    b: 'info',
    c: 'secondary',
    d: 'primary'
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
    bonusIniziativa=0,
    tipoCombettente: 'mischia' | 'distanza' = 'mischia'
  ): void {
    const numeroTurno = (Math.random() * 20) + bonusIniziativa;
    const matchGradoSfida = statisticheGradoSfida.find(gs => gs.gradoSfida === gradoSfida);
    const nuovoNome = nomePersonaggio.trim() !== '' ? nomePersonaggio.trim() : this.getNomeRandom();
    const nuoviHP = puntiFerita ? puntiFerita : matchGradoSfida?.puntiFerita ?? 0;

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
      target: [],
      squadra: nomeSquadra,
      numeroTurno: numeroTurno,
      npc: !!(matchGradoSfida?.bonusAttacco && matchGradoSfida?.danniRound)
    };

    this.combattenti.update(combattenti => [...combattenti, nuovoCombattente]);
  }

  async rimuoviCombattente(combattenteId: string, showAgree = false): Promise<void> {
    if (showAgree && !await agree.danger(`Rimuovere ${combattenteId}?`, "Rimuovi")) return;

    const idLower = combattenteId.toLowerCase();
    const combattentiAggiornati = this.combattenti().filter(c => c.id.toLowerCase() !== idLower);

    this.combattenti.set(combattentiAggiornati);
    this.mappaService.mappa_removeSymbol(combattenteId);
  }

  async rimuoviTuttiCombattenti(): Promise<void> {
    if (!await agree.danger("Rimuovere tutti i combattenti?", "Rimuovi tutti")) return;

    for (const combattente of this.combattenti()) {
      this.mappaService.mappa_removeSymbol(combattente.id);
    }
    this.combattenti.set([]);
    toast.success("Tutti i combattenti rimossi");
  }

  vitalitaPersonaggio(combattenteId: string, bonus: number): void {
    const combattente = this.getCombattenteById(combattenteId);
    if (!combattente) {
      toast.danger("Combattente non trovato");
      return;
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
    
    if (aggiornato && aggiornato.puntiFerita <= 0) {
      this.rimuoviCombattente(combattenteId);
      toast.danger(`${aggiornato.id} eliminato`);
      return;
    }

    if (aggiornato && hpIniziali !== aggiornato.puntiFerita) {
      toast.success(`HP ${aggiornato.id} aggiornati`);
    }
  }
}
