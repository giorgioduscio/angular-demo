import { Injectable } from "@angular/core";
import { toast } from "../../tools/feedbacksUI";
import { max } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DiceService {
  // TIRI DEI DADI
  tiri: {color:string, result:string, dices:string}[] = [];
  roll(maxDice: number): number {
    return Math.floor(Math.random() * maxDice) + 1;
  }
  setTiri(qta: number, max: number, modifier: number): void {
    let total = 0;
    const rolls: number[] = [];

    for (let i = 0; i < qta; i++) {
      const roll = this.roll(max);
      rolls.push(roll);
      total += roll;
    }

    total += modifier;
    const modifierSign = modifier >= 0 ? `+${modifier}` : modifier;
    const qta_result = qta > 1 ? `${qta}` : '';
    const formula = `${qta_result}d${max}${modifier !== 0 ? modifierSign : ''}`;
    const colorMatch = this.pulsantiDadi.find(p => p.value.includes(`d${max}`))?.color || 'secondary';

    this.tiri.unshift({
      color: colorMatch, 
      result: total.toString(), 
      dices: formula
    });
    if (this.tiri.length > 10) {
      this.tiri.pop();
    }
    toast.secondary(`Tiro: ${formula} = ${total}`);
  }

  // PULSANTI RELATIVI
  showButtons =true;
  setShowButtons(): void {
    this.showButtons = !this.showButtons;
  }
  pulsantiDadi :{value:string, color:string}[] =[
    {value:'d4', color:'primary'}, 
    {value:'2d4', color:'primary'}, 
    {value:'3d4', color:'primary'}, 
    {value:'d6', color:'success'}, 
    {value:'2d6', color:'success'}, 
    {value:'3d6', color:'success'}, 
    {value:'d8', color:'info'}, 
    {value:'2d8', color:'info'}, 
    {value:'3d8', color:'info'}, 
    {value:'d10', color:'warning'}, 
    {value:'2d10', color:'warning'}, 
    {value:'3d10', color:'warning'}, 
    {value:'d12', color:'danger'}, 
    {value:'2d12', color:'danger'}, 
    {value:'d20', color:'dark'}, 
    {value:'2d20', color:'dark'}, 
    {value:'d100', color:'light'}, 
  ] as const;

}