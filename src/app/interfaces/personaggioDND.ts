export default interface PersonaggioDND {
  nome_personaggio: string,
  generali: [
    { key: 'background', value: string },
    { key: 'nome_giocatore', value: string },
    { key: 'razza', value: string },
    { key: 'allineamento', value: string },
    { key: 'punti_esperienza', value: number },
  ],

  // colonna sinistra
  ispirazione: number,
  punteggi: [
    { key: 'forza', value: number, abilities: [
      { key: 'tiro salvezza', value: boolean }, 
      { key: 'atletica', value: boolean }
    ]},
    { key: 'destrezza', value: number, abilities: [
      { key: 'tiro salvezza', value: boolean }, 
      { key: 'acrobazia', value: boolean }, 
      { key: 'rapidità di mano', value: boolean }, 
      { key: 'furtività', value: boolean }
    ]},
    { key: 'costituzione', value: number, abilities: [
      { key: 'tiro salvezza', value: boolean }
    ]},
    { key: 'intelligenza', value: number, abilities: [
      { key: 'tiro salvezza', value: boolean }, 
      { key: 'arcano', value: boolean }, 
      { key: 'indagare', value: boolean }, 
      { key: 'natura', value: boolean }, 
      { key: 'religione', value: boolean }, 
      { key: 'storia', value: boolean }
    ]},
    { key: 'saggezza', value: number, abilities: [
      { key: 'tiro salvezza', value: boolean }, 
      { key: 'addestrare animali', value: boolean }, 
      { key: 'intuizione', value: boolean }, 
      { key: 'medicina', value: boolean }, 
      { key: 'percezione', value: boolean }, 
      { key: 'sopravvivenza', value: boolean }
    ]},
    { key: 'carisma', value: number, abilities: [
      { key: 'tiro salvezza', value: boolean }, 
      { key: 'inganno', value: boolean }, 
      { key: 'intimidire', value: boolean }, 
      { key: 'intrattenere', value: boolean }, 
      { key: 'persuasione', value: boolean }
    ]},
  ],
  competenze:[
    {key:'linguaggi', value:string},
    {key:'armi', value:string},
    {key:'armature', value:string},
    {key:'strumenti', value:string},
  ],
  
  // colonna centrale
  classe_armatura: number,
  velocita: string, 
  punti_ferita_attuali: number,
  punti_ferita_temporanei: number,
  ts_falliti: number,
  ts_successi: number,
  attacchi:string[],
  equipaggiamento: {qta:number, value:string}[],
  monete: [ 
    { key: 'rame', value: number },
    { key: 'argento', value: number },
    { key: 'electrum', value: number },
    { key: 'oro', value: number },
    { key: 'platino', value: number }
  ],

  // colonna destra
  personalita: [
    {key:'tratti_caratteriali', value:string},
    {key:'ideali', value:string},
    {key:'legami', value:string},
    {key:'difetti', value:string},
  ],
  privilegi:{
    classe:string,
    note:string,
    scelta?:boolean
  }[]
}
