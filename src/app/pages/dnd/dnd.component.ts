import { Component, signal, effect, WritableSignal, OnInit, HostListener } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DND, inizializzaPersonaggio } from './dndManual';
import { local } from './localStorage';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import {toast, agree, popovers_init} from '../../tools/feedbacksUI';
import { Autocomplete } from '../../tools/autocomplete';
import PersonaggioDND from '../../interfaces/personaggioDND';
import duckcase from '../../tools/duckcase';

@Component({
  selector: 'app-dnd',
  standalone: true,
  imports: [NgIf, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './dnd.component.html',
  styleUrl: './dnd.component.css'
})
export class DndComponent implements OnInit {
  public dnd = DND;
  public local = local;
  public duckcase =duckcase

  private _character: WritableSignal<PersonaggioDND> = signal(this.loadCharacter());
  public character = this._character.asReadonly();

  constructor() {
    new Autocomplete();
    popovers_init();

    effect(() => {
      localStorage.setItem('character', JSON.stringify(this._character()));
      document.title =`${this._character().nome_personaggio}`;      
      // console.warn(this.character().privilegi);
    });

    setTimeout(()=> toast('Inizializzazione scheda'), 1000)
  }
  ngOnInit(): void {
    this.checkScreenSize();
  }

  //  DIMENZIONE SCHERMO
      @HostListener('window:resize', ['$event'])
      onResize(event: Event): void {
        this.checkScreenSize(); // Controlla la dimensione al ridimensionamento della finestra
      }
      public isMobileView: boolean = false; // Add this line
      private checkScreenSize(): void {
        this.isMobileView = window.innerWidth < 900; 
      }
      mobileButtons = [
        { key: 'generalita', 
          label: 'Generalità', 
          icon:'person'
        },
        { key: 'punteggi', 
          label: 'Punteggi', 
          icon: 'bar-chart'
        },
        { key: 'competenzeLinguaggi', 
          label: 'Competenze e Linguaggi', 
          icon: 'book'
        },
        { key: 'combattimento', 
          label: 'Combattimento', 
          icon: 'shield'
        },
        { key: 'attacchiIncantesimi', 
          label: 'Attacchi e Incantesimi', 
          icon: 'arrow-through-heart'
        },
        { key: 'equipaggiamento', 
          label: 'Equipaggiamento', 
          icon: 'backpack2'
        },
        { key: 'personalita', 
          label: 'Personalità', 
          icon: 'chat'
        },
        { key: 'trattiPrivilegi', 
          label: 'Tratti e Privilegi', 
          icon: 'person-vcard'
        },
      ]
      public activeSection: string = 'generalita';
      public setSection(sectionId: string): void {
        this.activeSection = sectionId;
      }
      showSectionWith(values: string[]) :boolean{
        const show = !this.isMobileView || values.includes(this.activeSection)
        return show;
      }


  private loadCharacter(): PersonaggioDND {
    const saved = localStorage.getItem('character');
    return saved ? JSON.parse(saved) : inizializzaPersonaggio();
  }
  
  allineamenti =[
    'Caotico buono', 'Caotico neutrale', 'Caotico malvagio', 
    'Neutrale buono', 'Neutrale', 'Neutrale malvagio', 
    'Legale buono', 'Legale neutrale', 'Legale malvagio'
  ];

  trovaIconaVelocita(key:string){
    switch (key) {
      case 'nuotare': return 'bi-water';
      case 'volare': return 'bi-airplane';
      case 'scalare': return 'bi-person-arms-up';
      case 'camminare': return 'bi-person-walking';
      default: return 'bi-dot';
    }
  }

  handleChange(event: Event) {
    // se fa parte di un form, annulla
    const form = (event.target as HTMLFormElement).closest('form');
    if (form) return;
    
    // Estrae le proprietà target dall'evento
    const { name, value, type, checked } = event.target as HTMLInputElement;
    
    // Converte il valore in numero se possibile, altrimenti mantiene la stringa
    const nuovoValore =
      name.includes('ts_') ? (checked ? Number(value) : Number(value) - 1)
      : type == 'checkbox' ? checked
      : value === '' ? '' 
      : !isNaN(Number(value)) ? Number(value) 
      : value.trim();

    // Divide il nome dell'input in un array di chiavi per navigare nell'oggetto
    let keys: (string | number)[] = name.split('-');
    // Converte le chiavi numeriche da stringa a number
    keys.forEach((key, i) => {
      if (!isNaN(Number(key))) {
        keys[i] = Number(key);
      }
    });
    
    console.log(keys, nuovoValore);

    // Aggiorna lo stato del personaggio utilizzando la funzione update del segnale
    this._character.update(personaggioAttuale => {
      // Crea una copia profonda dell'oggetto personaggio attuale per garantire l'immutabilità
      const personaggioNuovo = JSON.parse(JSON.stringify(personaggioAttuale)); 
      let currentLevel: any = personaggioNuovo;      
      
      // per ogni step
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]; // chiave dello step

        // Se la proprietà non esiste, o se non è un oggetto/array, la inizializza.
        // Questo impedisce di tentare di impostare proprietà su valori primitivi.
        if (typeof currentLevel[key] !== 'object' || currentLevel[key] === null || currentLevel[key] === undefined) {
          // Inizializza come array se la chiave successiva è un numero (indice), altrimenti come oggetto.
          currentLevel[key] = typeof keys[i + 1] === 'number' ? [] : {};
        }
        currentLevel = currentLevel[key];
      }
      currentLevel[keys[keys.length - 1]] = nuovoValore; // Imposta il valore finale
      
      toast('Aggiornamento dati', 'primary');
      return personaggioNuovo;
    });
  }

  async reset(){
    if(await agree('Resettare il personaggio?', 'Reset', 'danger')){
      this._character.set(inizializzaPersonaggio());
      local.set(this.character());
      toast("Personaggio resettato", "danger")
    }
  }

  //  LISTE
  async deleteFromList(listName: keyof PersonaggioDND, index: number) {
    if(index<0) return console.error('indice non valido', index);
    
    if(await agree(`Confermi eliminazione da ${listName}?`, 'Elimina', 'danger')){
      this._character.update(char => {
        const newChar = JSON.parse(JSON.stringify(char));
        if (Array.isArray(newChar[listName])) {
          (newChar[listName] as any[]).splice(index, 1);
        } else console.error(listName, 'non è una lista');
        
        console.warn(newChar[listName].value || newChar[listName]);
        return newChar;
      });
      toast('Eliminazione completata', 'danger');
    }
  }

  addToList(listName: string, event: Event) {
    event.preventDefault();
    const form = (event.target as HTMLFormElement).closest('form');
    if(!form) return console.error('form non trovato');
    
    let valueInputName = 'value';
    if (listName === 'attacchi') {
      valueInputName = 'attacco-value';
    } else if (listName === 'equipaggiamento') {
      valueInputName = 'equip-value';
    } else if (listName === 'privilegi') {
      valueInputName = 'privilegio-value';
    }

    const valueInput = (form.elements.namedItem(valueInputName) as HTMLInputElement);
    const qtaInput = (form.elements.namedItem('qta') as HTMLInputElement);
    
    if (valueInput==null || (listName=="equipaggiamento" && qtaInput==null) ) {
      return console.error('input non validi', valueInput, qtaInput);
    }
      
    let value: string = valueInput.value;
    let qta: number = Number(qtaInput?.value || 0);
    if(listName=="equipaggiamento" && qta==0) qta=1;

    if (!value) return console.error('Valore input vuoto');
    if (listName=="equipaggiamento" && isNaN(Number(qta))) {
      return console.error('Valore input non valido');
    }

    console.warn(listName, qta||'', value);

    //  AGGIORNAMENTO DATI
    this._character.update(personaggioAttuale => {
      const nuovoPersonaggio: PersonaggioDND = JSON.parse(JSON.stringify(personaggioAttuale));

      if (listName === 'equipaggiamento') { // duplicati: aumenta quantità
        const elementoEsistente = nuovoPersonaggio.equipaggiamento.find((item: any) => 
          item.value.toLowerCase() === value.toLowerCase()
        );
        if (elementoEsistente) {
          elementoEsistente.qta = (elementoEsistente.qta || 1) + qta;
        } else {
          nuovoPersonaggio.equipaggiamento.push({ qta, value: value });
        }

      } else if (listName === 'attacchi') { // niente duplicati
        const list = nuovoPersonaggio[listName] as string[];
        if (!list.some(item => item.toLowerCase() === value.toLowerCase())) {
          list.push(value);
        }
        
      } else if (listName === 'privilegi') { // inserisce duplicati
        const list = nuovoPersonaggio.privilegi;
        list.push({classe:value, note:''});
      }
      return nuovoPersonaggio;
    });
    toast('Inserimento eseguito', 'success');
    form.reset();
  }

  //  STAT
      getClassesString(): string {
        const personaggio = this.character();
        const classi = DND.getResocontoClassi(personaggio);
        if (!classi || classi.length === 0) {
          return 'Nessuna';
        }
        return classi.map(c => `${c.classe} ${c.livello}`).join(', ');
      }
      getPrivilegiRazza(){
        const razza =this.character().generali.find(g=>g.key==="razza")?.value +'';
        return DND.getRazza(razza ||'')
      }
      getPrivilegiBackground(){
        const background =this.character().generali.find(g=>g.key==="background")?.value +'';
        return DND.getBackground(background ||'')
      }
      liv(){
        return DND.getLivello(this.character());
      }
      BC =()=> DND.getBonusCompetenza(this.character());
      mod = DND.getModificatore;
      passiva =(nomeAbilita:string)=> DND.getValorePassivoAbilita(nomeAbilita, this.character())

  getPlaceholder(key: string): string {
    switch (key) {
      case 'nome_giocatore':
        return 'Es: Mario Rossi';
      case 'punti_esperienza':
        return 'Es: 0';
      case 'tratti_caratteriali':
        return 'Es: Mi piace spaccare le cose. Sono diretto e onesto.';
      case 'ideali':
        return 'Es: La gloria della battaglia è tutto ciò che conta.';
      case 'legami':
        return 'Es: Proteggerò i miei amici, specialmente il mio maestro.';
      case 'difetti':
        return 'Es: Non penso mai prima di agire. Mai.';
      default:
        return 'Inserisci qui...';
    }
  }

  //  LOCALSTORAGE
      async copyCharacter() {
        await this.local.copy(this.character());
        toast('Copiato negli appunti')
      }
      async pasteCharacter() {
        try {
          const pastedChar = await this.local.paste();
          if (pastedChar) {
            this._character.set(pastedChar);
            toast('Personaggio impostato dagli appunti')
          }
        } catch (error) {
          console.error("Failed to parse character from clipboard", error);
        }
      }

  //  GUIDE
      getGuida(nomeSezione:string) :string{
        let result ='';
        switch (nomeSezione) {
          case 'linguaggi': 
              result ='Linguaggi disponibili:>'+ DND.getCompetenzeLinguaggi(this.character());
              break;
          case 'armi': 
              result = 'Armi disponibili:>'+ DND.getCompetenzeArmi(this.character())
              break; 
          case 'strumenti': 
              result = 'Strumenti disponibili:>'+ DND.getCompetenzeStrumenti(this.character())
              break; 
          case 'armature': 
              result = 'Armature disponibili:>'+ DND.getCompetenzeArmature(this.character())
              break; 
          case 'classe_armatura': 
              result = 'Classe armatura:>'+DND.getClasseArmatura( this.character())
              break; 
          case 'velocita': 
              result = 'Velocità:>'+DND.getVelocita( this.character())
              break; 
        }
        return result.includes('*') ?result :'';
      }

}

