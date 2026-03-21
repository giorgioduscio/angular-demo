import { CommonModule } from "@angular/common";
import { Component, effect, Input, signal } from "@angular/core";
import { Combattente, CombattimentoService } from "./combattimento.service";

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  template:`
  <div class="w-80px h-80px text-center">
    @if(combattente) {
      <div class="rounded-circle h-100 d-flex flex-column justify-content-center" 
          [style.background]="color" 
          [class.border]="feedback">
        <h6 class="small d-grid cols-1fr-auto px-2">
          <span class="text-truncate">{{ combattente!.id }}</span>
          <img [alt]="combattente.id" [src]="srcValue"
                class="w-20px h-20px">
        </h6>
        <!-- STAT -->
        <div class="d-grid cols-1fr-1fr-1fr-1fr">
          <small class="bi bi-heart" 
                 [class.allerta]="combattente!.puntiFerita < 10"></small>
          <small [class.allerta]="combattente!.puntiFerita < 10">
            {{ combattente.puntiFerita }}</small>
          <small class="bi bi-shield-shaded ms-1"></small>
          <small>{{ combattente!.classeArmatura }}</small>
        </div>
      </div>

    } @else {
      <div>
        {{ cellValue }}
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
  @Input() cellValue: string = '';
  combattente :Combattente | undefined;
  srcValue = '';
  feedback = false;

  constructor(private comb: CombattimentoService) {
    effect(()=>{
      this.combattente = this.comb.getCombattenteById(this.cellValue);

      this.feedback =true
      setTimeout(() => {
        this.feedback =false
      }, 800);
    })
  }

  ngOnInit(): void {
    this.combattente = this.comb.getCombattenteById(this.cellValue);
    if (this.combattente) {
      this.combattente.id = this.combattente.id.charAt(0).toUpperCase() + this.combattente.id.slice(1);
      this.color = this.setColor(this.combattente.squadra);
      this.srcValue = this.combattente.tipo=='distanza' 
                      ? "/assets/distanza.png"
                      : "/assets/mischia.jpg";
    }
    if (!this.combattente && this.cellValue.length > 1) 
      console.warn(this.cellValue, "non trovato");
  }

  // Assegna un colore casuale a una squadra
  color = ''; 
  setColor(nomeSquadra: string): string {
    const coloreSelezionato = this.comb.getColoreSquadra(nomeSquadra);
    if (!coloreSelezionato) {
      console.error("Colore non trovato per la squadra:", nomeSquadra);
      return '#ccccccff'; // Colore di default
    }
    return coloreSelezionato;
  }
}
