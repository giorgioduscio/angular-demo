// IA: definizione del componente utenti con dipendenze angular core e moduli necessari
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { RolesValues, User } from '../../interfaces/user';
import { RouterModule } from '@angular/router';
import { agree } from '../../tools/feedbacksUI';
import { Subscription } from 'rxjs';

// IA: decoratore @component per definire metadati, template e stili del componente
@Component({
  selector: 'app-utenti',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NavbarComponent, RouterModule],
  templateUrl: './utenti.component.html',
  styleUrl: './utenti.component.css'
})
// IA: classe principale del componente che implementa oninit e ondestroy per gestire il ciclo di vita
export class UtentiComponent implements OnInit, OnDestroy {
  constructor(public usersService: UsersService) {}
  
  // IA: metodo del ciclo di vita che si attiva all'inizializzazione del componente
  ngOnInit() {
    // IA: imposta il titolo della pagina al caricamento del componente
    document.title = 'Utenti';
    // IA: sottoscrizione all'observable degli utenti per ricevere aggiornamenti
    this.usersSubscription = this.usersService.$users.subscribe((res) => {
      if (!res) return console.error('nessun utente dalle api');
      this.utentiOriginali = [...res];
      this.setVistaUtenti();
    });
  }

  // IA: metodo del ciclo di vita che si attiva alla distruzione del componente per pulire le risorse
  ngOnDestroy() {
    // IA: annulla la sottoscrizione per evitare memory leak
    this.usersSubscription?.unsubscribe();
  }
  private usersSubscription: Subscription | undefined;

  // IA: proprietà per la gestione dell'interfaccia utente, come ruoli e colonne della tabella
  rolesValues = [...RolesValues];
  colonne: { key: keyof User, label: string }[] = [
    { key: 'id', label: 'Id' },
    { key: 'email', label: 'Email' },
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'Role' },
  ];

  // IA: proprietà e metodo per gestire il filtro degli utenti
  filtro: string = '';
  filtro_set(e: Event) {
    // IA: aggiorna il valore del filtro e resetta la paginazione
    const newValue = (e.target as HTMLInputElement).value;
    this.filtro = newValue;
    this.paginazione_index = 1;
    this.setVistaUtenti();
  }

  // IA: proprietà e metodo per gestire l'ordinamento degli utenti
  ordinamento_value: { [key: string]: '' | 'asc' | 'desc' } = { id: 'asc' };
  ordinamento_set(colonnaKey: keyof User) {
    // IA: alterna tra asc, desc e nessun ordinamento per la colonna selezionata
    if (!this.ordinamento_value[colonnaKey]) {
      this.ordinamento_value = { [colonnaKey]: 'asc' };
    } else if (this.ordinamento_value[colonnaKey] === 'asc') {
      this.ordinamento_value[colonnaKey] = 'desc';
    } else {
      this.ordinamento_value = { [colonnaKey]: '' };
    }
    this.setVistaUtenti();
  }

  // IA: proprietà e metodi per gestire la paginazione degli utenti
  paginazione_index: number = 1;
  paginazione_range: number = 5;
  paginazione_rangeWrapper = [5, 10, 50, 100];
  paginazione_setRange(e: Event) {
    // IA: aggiorna il range di elementi per pagina e resetta l'indice
    const newValue = (e.target as HTMLSelectElement).value;
    this.paginazione_range = Number(newValue);
    this.paginazione_index = 1;
    this.setVistaUtenti();
  }

  paginazione_totalePagine: number = 1;
  paginazione_goto(page: number) {
    // IA: naviga verso una pagina specifica se valida
    if (page >= 1 && page <= this.paginazione_totalePagine) {
      this.paginazione_index = page;
      this.setVistaUtenti();
    }
  }

  // IA: proprietà per memorizzare gli utenti originali e quelli visualizzati
  private utentiOriginali: User[] = [];
  vistaUtenti: User[] = [];
  setVistaUtenti() {
    // IA: applica filtro, paginazione e ordinamento agli utenti da visualizzare

    // IA: applica il filtro agli utenti originali
    let utentiDaMostrare = [...this.utentiOriginali];
    if (this.filtro.length > 0) {
      const filtroLower = this.filtro.trim().toLowerCase();
      utentiDaMostrare = this.utentiOriginali.filter(user =>
        user.username.toLowerCase().includes(filtroLower) ||
        user.email.toLowerCase().includes(filtroLower)
      );
    }

    // IA: calcola il numero totale di pagine in base al range selezionato
    if (this.paginazione_range > 0) {
      this.paginazione_totalePagine = Math.ceil(utentiDaMostrare.length / this.paginazione_range);
    } else {
      this.paginazione_totalePagine = 0;
    }

    // IA: resetta l'indice di paginazione se supera il totale delle pagine
    if (this.paginazione_index > this.paginazione_totalePagine) {
      this.paginazione_index = 1;
    }

    // IA: estrae gli utenti per la pagina corrente
    const startIndex = (this.paginazione_index - 1) * this.paginazione_range;
    const endIndex = startIndex + Number(this.paginazione_range);
    this.vistaUtenti = utentiDaMostrare.slice(startIndex, endIndex);

    // IA: applica l'ordinamento agli utenti visualizzati
    const activeSort = Object.entries(this.ordinamento_value).find(
      ([_, direction]) => direction !== ''
    );

    if (activeSort) {
      const [colonnaKey, direction] = activeSort;
      this.vistaUtenti.sort((a, b) => {
        const valueA = a[colonnaKey as keyof User];
        const valueB = b[colonnaKey as keyof User];

        // IA: gestisce valori null o undefined
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;

        // IA: ordinamento per stringhe
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        // IA: ordinamento per numeri
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return direction === 'asc' ? valueA - valueB : valueB - valueA;
        }

        return 0;
      });
    }
  }

  // IA: metodo per gestire la cancellazione di un utente con conferma
  async handleDelete(user: User) {
    if (!await agree('Cancellare utente?', 'Rimuovi', 'danger')) return;
    this.usersService.deleteUser(user.id);
  }

  // IA: metodo per gestire le modifiche ai dati di un utente
  handleChange(user: User, key: keyof User, e: Event) {
    // IA: gestisce il nuovo valore in base al tipo di input
    const { value, type, checked } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? checked :
      !isNaN(Number(value)) ? Number(value) :
        value;

    const newUser = { ...user, [key]: newValue };

    // IA: valida l'email se il campo modificato è di tipo email
    if (typeof newValue === 'string') {
      if (type === 'email' && !newValue.includes('@')) {
        alert("Email non valida. Inserire '@'.");
      } else {
        this.usersService.patchUser(user.id, newUser);
      }
    }
  }
}
