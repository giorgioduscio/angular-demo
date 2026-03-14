import { toast } from "../../tools/feedbacksUI"

export interface Combattente{
    id:string
    tipo: "mischia" | "distanza"
    punti_ferita: number
    danni: number
    target: string
    squadra:string
}

export const Combattimento ={
  combattenti: [] as Combattente[], 
  getCombattenteById(id: string) {
    return this.combattenti.find(c => c.id === id);
  },
  addCombattente(combattente: Combattente) {
    this.combattenti.push(combattente);
  },
  removeCombattente(id: string) {
    this.combattenti = this.combattenti.filter(c => c.id !== id);
  },

  infliggiDanno(id: string, danni: number) {
    const combattente = this.getCombattenteById(id);
    if (!combattente) return toast("combattente non trovato");
    combattente.punti_ferita -= danni;
    if (combattente.punti_ferita <= 0) {
      this.removeCombattente(id);
    }
  },
  
};

