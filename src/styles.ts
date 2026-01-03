type SearchInputEvent = Event & { target: HTMLInputElement };

function injectDynamicStyles() {
  // Proprietà standard (larghezza, altezza, ecc.)
  const standardProperties = ['w', 'h', 'max-w', 'min-w', 'max-h', 'min-h'];

  // Valori standard (misure in pixel e valori speciali)
  const standardValues = [
    '40px', '60px', '80px', '100px', '150px', '200px', '300px', '400px',
    '500px', '600px', '700px', '800px', '900px', '1000px', '1500px',
    '2000px', '2500px', '3000px', 'max-content', 'min-content', 'fit-content'
  ];

  // Mappatura delle abbreviazioni alle proprietà CSS complete
  const propertyMap: Record<string, string> = {
    'w': 'width',
    'h': 'height',
    'max-w': 'max-width',
    'min-w': 'min-width',
    'max-h': 'max-height',
    'min-h': 'min-height',
  };

  // Pattern per grid-template-columns
  const gridPatterns = [
    // Pattern con 2 colonne
    'auto-1fr', '1fr-auto',
    'auto-2fr', '2fr-auto',
    '1fr-2fr', '2fr-1fr',
    'auto-auto',

    // Pattern con 3 colonne
    'auto-1fr-auto', '1fr-auto-1fr', 'auto-1fr-1fr',
    '1fr-1fr-auto', '1fr-auto-auto', 'auto-auto-1fr',
    '1fr-1fr-1fr', '1fr-1fr-2fr', '1fr-2fr-1fr', '2fr-1fr-1fr',
    '1fr-2fr-3fr', '2fr-1fr-3fr', '3fr-2fr-1fr',
    'auto-2fr-1fr', '1fr-auto-2fr', '1fr-2fr-auto',

    // Pattern con 4 colonne
    '1fr-1fr-1fr-1fr', '1fr-1fr-1fr-2fr', '1fr-1fr-2fr-1fr', '1fr-2fr-1fr-1fr', '2fr-1fr-1fr-1fr',
    'auto-1fr-1fr-1fr', '1fr-auto-1fr-1fr', '1fr-1fr-auto-1fr', '1fr-1fr-1fr-auto',
    'auto-1fr-auto-1fr', '1fr-auto-1fr-auto', '1fr-1fr-auto-auto', 'auto-auto-1fr-1fr',
    '1fr-2fr-1fr-2fr', '2fr-1fr-2fr-1fr',

    // Pattern con 5 colonne
    '1fr-1fr-1fr-1fr-1fr', '1fr-1fr-1fr-1fr-2fr', '1fr-1fr-1fr-2fr-1fr', '1fr-1fr-2fr-1fr-1fr',
    '1fr-2fr-1fr-1fr-1fr', '2fr-1fr-1fr-1fr-1fr',
    'auto-1fr-1fr-1fr-1fr', '1fr-auto-1fr-1fr-1fr', '1fr-1fr-auto-1fr-1fr',
    '1fr-1fr-1fr-auto-1fr', '1fr-1fr-1fr-1fr-auto',

    // Pattern con misure relative
    '1fr-2fr-3fr-1fr', '2fr-1fr-3fr-1fr', '1fr-3fr-2fr-1fr',
    '1fr-1fr-2fr-3fr', '3fr-2fr-1fr-1fr',

    // Pattern con combinazioni di auto e fr
    'auto-1fr-2fr-3fr', '1fr-auto-2fr-3fr', '1fr-2fr-auto-3fr', '1fr-2fr-3fr-auto',
    'auto-auto-1fr-2fr', 'auto-1fr-auto-2fr', 'auto-1fr-2fr-auto', '1fr-auto-2fr-auto',
  ];

  // Crea lo stile dinamico
  const style = document.createElement('style');
  style.id = 'dynamic-utility-styles';

  // Genera le classi CSS per le proprietà standard
  let cssRules = '';
  for (const prop of standardProperties) {
    for (const value of standardValues) {
      const cssProperty = propertyMap[prop];
      const className = `${prop}-${value}`;
      cssRules += `
        .${className} {
          ${cssProperty}: ${value};
        }
      `;
    }
  }

  // Genera le classi CSS per i pattern di grid-template-columns
  for (const pattern of gridPatterns) {
    cssRules += `
      .cols-${pattern} {
        grid-template-columns: ${pattern.replace(/-/g, ' ')};
      }
      .rows-${pattern} {
        grid-template-rows: ${pattern.replace(/-/g, ' ')};
      }
    `;
  }

  // Inietta lo stile nel DOM
  style.textContent = cssRules;
  document.head.appendChild(style);
}

const customFormFloating = {
  init(){
    this.injectStyle()
    this.handleInput()
  },
  injectStyle() {
    const style = document.createElement('style');
    style.textContent = `
      /* CUSTOM FLOATING LABELS */
      /* input */
      .label-floating >.form-control {
        min-height: 3rem;
        height: 3rem;
        padding: 10px;
        border-width: 2px;
        background: transparent;
        color: inherit;
      }
      .label-floating >.form-control:focus {
        box-shadow: none;
      }

      /* label */
      .label-floating > label {
        height: min-content;
        max-width: 90%;
        padding: 0;
        margin-left: 10px;
        transform: translateY(40%);
        background: inherit !important;
        color: inherit;
        border-radius: 10px;
      }
      .label-floating > label::after {
        background: transparent;
      }

      /* Se l'input è in focus, ha un placeholder o ha la classe active, la label rimane in alto */
      .label-floating >.form-control:focus ~ label,
      .label-floating >.form-control:placeholder-shown ~ label,
      .label-floating >.form-control.active ~ label {
        padding: 0 5px;
        margin: 0 5px;
        transform: scale(.85) translateY(-45%) translateX(.15rem);
      }
      .label-floating >.form-control:focus ~ label {
        color: #86b7fe;
      }
    `;
    document.head.appendChild(style);
  },

  handleInput(e?:Event) {
    if(!e){
      document.addEventListener('input', e=> this.handleInput(e))
      return;
    }
    // se l'input ha value.trim()!='', aggiunge la classe active alla label
    const input =e.target as HTMLInputElement;
    if(!input || input.tagName!='INPUT') return console.error('input non valido', input);
    const label =input.nextElementSibling
    if(!label || label.tagName!='LABEL') return console.error('label non valida', label);

    if(input.value=='') label.classList.remove('active')
    else label.classList.add('active')
  }
};

const searchInput = {
  injectStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .clear-button {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        color: #999;
        transition: color 0.2s;
        padding: 0;
        margin: 0;
        line-height: 1;
        z-index: 1;
        font-size: larger;
      }
      .clear-button:hover {
        color: #c00;
      }
      .search-input-container {
        position: relative;
        width: fit-content;
      }
      .clear-button.hidden {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  },

  createClearButton(input: HTMLInputElement): HTMLElement {
    // Cambia il tipo dell'input da 'search' a 'text'
    if (input.getAttribute('type') === 'search') {
      input.setAttribute('type', 'text');
    }

    // Crea pulsante
    const clearButton = document.createElement('button');
    clearButton.innerHTML = '×';
    clearButton.className = 'clear-button hidden';

    // Trova il genitore con position: relative, altrimenti crea un container
    let parent = input.parentElement;
    let isRelativeParent = window.getComputedStyle(parent!).position === 'relative';

    if (!isRelativeParent) {
      const container = document.createElement('div');
      container.className = 'search-input-container';
      input.parentNode?.insertBefore(container, input);
      container.appendChild(input);
      parent = container;
    }

    // Aggiungi il pulsante al genitore
    parent?.appendChild(clearButton);

    clearButton.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = '';
      input.focus();
      clearButton.classList.add('hidden');
    });

    return clearButton;
  },

  handleInput(e: SearchInputEvent) {
    const input = e.target;
    let clearButton = input.nextElementSibling as HTMLElement;

    if (!clearButton?.classList.contains('clear-button')) {
      clearButton = this.createClearButton(input);
      input.parentNode?.insertBefore(clearButton, input.nextSibling);
    }
    if(!clearButton) console.error('pulsante non trovato');

    clearButton.classList.toggle('hidden', input.value === '');
    if(!input.classList.contains('customSearchInput'))
      input.classList.add('customSearchInput')
  },

  isSearchInput(element: HTMLElement): element is HTMLInputElement {
    return element.tagName === 'INPUT'
          && element.getAttribute('type') === 'search'
          || element.classList.contains('customSearchInput');
  },
};

export default function customStyle() {

  // Esegui la funzione per iniettare gli stili
  injectDynamicStyles();

}
