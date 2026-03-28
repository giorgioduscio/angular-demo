import { CommonModule } from "@angular/common";
import { Component, effect, input, computed, signal } from "@angular/core";
import { FightersService } from "./fighters.service";
import { MappaService } from "./mappa.service";

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  template:`
  <div (dragover)="drag_over($event)" 
       (dragleave)="drag_leave()"
       (drop)="drag_drop($event)"
       [class.drag-over]="isDragOver()"
       role="gridcell"
       [attr.aria-label]="'Cella ' + riga().toUpperCase() + (colonna() + 1)">
    <div class="w-30px h-30px m-auto">
      @if(combattente(); as c) {
        <div class="rounded-circle h-100 d-flex flex-column justify-content-center text-bg-{{color()}}" 
            [class.subisceDanno]="feedback()"
            style="rotate: 15deg; cursor: grab;"
            draggable="true"
            (dragstart)="drag_start($event)"
            tabindex="0"
            role="button"
            [attr.aria-label]="'Combattente ' + c.id + ', Squadra ' + c.squadra + ', ' + c.puntiFerita + ' punti ferita'">
          <!-- NOME -->
          <h6 class="m-0 d-flex align-items-center justify-content-center" style="pointer-events: none;" aria-hidden="true">
            <span>{{ c.id }}</span>
          </h6>
          <!-- STAT -->
          <div class="d-flex align-items-center justify-content-center" style="pointer-events: none;" aria-hidden="true">
            <div class="d-flex align-items-center">
              <i class="bi bi-heart-fill position-absolute start-0"
                style="font-size: 25px;" 
                [class.text-secondary]="c.puntiFerita > 10"
                [class.text-danger]="c.puntiFerita < 10" 
                aria-hidden="true">
              </i>
              <small class="ms-3 z-1 text-white">
                {{ c.puntiFerita }}
              </small>
            </div>

            <img [alt]="'Icona combattente ' + c.tipo" [src]="srcValue()"
                  class="w-20px h-20px">
          </div>
        </div>
  
      } @else {
        <div class="h-100">
          <input [value]="cellValue()" 
                 (change)="updateCell($event)"
                 class="w-100 h-100 border-0 bg-transparent text-center p-0"
                 style="outline: none;"
                 [attr.aria-label]="'Inserisci simbolo in cella ' + riga().toUpperCase() + (colonna() + 1)"
                 placeholder=".">
        </div>
      }
    </div>
  </div>

  <style>
    .subisceDanno{
      box-shadow: 0 0 10px #ff7979ff;
    }
    .drag-over {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      outline: 2px dashed #666;
    }
  </style>
  `,
})
export class CellComponent {
  constructor(
    private fightersService: FightersService,
    private mappaService: MappaService
  ) {
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
  
  // Input reattivo per il valore della cella
  riga = input.required<string>();
  colonna = input.required<number>();
  cellValue = input<string>('');
  
  // Combattente isolato tramite computed: reagisce solo se cambia questo specifico combattente
  combattente = computed(() => {
    const id = this.cellValue();
    return this.fightersService.getCombattenteById(id);
  });

  // Colore della squadra calcolato in modo reattivo
  color = computed(() => {
    const c = this.combattente();
    return c ? this.fightersService.colors_getbyName(c.squadra) : '';
  });

  // Percorso immagine calcolato in modo reattivo
  srcValue = computed(() => {
    const c = this.combattente();
    if (!c) return '';
    return c.tipo === 'distanza' ? "/assets/distanza.png" : "/assets/mischia.jpg";
  });

  // Segnale per il feedback visivo (bordi che lampeggiano)
  feedback = signal(false);

  // Segnale per evidenziare la cella durante il drag
  isDragOver = signal(false);

  // Variabili per il monitoraggio dello stato precedente
  private ultimoId: string | undefined;
  private ultimoHP: number | undefined;

  updateCell(e: Event) {
    e.stopPropagation();
    const input = e.target as HTMLInputElement;
    const val = input.value;
    this.mappaService.mappa_setCell(this.riga(), this.colonna(), val);
    input.blur(); // Rimuove il focus per evitare duplicazioni di eventi
  }


  // GESTIONE DRAG AND DROP
  drag_start(e: DragEvent) {
    const val = this.cellValue();
    if (val && e.dataTransfer) {
      e.dataTransfer.setData('text/plain', val);
      e.dataTransfer.effectAllowed = 'move';
    }
  }

  drag_over(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    this.isDragOver.set(true);
  }

  drag_leave() {
    this.isDragOver.set(false);
  }

  drag_drop(e: DragEvent) {
    e.preventDefault();
    this.isDragOver.set(false);
    const simbolo = e.dataTransfer?.getData('text/plain');
    if (simbolo) {
      this.mappaService.mappa_setCell(this.riga(), this.colonna(), simbolo);
    }
  }

}
