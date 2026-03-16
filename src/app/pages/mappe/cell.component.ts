import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Combattente, CombattimentoService } from "./logicaCombattimento.service";

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  template:`
  <div class="text-center">
    @if(combattente) {
      <div class="rounded p-2" [style.background]="color">
        <h6 class="small">{{ combattente.id }}</h6>
        <div>
          <i class="bi bi-heart me-1"></i>
          <small>{{ combattente.puntiFerita }}</small>
        </div>
        <div>
          <i class="bi bi-shield-shaded me-1"></i>
          <small>{{ combattente.classeArmatura }}</small>
        </div>
      </div>
    } @else {
      <div>
        {{ cellValue }}
      </div>
    }
  </div>
  `
})
export class CellComponent {
  @Input() cellValue: string = '';
  combattente: Combattente | undefined;

  constructor(private comb: CombattimentoService) {}

  ngOnInit(): void {
    this.combattente = this.comb.getCombattenteById(this.cellValue);
    if (this.combattente) {
      this.combattente.id = this.combattente.id.charAt(0).toUpperCase() + this.combattente.id.slice(1);
      this.color = this.setColor(this.combattente.squadra);
    }
    if (!this.combattente && this.cellValue.length > 1) console.warn(this.cellValue, "non trovato");
  }

  // Assegna un colore casuale a una squadra
  color = ''; // Inizializza come stringa vuota
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
