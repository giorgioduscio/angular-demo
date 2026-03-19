import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class DiceService {
  // TIRI DEI DADI
  tiri: string[] = [];
  setTiri(qta: number, max: number, modifier: number): void {
    let total = 0;
    const rolls: number[] = [];

    for (let i = 0; i < qta; i++) {
      const roll = Math.floor(Math.random() * max) + 1;
      rolls.push(roll);
      total += roll;
    }

    total += modifier;
    const modifierSign = modifier >= 0 ? `+${modifier}` : modifier;
    const description = `${qta}d${max}${modifier !== 0 ? modifierSign : ''} = ${total}`;

    this.tiri.unshift(description);
    if (this.tiri.length > 10) {
      this.tiri.pop();
    }
  }

  // PULSANTI RELATIVI
  pulsantiDadi :string[] =[
    'd4', '2d4', '3d4', 
    'd6', '2d6', '3d6', 
    'd8', '2d8', '3d8', 
    'd10', '2d10', '3d10', 
    'd12', '2d12', '3d12', 
    'd20', '2d20', '3d20', 
    'd100', '2d100', '3d100'
  ];
  getColorPulsantiDadi(dice:String) :string {
    if(dice.includes('d100')) return 'light';
    if(dice.includes('d20')) return 'dark';
    if(dice.includes('d12')) return 'danger';
    if(dice.includes('d10')) return 'warning';
    if(dice.includes('d8')) return 'info';
    if(dice.includes('d6')) return 'success';
    if(dice.includes('d4')) return 'primary';
    return 'secondary';
  }

}