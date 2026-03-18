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
      <div class="rounded py-2" [style.background]="color">
        <h6 class="small d-grid cols-1fr-auto px-2">
          <!-- <i class="bi" [class.bi-shield-fill]="combattente.tipo=='mischia'" 
                        [class.bi-arrow-bar-right]="combattente.tipo=='distanza'"></i> -->
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
      <div class="text-black">
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

  constructor(private comb: CombattimentoService) {
    effect(()=>{
      this.combattente = this.comb.getCombattenteById(this.cellValue);
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
    const range = {
      a: '#aa0000ff',
      b: '#009900ff',
      c: '#0000ddff',
      d: '#888800ff',
      e: '#a100a1ff',
      f: '#009494ff',
      g: '#8c5b00ff',
      h: '#800080',
      i: '#b74357ff',
      j: '#891616ff'
    };
    const coloreSelezionato = range[nomeSquadra as keyof typeof range];
    if (!coloreSelezionato) {
      console.error("Colore non trovato per la squadra:", nomeSquadra);
      return '#ccccccff'; // Colore di default
    }
    return coloreSelezionato;
  }
}
