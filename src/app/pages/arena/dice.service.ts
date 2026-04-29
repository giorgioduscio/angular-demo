import { Injectable } from "@angular/core";
import { toast } from "../../tools/feedbacksUI";

type TabellaRicompense = [number[], string][];

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

  // RICOMPENSE
  ricompense_mostra = false;
  ricompense_toggle(): void {
    this.ricompense_mostra = !this.ricompense_mostra;
  }

  ricompense_tabelle : {key:string, color:string, value:TabellaRicompense}[] = [
    {
      key: "A",
      color: "primary",
      value: [
        [[1, 50], "Pozione di guarigione"],
        [[51, 60], "Pergamena magica (trucchetto)"],
        [[61, 70], "Pozione di scalare"],
        [[71, 90], "Pergamena magica (1° livello)"],
        [[91, 94], "Pergamena magica (2° livello)"],
        [[95, 98], "Pozione di guarigione maggiore"],
        [[99, 99], "Borsa conservante"],
        [[100, 100], "Globo fluttuante"]
      ]
    },
    {
      key: "B",
      color: "secondary",
      value: [
        [[1, 15], "Pozione di guarigione maggiore"],
        [[16, 22], "Pozione del soffio di fuoco"],
        [[23, 29], "Pozione di resistenza"],
        [[30, 34], "Munizione +1"],
        [[35, 39], "Pozione di amicizia con gli animali"],
        [[40, 44], "Pozione della forza dei giganti delle colline"],
        [[45, 49], "Pozione di crescita"],
        [[50, 54], "Pozione del respirare sott'acqua"],
        [[55, 59], "Pergamena magica (2° livello)"],
        [[60, 64], "Pergamena magica (3° livello)"],
        [[65, 67], "Borsa conservante"],
        [[68, 70], "Unguento di Keoghtom"],
        [[71, 73], "Olio della scivolosità"],
        [[74, 75], "Polvere della sparizione"],
        [[76, 77], "Polvere dello starnuto e del soffocamento"],
        [[78, 79], "Polvere prosciugante"],
        [[80, 81], "Gemma elementale"],
        [[82, 83], "Filtro d'amore"],
        [[84, 84], "Anello del nuotare"],
        [[85, 85], "Armatura del marinaio"],
        [[86, 86], "Armatura in mithral"],
        [[87, 87], "Bacchetta dei segreti"],
        [[88, 88], "Bacchetta di individuazione del magico"],
        [[89, 89], "Copricapo del respirare sott'acqua"],
        [[90, 90], "Corda per scalare"],
        [[91, 91], "Elmo della comprensione dei linguaggi"],
        [[92, 92], "Giara alchemica"],
        [[93, 93], "Globo fluttuante"],
        [[94, 94], "Lanterna della rivelazione"],
        [[95, 95], "Mantello della manta"],
        [[96, 96], "Occhiali della notte"],
        [[97, 97], "Pozione velenosa"],
        [[98, 98], "Sella del cavaliere"],
        [[99, 99], "Tunica degli oggetti utili"],
        [[100, 100], "Verga inamovibile"]
      ]
    },
    {
      key: "C",
      color: "success",
      value: [
        [[1, 15], "Pozione di guarigione superiore"],
        [[16, 22], "Pergamena magica (4° livello)"],
        [[23, 27], "Munizione +2"],
        [[28, 32], "Pozione di chiaroveggenza"],
        [[33, 37], "Pozione di diminuzione"],
        [[38, 42], "Pozione della forma gassosa"],
        [[43, 47], "Pozione della forza dei giganti del gelo"],
        [[48, 52], "Pozione della forza dei giganti delle pietre"],
        [[53, 57], "Pozione di eroismo"],
        [[58, 62], "Pozione di invulnerabilità"],
        [[63, 67], "Pozione di lettura della mente"],
        [[68, 72], "Pergamena magica (5° livello)"],
        [[73, 75], "Elisir della salute"],
        [[76, 78], "Olio della forma eterea"],
        [[79, 81], "Pozione della forza dei giganti del fuoco"],
        [[82, 84], "Piume di Quaal"],
        [[85, 87], "Pergamena di protezione"],
        [[88, 89], "Borsa dei fagioli magici"],
        [[90, 91], "Biglia di forza"],
        [[92, 92], "Barca pieghevole"],
        [[93, 93], "Campana dell'apertura"],
        [[94, 94], "Caraffa dell'acqua eterna"],
        [[95, 95], "Collana delle palle di fuoco"],
        [[96, 96], "Ferri della velocità"],
        [[97, 97], "Lenti della visione dettagliata"],
        [[98, 98], "Pietre parlanti"],
        [[99, 99], "Talismano della salute"],
        [[100, 100], "Zainetto pratico di Heward"]
      ]
    },
    {
      key: "D",
      color: "warning",
      value: [
        [[1, 20], "Pozione di guarigione suprema"],
        [[21, 30], "Pozione di invisibilità"],
        [[31, 40], "Pozione di velocità"],
        [[41, 50], "Pergamena magica (6° livello)"],
        [[51, 57], "Pergamena magica (7° livello)"],
        [[58, 62], "Munizione +3"],
        [[63, 67], "Olio dell'affilatura"],
        [[68, 72], "Pozione di volare"],
        [[73, 77], "Pozione della forza dei giganti delle nuvole"],
        [[78, 82], "Pozione di longevità"],
        [[83, 87], "Pozione di vitalità"],
        [[88, 92], "Pergamena magica (8° livello)"],
        [[93, 95], "Ferri dello zefiro"],
        [[96, 98], "Pigmenti meravigliosi di Nolzur"],
        [[99, 99], "Borsa divorante"],
        [[100, 100], "Buco portatile"]
      ]
    },
    {
      key: "E",
      color: "danger",
      value: [
        [[1, 30], "Pergamena magica (8° livello)"],
        [[31, 55], "Pozione della forza dei giganti delle tempeste"],
        [[56, 70], "Pozione di guarigione suprema"],
        [[71, 85], "Pergamena magica (9° livello)"],
        [[86, 93], "Solvente universale"],
        [[94, 98], "Freccia assassina"],
        [[99, 100], "Colla meravigliosa"]
      ]
    },
    {
      key: "F",
      color: "info",
      value: [
        [[1, 15], "Arma +1"],
        [[16, 18], "Scudo +1"],
        [[19, 21], "Scudo sentinella"],
        [[22, 23], "Amuleto anti-individuazione e localizzazione"],
        [[24, 25], "Arma dell'avvertimento"],
        [[26, 27], "Bacchetta dei dardi incantati"],
        [[28, 29], "Bacchetta del mago da guerra +1"],
        [[30, 31], "Bacchetta della ragnatela"],
        [[32, 33], "Bastone del pitone"],
        [[34, 35], "Bastone della vipera"],
        [[36, 37], "Bracciali dell'arciere"],
        [[38, 39], "Cappello del camuffamento"],
        [[40, 41], "Fermaglio dello scudo"],
        [[42, 43], "Giavellotto del fulmine"],
        [[44, 45], "Guanti del potere orchesco"],
        [[46, 47], "Mantello della protezione"],
        [[48, 49], "Mantello elfico"],
        [[50, 51], "Pantofole del ragno"],
        [[52, 53], "Perla del potere"],
        [[54, 55], "Scopa volante"],
        [[56, 57], "Spada della vendetta"],
        [[58, 59], "Stivali elfici"],
        [[60, 61], "Stivali molleggiati"],
        [[62, 63], "Tridente del comando dei pesci"],
        [[64, 65], "Verga del patto rispettato +1"],
        [[66, 66], "Anello del calore"],
        [[67, 67], "Anello del camminare sull'acqua"],
        [[68, 68], "Anello del saltare"],
        [[69, 69], "Anello di scudo mentale"],
        [[70, 70], "Armatura adamantina (corazza di scaglie)"],
        [[71, 71], "Armatura adamantina (cotta di maglia)"],
        [[72, 72], "Armatura adamantina (giaco di maglia)"],
        [[73, 73], "Borsa dei trucchi (grigia)"],
        [[74, 74], "Borsa dei trucchi (marrone)"],
        [[75, 75], "Borsa dei trucchi (ruggine)"],
        [[76, 76], "Bottiglia del fumo perenne"],
        [[77, 77], "Collana dell'adattamento"],
        [[78, 78], "Diadema incandescente"],
        [[79, 79], "Elmo della telepatia"],
        [[80, 80], "Faretra di Ehlonna"],
        [[81, 81], "Fascia dell'intelletto"],
        [[82, 82], "Flauto dei topi"],
        [[83, 83], "Flauto incantatore"],
        [[84, 84], "Gemma della luminosità"],
        [[85, 85], "Guanti catturaproiettili"],
        [[86, 86], "Guanti del nuotare e scalare"],
        [[87, 87], "Guanti ladreschi"],
        [[88, 88], "Lenti dell'aquila"],
        [[89, 89], "Lenti dello charme"],
        [[90, 90], "Mazzo delle illusioni"],
        [[91, 91], "Medaglione dei pensieri"],
        [[92, 92], "Pietra della buona fortuna"],
        [[93, 93], "Statuina del potere meraviglioso (corvo d'argento)"],
        [[94, 94], "Stivali alati"],
        [[95, 95], "Stivali dell'inverno"],
        [[96, 96], "Strumento dei bardi (bandura di Fochlucan)"],
        [[97, 97], "Strumento dei bardi (cetera di Mac-Fuimidh)"],
        [[98, 98], "Strumento dei bardi (liuto di Doss)"],
        [[99, 99], "Talismano della rimarginazione"],
        [[100, 100], "Ventaglio"]
      ]
    },
    {
      key: "G",
      color: "light",
      value: [
        [[1, 11], "Arma +2"],
        [[12, 14], "Statuina del potere meraviglioso (si tira un d8)"],
        [[1, 1], "Cane d'onice"],
        [[2, 2], "Capre d'avorio"],
        [[3, 3], "Elefante di marmo"],
        [[4, 4], "Grifone di bronzo"],
        [[5, 5], "Gufo di serpentino"],
        [[6, 6], "Leoni d'oro"],
        [[7, 7], "Mosca d'ebano"],
        [[8, 8], "Ali del volo"],
        [[15, 15], "Ammazzadraghi"],
        [[16, 16], "Ammazzagiganti"],
        [[17, 17], "Amuleto della salute"],
        [[18, 18], "Anello accumula incantesimi"],
        [[19, 19], "Anello dell'ariete"],
        [[20, 20], "Anello della caduta morbida"],
        [[21, 21], "Anello della libertà di azione"],
        [[22, 22], "Anello della vista a raggi X"],
        [[23, 23], "Anello di eludere"],
        [[24, 24], "Anello di influenza sugli animali"],
        [[25, 25], "Anello di protezione"],
        [[26, 26], "Anello di resistenza"],
        [[27, 27], "Arma spietata"],
        [[28, 28], "Armatura adamantina (corazza a strisce)"],
        [[29, 29], "Armatura adamantina (corazza di piastre)"],
        [[30, 30], "Armatura, cotta di maglia +1"],
        [[31, 31], "Armatura della resistenza (cotta di maglia)"],
        [[32, 32], "Armatura, giaco di maglia +1"],
        [[33, 33], "Armatura della resistenza (giaco di maglia)"],
        [[34, 34], "Armatura della vulnerabilità"],
        [[35, 35], "Armatura di cuoio borchiato incantata"],
        [[36, 36], "Ascia del berserker"],
        [[37, 37], "Bacchetta dei fulmini"],
        [[38, 38], "Bacchetta del legame"],
        [[39, 39], "Bacchetta del mago da guerra +2"],
        [[40, 40], "Bacchetta della paralisi"],
        [[41, 41], "Bacchetta della paura"],
        [[42, 42], "Bacchetta delle meraviglie"],
        [[43, 43], "Bacchetta delle palle di fuoco"],
        [[44, 44], "Bacchetta di individuazione dei nemici"],
        [[45, 45], "Bastone dei boschi"],
        [[46, 46], "Bastone del deperimento"],
        [[47, 47], "Bastone della guarigione"],
        [[48, 48], "Bastone dello charme"],
        [[49, 49], "Bastone dello sciame di insetti"],
        [[50, 50], "Boccia del comando degli elementali dell'acqua"],
        [[51, 51], "Bracciali della difesa"],
        [[52, 52], "Braciere del comando degli elementali del fuoco"],
        [[53, 53], "Cappa del saltimbanco"],
        [[54, 54], "Corno del Valhalla (argento o ottone)"],
        [[55, 55], "Cintura della forza dei giganti delle colline"],
        [[56, 56], "Cintura nanica"],
        [[57, 57], "Armatura, cuoio +1"],
        [[58, 58], "Armatura della resistenza (cuoio)"],
        [[59, 59], "Collana del rosario"],
        [[60, 60], "Corda intralciante"],
        [[61, 61], "Corno del Valhalla (argento o ottone)"],
        [[62, 62], "Corno della distruzione"],
        [[63, 63], "Cubo di forza"],
        [[64, 64], "Elmo del teletrasporto"],
        [[65, 65], "Fasce metalliche di Bilarro"],
        [[66, 66], "Fortezza istantanea di Daern"],
        [[67, 67], "Gemma della visione"],
        [[68, 68], "Giaco di maglia elfico"],
        [[69, 69], "Incensiere del controllo degli elementali dell'aria"],
        [[70, 70], "Lama del sole"],
        [[71, 71], "Lingua di fiamme"],
        [[72, 72], "Manette dimensionali"],
        [[73, 73], "Mantello del pipistrello"],
        [[74, 74], "Mantello distorcente"],
        [[75, 75], "Manto della resistenza agli incantesimi"],
        [[76, 76], "Armatura, corazza di scaglie +1"],
        [[77, 77], "Armatura della resistenza (corazza di scaglie)"],
        [[78, 78], "Mazza del terrore"],
        [[79, 79], "Mazza della distruzione"],
        [[80, 80], "Mazza della punizione"],
        [[81, 81], "Pietra del controllo degli elementali della terra"],
        [[82, 82], "Pietra di loun (consapevolezza)"],
        [[83, 83], "Pietra di loun (protezione)"],
        [[84, 84], "Pietra di loun (riserva)"],
        [[85, 85], "Pietra di loun (sostentamento)"],
        [[86, 86], "Pugnale avvelenato"],
        [[87, 87], "Scudo +2"],
        [[88, 88], "Scudo attiraproiettili"],
        [[89, 89], "Scudo catturafrecce"],
        [[90, 90], "Spada del ferimento"],
        [[91, 91], "Spada del furto vitale"],
        [[92, 92], "Stivali della levitazione"],
        [[93, 93], "Stivali della velocità"],
        [[94, 94], "Strumento dei bardi (lira di Cli)"],
        [[95, 95], "Strumento dei bardi (mandolino di Canaith)"],
        [[96, 96], "Talismano anti-veleno"],
        [[97, 97], "Tunica degli occhi"],
        [[98, 98], "Verga dei tentacoli"],
        [[99, 99], "Verga del patto rispettato +2"],
        [[100, 100], "Verga della sovranità"]
      ]
    },
    {
      key: "H",
      color: "dark",
      value: [
        [[1, 10], "Arma +3"],
        [[11, 12], "Amuleto dei piani"],
        [[13, 14], "Anello delle stelle cadenti"],
        [[15, 16], "Anello di rigenerazione"],
        [[17, 18], "Anello di telecinesi"],
        [[19, 20], "Bacchetta del mago da guerra +3"],
        [[21, 22], "Bacchetta della metamorfosi"],
        [[23, 24], "Bastone dei tuoni e fulmini"],
        [[25, 26], "Bastone del colpo possente"],
        [[27, 28], "Bastone del fuoco"],
        [[29, 30], "Bastone del gelo"],
        [[31, 32], "Bastone del potere"],
        [[33, 34], "Scimitarra della velocità"],
        [[35, 36], "Scudo +3"],
        [[37, 38], "Sfera di cristallo (versione molto rara)"],
        [[39, 40], "Spada affilata"],
        [[41, 42], "Tappeto volante"],
        [[43, 44], "Tunica dei colori scintillanti"],
        [[45, 46], "Tunica delle stelle"],
        [[47, 48], "Verga del patto rispettato +3"],
        [[49, 50], "Verga dell'allerta"],
        [[51, 52], "Verga dell'assorbimento"],
        [[53, 54], "Verga della sicurezza"],
        [[55, 55], "Arco del giuramento"],
        [[56, 56], "Armatura adamantina (armatura completa)"],
        [[57, 57], "Armatura adamantina (mezza armatura)"],
        [[58, 58], "Armatura completa nanica"],
        [[59, 59], "Armatura demoniaca"],
        [[60, 60], "Armatura, corazza di piastre +1"],
        [[61, 61], "Armatura della resistenza (corazza di piastre)"],
        [[62, 62], "Bottiglia dell'efreeti"],
        [[63, 63], "Armatura, cotta di maglia +2"],
        [[64, 64], "Armatura, giaco di maglia +2"],
        [[65, 65], "Candela dell'invocazione"],
        [[66, 66], "Cintura della forza dei giganti del fuoco"],
        [[67, 67], "Cintura della forza dei giganti del gelo (o delle pietre)"],
        [[68, 68], "Corazza di scaglie di drago"],
        [[69, 69], "Corno del Valhalla (bronzo)"],
        [[70, 70], "Elmo della luminosità"],
        [[71, 71], "Mantello dell'aracnide"],
        [[72, 72], "Manuale dei golem"],
        [[73, 73], "Manuale dell'esercizio fisico"],
        [[74, 74], "Manuale della salute"],
        [[75, 75], "Manuale della velocità di azione"],
        [[76, 76], "Martello nanico da lancio"],
        [[77, 77], "Pietra di loun (agilità)"],
        [[78, 78], "Pietra di loun (assorbimento)"],
        [[79, 79], "Pietra di loun (autorità)"],
        [[80, 80], "Pietra di loun (forza)"],
        [[81, 81], "Pietra di loun (intelletto)"],
        [[82, 82], "Pietra di loun (intuizione)"],
        [[83, 83], "Pietra di loun (tempra)"],
        [[84, 84], "Armatura, cuoio +2"],
        [[85, 85], "Scudo animato"],
        [[86, 86], "Scudo anti-incantesimi"],
        [[87, 87], "Spada danzante"],
        [[88, 88], "Spada ruba nove vite"],
        [[89, 89], "Spadone del gelo"],
        [[90, 90], "Specchio imprigionante"],
        [[91, 91], "Statuina del potere meraviglioso (stallone d'ossidiana)"],
        [[92, 92], "Armatura, corazza di scaglie +2"],
        [[93, 93], "Strumento dei bardi (arpa di Anstruth)"],
        [[94, 94], "Armatura, corazza a strisce +1"],
        [[95, 95], "Armatura della resistenza (corazza a strisce)"],
        [[96, 96], "Armatura, cuoio borchiato +1"],
        [[97, 97], "Armatura della resistenza (cuoio borchiato)"],
        [[98, 98], "Tomo del comando e dell'influenza"],
        [[99, 99], "Tomo del nitido pensiero"],
        [[100, 100], "Tomo della comprensione"]
      ]
    },
    {
      key: "I",
      color: "primary",
      value: [
        [[1, 5], "Difensiva"],
        [[6, 10], "Lama della fortuna"],
        [[11, 15], "Martello dei fulmini"],
        [[16, 20], "Spada delle risposte"],
        [[21, 23], "Anello di evocazione del djinni"],
        [[24, 26], "Anello di invisibilità"],
        [[27, 29], "Anello rifletti incantesimo"],
        [[30, 32], "Bastone dei magi"],
        [[33, 35], "Sacro vendicatore"],
        [[36, 38], "Spada vorpal"],
        [[39, 41], "Verga della potenza divina"],
        [[42, 43], "Ampolla di ferro"],
        [[44, 45], "Armatura, corazza di piastre +2"],
        [[46, 47], "Armatura, cotta di maglia +3"],
        [[48, 49], "Armatura, giaco di maglia +3"],
        [[50, 51], "Cintura della forza dei giganti delle nuvole"],
        [[52, 53], "Mantello dell'invisibilità"],
        [[54, 55], "Armatura, mezza armatura +1"],
        [[56, 57], "Pozzo dei mondi"],
        [[58, 59], "Armatura, cuoio +3"],
        [[60, 61], "Armatura, armatura completa +1"],
        [[62, 63], "Scarabeo di protezione"],
        [[64, 65], "Sfera di cristallo (versione leggendaria)"],
        [[66, 67], "Armatura, corazza di scaglie +1"],
        [[68, 69], "Tunica dell'arcimago"],
        [[70, 71], "Armatura, corazza a strisce +2"],
        [[72, 73], "Armatura, cuoio borchiato +2"],
        [[74, 75], "Verga della resurrezione"],
        // Sottotabella per "Armatura magica (si tira un d12)"
        // Se vuoi mantenere la sottotabella, devi gestirla separatamente
        // Oppure puoi espanderla qui (es. [[76, 76], "Armatura, mezza armatura +2"], ecc.)
        [[76, 76], "Armatura magica (si tira un d12)"],
        [[77, 77], "Anello dei tre desideri"],
        [[78, 78], "Anello del comando degli elementali del fuoco"],
        [[79, 79], "Anello del comando degli elementali dell'acqua"],
        [[80, 80], "Anello del comando degli elementali dell'aria"],
        [[81, 81], "Anello del comando degli elementali della terra"],
        [[82, 82], "Apparato di Kwalish"],
        [[83, 83], "Armatura della resistenza (mezza armatura)"],
        [[84, 84], "Armatura completa della forma eterea"],
        [[85, 85], "Armatura completa della resistenza"],
        [[86, 86], "Armatura dell'invulnerabilità"],
        [[87, 87], "Cintura della forza dei giganti delle tempeste"],
        [[88, 88], "Corno del Valhalla (ferro)"],
        [[89, 89], "Cotta di maglia dell'efreeti"],
        [[90, 90], "Cubo dei portali"],
        [[91, 91], "Mazzo delle meraviglie"],
        [[92, 92], "Pietra di loun (assorbimento superiore)"],
        [[93, 93], "Pietra di loun (maestria)"],
        [[94, 94], "Pietra di loun (rigenerazione)"],
        [[95, 95], "Sfera annientatrice"],
        [[96, 96], "Strumento dei bardi (arpa di Ollamh)"],
        [[97, 97], "Talismano del bene puro"],
        [[98, 98], "Talismano del male estremo"],
        [[99, 99], "Talismano della sfera"],
        [[100, 100], "Tomo della lingua essiccata"]
      ]
    }
  ]

  ricompense_cerca(
    tabella: typeof this.ricompense_tabelle[number],
    risultato: number = this.roll(100)
  ): string {
    // 1. Estrai l'array delle ricompense
    const ricompense = tabella.value;
    if (!ricompense || !Array.isArray(ricompense)) {
      console.warn(`Dati della tabella "${tabella.key}" non validi.`);
      return '';
    }

    // 3. Ricerca binaria per trovare la ricompensa
    let left = 0;
    let right = ricompense.length - 1;
    let result = '';

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const [range, value] = ricompense[mid];

      if (risultato >= range[0] && risultato <= range[1]) {
        result = value;
        break;
      } else if (risultato < range[0]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    toast.success(`Tabella ${tabella.key}: ${result}`);
    this.ricompenze_cronologia.push({ color: tabella.color, text: `Tabella ${tabella.key}: ${result}` });
    return result || '';
  }

  ricompenze_cronologia :{color:string, text:string}[] =[]
  ricompenze_rimuovi_ronologia(index: number) {
    this.ricompenze_cronologia.splice(index, 1);
    toast.info('Ricompensa rimossa dalla cronologia');
  }
}  

