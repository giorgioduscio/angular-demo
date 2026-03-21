import { CommonModule } from "@angular/common";
import { Component, effect, input, computed, signal } from "@angular/core";
import { Combattente, CombattimentoService } from "./combattimento.service";

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  template:`
  <div class="w-80px h-80px text-center">
    @if(combattente()) {
      <div class="rounded-circle h-100 d-flex flex-column justify-content-center" 
          [style.background]="color()" 
          [class.subisceDanno]="feedback()">
        <h6 class="small d-grid cols-1fr-auto px-2">
          <span class="text-truncate">{{ combattente()!.id }}</span>
          <img [alt]="combattente()!.id" [src]="srcValue()"
                class="w-20px h-20px">
        </h6>
        <!-- STAT -->
        <div class="d-grid cols-1fr-1fr-1fr-1fr">
          <small class="bi bi-heart" 
                 [class.allerta]="combattente()!.puntiFerita < 10"></small>
          <small [class.allerta]="combattente()!.puntiFerita < 10">
            {{ combattente()!.puntiFerita }}</small>
          <small class="bi bi-shield-shaded ms-1"></small>
          <small>{{ combattente()!.classeArmatura }}</small>
        </div>
      </div>

    } @else {
      <div>
        {{ cellValue() }}
      </div>
    }
  </div>
  <style>
    .allerta{
      color: #ff7979ff;
      font-weight: 900;
    }
    .subisceDanno{
      box-shadow: 0 0 10px #ff7979ff;
    }
  </style>
  `
})
export class CellComponent {
  // Input reattivo per il valore della cella
  cellValue = input<string>('');
  
  // Combattente isolato tramite computed: reagisce solo se cambia questo specifico combattente
  combattente = computed(() => {
    const id = this.cellValue();
    return this.comb.getCombattenteById(id);
  });

  // Colore della squadra calcolato in modo reattivo
  color = computed(() => {
    const c = this.combattente();
    return c ? this.comb.getColoreSquadra(c.squadra) : '';
  });

  // Percorso immagine calcolato in modo reattivo
  srcValue = computed(() => {
    const c = this.combattente();
    if (!c) return '';
    return c.tipo === 'distanza' ? "/assets/distanza.png" : "/assets/mischia.jpg";
  });

  // Segnale per il feedback visivo (bordi che lampeggiano)
  feedback = signal(false);

  // Variabili per il monitoraggio dello stato precedente
  private ultimoId: string | undefined;
  private ultimoHP: number | undefined;

  constructor(private comb: CombattimentoService) {
    // Gestione del feedback: si attiva solo quando il personaggio subisce danno
    effect((onCleanup) => {
      const c = this.combattente();
      const idAttuale = this.cellValue();

      if (c) {
        const hpAttuali = c.puntiFerita;
        
        // Attiva il feedback solo se:
        // 1. È lo stesso personaggio della lettura precedente
        // 2. I suoi HP sono diminuiti (danno)
        if (this.ultimoId === idAttuale && this.ultimoHP !== undefined && hpAttuali < this.ultimoHP) {
          this.feedback.set(true);
          const timer = setTimeout(() => this.feedback.set(false), 800);
          onCleanup(() => clearTimeout(timer));
        }

        // Sincronizza lo stato per il prossimo cambiamento
        this.ultimoHP = hpAttuali;
        this.ultimoId = idAttuale;
      } else {
        // Se la cella è vuota, resetta il monitoraggio
        this.ultimoHP = undefined;
        this.ultimoId = undefined;
      }
    }, { allowSignalWrites: true });
  }
}
