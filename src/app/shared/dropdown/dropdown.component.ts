import { Component, HostListener, ElementRef, ViewChild, Input } from '@angular/core';

/* ESEMPIO UTILIZZO
<Dropdown>
  <div summary>
    <button class="p-2 text-bg-primary">
      Apri menu
    </button>
  </div>
  <div content className="absolute bg-white p-2">
    <p>Contenuto del dropdown</p>
  </div>
</Dropdown> 

Se onLeftClick è definito:
- Click sinistro: esegue onLeftClick() senza aprire il dropdown
- Click destro: apre il dropdown (previene menu contestuale)
*/

@Component({
  selector: 'Dropdown',
  standalone: true,
  imports: [],
  template: `
    <div #dropdownRef [class]="className" class="position-relative">
      <!-- Summary - trigger container -->
      <ng-content 
        select="[summary]" 
        (click)="handleLeftClick($event)"
        (contextmenu)="handleRightClick($event)"
      ></ng-content>

      <!-- Content - contenuto del dropdown -->
      <ng-content *ngIf="isOpen" select="[content]"></ng-content>
    </div>
  `,
})
export class DropdownComponent {
  @Input() className = '';
  @Input() onLeftClick?: Function;
  @ViewChild('dropdownRef', { static: true }) dropdownRef!: ElementRef<HTMLDivElement>;
  
  isOpen = false;

  handleLeftClick(event: MouseEvent) {
    if (this.onLeftClick) {
      this.onLeftClick();
      // Non apre il dropdown
    } else {
      // Comportamento normale: apre il dropdown
      this.toggle();
    }
  }

  handleRightClick(event: MouseEvent) {
    event.preventDefault(); // Previene il menu contestuale del browser
    this.toggle();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  // Chiude il dropdown quando si clicca fuori
  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isOpen && this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }
}
