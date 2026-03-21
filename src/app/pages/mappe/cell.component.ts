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
          [class.border]="feedback()">
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

  constructor(private comb: CombattimentoService) {
    // Gestione del feedback: si attiva solo quando lo stato dello specifico combattente cambia
    effect((onCleanup) => {
      const c = this.combattente();
      if (c) {
        this.feedback.set(true);
        const timer = setTimeout(() => {
          this.feedback.set(false);
        }, 800);

        // Cleanup del timer in caso di distruzione del componente o nuovo trigger
        onCleanup(() => clearTimeout(timer));
      }
    }, { allowSignalWrites: true });
  }
}
