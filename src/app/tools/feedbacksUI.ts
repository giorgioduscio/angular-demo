// aggiornaamento 


/**
# MODULO TOAST - GESTIONE DI NOTIFICHE TEMPORANEE
Questo modulo fornisce un'implementazione per la creazione e gestione di toast (notifiche temporanee)
che appaiono in sovrapposizione all'interfaccia utente. Supporta sia l'implementazione nativa
che l'integrazione con Bootstrap 5, con un sistema di caching per evitare duplicati.

CARATTERISTICHE PRINCIPALI:
- Supporto per **6 tipi di toast**: primary, secondary, danger, success, warning, info.
- **Singleton pattern**: Un'unica istanza di `ToastManager` gestisce tutte le notifiche.
- **Pooling degli elementi**: Riutilizzo degli elementi DOM per ottimizzare le performance.
- **Cache dei messaggi**: Evita la visualizzazione di toast duplicati entro 5 secondi.
- **Fallback custom**: Se Bootstrap 5 non è disponibile, utilizza un'implementazione CSS/JS pura.
- **Animazioni fluide**: Transizioni per la comparsa e la scomparsa.
- **Accessibilità**: Supporto per attributi ARIA (`role="alert"`, `aria-live`).

ESEMPI D'USO:
  toast.success("Operazione completata con successo!");
  toast.danger("Errore: impossibile salvare i dati.");
  toast.info("Nuovo messaggio ricevuto.");

METODI DISPONIBILI:
- toast.primary(messaggio): Mostra un toast con sfondo primary.
- toast.secondary(messaggio): Mostra un toast con sfondo secondary.
- toast.danger(messaggio): Mostra un toast con sfondo rosso (errore).
- toast.success(messaggio): Mostra un toast con sfondo verde (successo).
- toast.warning(messaggio): Mostra un toast con sfondo arancione (avviso).
- toast.info(messaggio): Mostra un toast con sfondo blu (informazione).

IMPLEMENTAZIONE INTERNA:
- ToastManager.getInstance(): Ottiene l'istanza singleton del gestore.
- ToastManager.show(messaggio, colore): Mostra un toast con il messaggio e il colore specificati.
- getToastElement(): Recupera o crea un elemento toast dal pool.
- releaseToastElement(el): Rilascia un elemento toast nel pool per il riutilizzo.
- injectStyle(): Inietta gli stili CSS necessari per i toast custom.
- addToCache(messaggio): Aggiunge un messaggio alla cache per evitare duplicati.
- isMessageDuplicate(messaggio): Verifica se un messaggio è già stato mostrato di recente.
*/

// Funzione di utilità per mantenere la sintassi originale
export const toast = {
  primary(messaggio: string) {
    ToastManager.getInstance().show(messaggio, 'primary');
  },
  danger(messaggio: string) {
    ToastManager.getInstance().show(messaggio, 'danger');
  },
  secondary(messaggio: string) {
    ToastManager.getInstance().show(messaggio, 'secondary');
  },
  success(messaggio: string) {
    ToastManager.getInstance().show(messaggio, 'success');
  },
  warning(messaggio: string) {
    ToastManager.getInstance().show(messaggio, 'warning');
  },
  info(messaggio: string) {
    ToastManager.getInstance().show(messaggio, 'info');
  },
} as const;

type ToastColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

class ToastManager {
  private static instance: ToastManager;
  private toastPool: HTMLElement[] = [];
  private readonly MAX_POOL_SIZE = 5;
  private styleInjected = false;
  private colors = {
    primary: '#0d6efd',
    secondary: '#6c757d',
    danger: '#dc3545',
    success: '#198754',
    warning: '#ffc107',
    info: '#0dcaf0'
  };
  private textColors = {
    primary: '#fff',
    secondary: '#fff',
    danger: '#fff',
    success: '#fff',
    warning: '#1f2937',
    info: '#fff'
  };
  // Cache per i messaggi recenti
  private messageCache = new Set<string>();
  private readonly MAX_CACHE_SIZE = 10;
  private readonly CACHE_CLEANUP_DELAY = 5000; // 5 secondi

  private constructor() {}

  // Metodo per ottenere l'istanza singleton
  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  // Recupera un elemento dal pool o ne crea uno nuovo
  private getToastElement(): HTMLElement {
    return this.toastPool.pop() || document.createElement('div');
  }

  // Rilascia un elemento nel pool
  private releaseToastElement(el: HTMLElement): void {
    if (this.toastPool.length < this.MAX_POOL_SIZE) {
      el.className = 'toast-notification';
      this.toastPool.push(el);
    }
  }

  // Inietta lo stile CSS se non già fatto
  private injectStyle(): void {
    if (!this.styleInjected) {
      const style = document.createElement('style');
      style.textContent = `
        .toast-notification {
          max-width: 100vw;
          padding: 10px 20px;
          margin: 0 auto;
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 500px;
          z-index: 2001;
          transition: opacity 0.3s ease;
          opacity: 1;
          white-space: nowrap;
          background-color: ${this.colors.secondary};
          color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          font-size: 14px;
        }
        .toast-notification.fade-out {
          opacity: 0;
        }
      `;
      document.head.appendChild(style);
      this.styleInjected = true;
    }
  }

  // Aggiunge un messaggio alla cache e ne programma la rimozione
  private addToCache(message: string): void {
    this.messageCache.add(message);
    setTimeout(() => {
      this.messageCache.delete(message);
    }, this.CACHE_CLEANUP_DELAY);
  }

  // Verifica se il messaggio è già stato mostrato di recente
  private isMessageDuplicate(message: string): boolean {
    return this.messageCache.has(message);
  }

  public show(message: string, color: ToastColor = "secondary"): void {
    // Controllo duplicati: se il messaggio è già nella cache, non mostrare il toast
    if (this.isMessageDuplicate(message)) {
      return;
    }

    // Aggiungi il messaggio alla cache
    this.addToCache(message);

    const bootstrapGlobal = (window as any).bootstrap;
    const isBootstrap5 = typeof bootstrapGlobal !== 'undefined' && bootstrapGlobal.Toast;

    if (isBootstrap5) {
      let container = document.getElementById('bs-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'bs-toast-container';
        container.className = 'toast-container position-fixed top-0 start-50 translate-middle-x p-3';
        container.style.zIndex = '10001';
        document.body.appendChild(container);
      }

      const isLightColor = color === 'warning' || color === 'info';
      const textColor = isLightColor ? 'text-dark' : 'text-white';
      const closeBtnColor = isLightColor ? '' : 'btn-close-white';

      const toastEl = document.createElement('div');
      toastEl.className = `toast align-items-center ${textColor} bg-${color} border-0 mb-2`;
      toastEl.setAttribute('role', 'alert');
      toastEl.setAttribute('aria-live', 'assertive');
      toastEl.setAttribute('aria-atomic', 'true');

      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body fs-6">
            ${message}
          </div>
          <button type="button" class="btn-close ${closeBtnColor} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;

      container.appendChild(toastEl);
      const bsToast = new bootstrapGlobal.Toast(toastEl, { delay: 3000 });

      toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
        if (container && container.childNodes.length === 0) {
          container.remove();
        }
      }, { once: true });

      bsToast.show();
      return;
    }

    // FALLBACK: Logica custom
    this.injectStyle();

    const notificaEl = this.getToastElement();
    notificaEl.className = 'toast-notification';
    notificaEl.style.backgroundColor = this.colors[color];
    notificaEl.style.color = this.textColors[color];
    notificaEl.textContent = message;

    document.body.appendChild(notificaEl);

    requestAnimationFrame(() => {
      setTimeout(() => {
        notificaEl.classList.add('fade-out');
        setTimeout(() => {
          if (notificaEl.parentNode) {
            document.body.removeChild(notificaEl);
          }
          this.releaseToastElement(notificaEl);
        }, 300);
      }, 3000);
    });
  }
}


/**
# MODULO AGREE - GESTIONE DI MODAL DI CONFERMA
Questo modulo fornisce un'implementazione per la creazione di finestre di dialogo modali
che richiedono una conferma da parte dell'utente (simile a `confirm()` nativo, ma personalizzabile).
Supporta sia l'implementazione nativa che l'integrazione con Bootstrap 5.

CARATTERISTICHE PRINCIPALI:
- Supporto per **5 tipi di pulsanti**: primary, secondary, danger, success, warning, info.
- **Promise-based**: Restituisce una Promise che si risolve con `true` (OK) o `false` (Annulla).
- **Personalizzazione del testo**: Messaggio e testo del pulsante di conferma modificabili.
- **Fallback custom**: Se Bootstrap 5 non è disponibile, utilizza un'implementazione CSS/JS pura.
- **Animazioni fluide**: Transizioni per la comparsa e la scomparsa del modal.
- **Accessibilità**: Supporto per attributi ARIA (`role="dialog"`, `aria-modal`).

ESEMPI D'USO:
  const response = await agree.danger("Sei sicuro di voler eliminare questo elemento?", "Elimina");
  if (response) {
    // Azione confermata
  }

METODI DISPONIBILI:
- agree.primary(messaggio, testoPulsante): Mostra un modal con pulsante primary.
- agree.success(messaggio, testoPulsante): Mostra un modal con pulsante verde (successo).
- agree.danger(messaggio, testoPulsante): Mostra un modal con pulsante rosso (pericoloso).
- agree.warning(messaggio, testoPulsante): Mostra un modal con pulsante arancione (avviso).
- agree.info(messaggio, testoPulsante): Mostra un modal con pulsante blu (informazione).

IMPLEMENTAZIONE INTERNA:
- executeAgree(messaggio, testoPulsante, colore): Funzione principale che gestisce la creazione
  e la visualizzazione del modal, restituendo una Promise.
- In Bootstrap 5: Utilizza `bootstrap.Modal` per creare un modal nativo.
- Fallback custom: Crea un modal personalizzato con stili CSS e gestione degli eventi.
*/

//  funzione che imita confirm()
export const agree = {
  primary(message: string, btnText?: string) {
    return executeAgree(message, btnText, 'primary');
  },
  success(message: string, btnText?: string) {
    return executeAgree(message, btnText, 'success');
  },
  danger(message: string, btnText?: string) {
    return executeAgree(message, btnText, 'danger');
  },
  warning(message: string, btnText?: string) {
    return executeAgree(message, btnText, 'warning');
  },
  info(message: string, btnText?: string) {
    return executeAgree(message, btnText, 'info');
  },
};

function executeAgree(message: string,
  messaggioPulsante = 'Invio',
  colorePulsante: ToastColor = "primary"): Promise<boolean> {
  return new Promise((resolve) => {

    // Rilevamento Bootstrap 5 (versione rilevata nel package.json)
    const bootstrapGlobal = (window as any).bootstrap;
    const isBootstrap5 = typeof bootstrapGlobal !== 'undefined' && bootstrapGlobal.Modal;

    if (isBootstrap5) {
      const modalId = `bs-agree-${Math.random().toString(36).slice(2, 9)}`;
      const isLightColor = colorePulsante === 'warning' || colorePulsante === 'info';
      const textColor = isLightColor ? 'text-dark' : 'text-white';
      const closeBtnClass = isLightColor ? 'btn-close' : 'btn-close btn-close-white';

      const html = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-modal="true" role="dialog">
          <div class="modal-dialog modal-sm modal-dialog" role="document">

            <div class="modal-content text-bg-dark border-0 shadow-lg">
              <div class="modal-header border-0 pb-0">
                <button type="button" class="btn btn-dark ms-auto" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
              <div class="modal-body text-center py-4">
                <p class="mb-0 fs-5 fw-medium">${message}</p>
              </div>
              <div class="modal-footer border-0 justify-content-between pb-4 pt-0">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                <button type="button" class="btn btn-${colorePulsante}" id="${modalId}-ok">${messaggioPulsante}</button>
              </div>
            </div>

          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', html);
      const modalEl = document.getElementById(modalId)!;
      const okBtn = document.getElementById(`${modalId}-ok`)!;
      const bsModal = new bootstrapGlobal.Modal(modalEl);

      let isConfirmed = false;

      okBtn.onclick = () => {
        isConfirmed = true;
        bsModal.hide();
      };

      modalEl.addEventListener('hidden.bs.modal', () => {
        modalEl.remove();
        resolve(isConfirmed);
      }, { once: true });

      bsModal.show();
      return;
    }

    // FALLBACK: Logica custom originale se Bootstrap non è presente
    const colori = {
      primary: '#84cc16',
      secondary: '#65a30d',
      danger: '#dc3545',
      success: '#84cc16',
      warning: '#bef264',
      info: '#84cc16'
    }
    if (!document.getElementById("agree-modal-style")) {
      const style = document.createElement("style");
      style.id = "agree-modal-style";
      style.textContent = `
        .agree-modal {
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          justify-content: center;
          padding-top: 50px;
          z-index: 2002;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0s 0.3s;
        }
        .agree-modal.visible {
          opacity: 1;
          visibility: visible;
          transition-delay: 0s;
        }
        .agree-modal-content {
          background-color: #2c2c2c;
          color: #f1f1f1;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          height: max-content;
          text-align: center;
        }
        .agree-modal-message {
          margin: 0 0 20px 0;
        }
        .agree-modal-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .agree-modal-ok {
          background-color: ${colori[colorePulsante as keyof typeof colori] || colori.primary};
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        .agree-modal-cancel {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        .agree-modal-buttons button:active {
          filter: brightness(85%);
        }
      `;
      document.head.appendChild(style);
    }

    document.body.insertAdjacentHTML("beforeend", `
      <div class="agree-modal" id="agree-modal">
        <div class="agree-modal-content">
          <p class="agree-modal-message">${message}</p>
          <div class="agree-modal-buttons">
            <button class="agree-modal-ok" id="agree-ok">${messaggioPulsante}</button>
            <button class="agree-modal-cancel" id="agree-cancel">Annulla</button>
          </div>
        </div>
      </div>
    `);

    const modal = document.getElementById("agree-modal");
    const okButton = document.getElementById("agree-ok");
    const cancelButton = document.getElementById("agree-cancel");
    if(!modal || !okButton || !cancelButton) 
      return console.error('elementi non trovati', modal, okButton, cancelButton);

    setTimeout(() => {
      modal.classList.add("visible");
    }, 10);

    const cleanup = () => {
      modal.classList.remove("visible");
      setTimeout(() => {
        if (modal.parentNode) document.body.removeChild(modal);
      }, 300);
    };

    okButton.onclick = () => {
      cleanup();
      resolve(true);
    };

    cancelButton.onclick = () => {
      cleanup();
      resolve(false);
    };
  });
}


/**
# MODULO POPOVER - GESTIONE DI POPOVER DINAMICI PER ELEMENTI HTML
Questo modulo fornisce un'implementazione leggera e modulare per la creazione
e gestione di popover dinamici, attivati tramite l'attributo `data-popover`.

CARATTERISTICHE PRINCIPALI:
- Trigger `focus` per `input`/`textarea`: mostra/nasconde al focus/blur.
- Trigger `click` per altri elementi: mostra al click e scompare dopo 3 secondi.
- Animazioni fluide con CSS transitions.
- Gestione automatica della pulizia del DOM.
- Iniezione automatica degli stili CSS.
- Supporto per attributi ARIA per l'accessibilità.
- Formato `data-popover`: `Titolo>Messaggio` o solo `Messaggio`.

Esempio:
  <input data-popover="Titolo>Messaggio dettagliato">
  <textarea data-popover="Solo messaggio"></textarea>
  <button data-popover="Titolo>Messaggio per il bottone">Clicca</button>

METODI DISPONIBILI:
- injectStyle(): Inietta gli stili CSS necessari.
- createPopover(): Crea un elemento popover.
- positionPopover(): Posiziona il popover vicino all'elemento target.
- hidePopover(): Nasconde il popover con animazione.
- init(): Inizializza i listener per focus e click.
- initCleanup(): Pulisce i popover quando gli elementi vengono rimossi.
*/

export function popovers_init() {
  Popover.injectStyle();
  Popover.init();
  Popover.initCleanup();
}

const Popover = {
  // Inietta gli stili CSS necessari
  injectStyle(): void {
    if (document.getElementById('popover-styles')) return;
    const style = document.createElement('style');
    style.id = 'popover-styles';
    style.textContent = `
      [data-popover] :not(input) :not(textarea) {
        position: relative;
        cursor: pointer;
      }
      .popover {
        max-height: 200px;
        overflow-y: auto;
        
        padding: 4px 8px;
        z-index: 2003;
        display: none;
        opacity: 0;
        word-wrap: break-word; /* Va a capo con parole lunghe */
        min-width: 100px; /* Larghezza minima */
        
        background: linear-gradient(0deg, #333, #555);
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: absolute;
        transform: translateY(-5px);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      .popover.popover-top {
        transform: translateY(5px);
      }
      .popover.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .popover-header {
        padding: 0;
        margin-bottom: 5px;
        color: #fff !important;
        background: transparent !important;
        font-weight: bold;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;
      }
      .popover-body {
        padding: 0;
        color: #fff !important;
        font-size: 12px; /* Dimensione del testo diminuita */
      }
      .popover ol{
        margin: 0;
        padding-left: 15px;
      }
    `;
    document.head.appendChild(style);
  },

  // Crea un elemento popover con titolo e messaggio
  createPopover(title: string, message: string): HTMLElement {
    let popover = document.createElement('div');
    const headerId = `popover-header-${Math.random().toString(36)}`;
    const bodyId = `popover-body-${Math.random().toString(36)}`;
    const formattedMessage = message .split('* ') .filter(item => item.trim());
    popover.innerHTML =`
      <div  class="popover" role="dialog" aria-live="polite" 
            aria-labelledby="${headerId}" aria-describedby="${bodyId}">

        ${title ? `<div id="${headerId}" class="popover-header">${title}</div>` : ''}

        <div id="${bodyId}" class="popover-body">
          ${formattedMessage.length>1 ?`
            <ol>
              ${formattedMessage.map(messaggio=>`
              <li>${messaggio}</li>
            `).join('')}
            </ol>
          `:formattedMessage[0]}
        </div>
      </div>
    `;
    popover =popover.querySelector('div[role]') as HTMLDivElement;
    return popover;
  },

  // Posiziona il popover in modo intelligente per evitare l'overflow dello schermo
  positionPopover(popover: HTMLElement, target: HTMLElement): void {
    const rect = target.getBoundingClientRect();
    const spacing = 5;

    // Calcola e applica la larghezza (min 100px, max 400px, altrimenti larghezza del target)
    const newWidth = Math.max(100, Math.min(rect.width, 400));
    popover.style.width = `${newWidth}px`;

    // Rendi il popover misurabile ma invisibile
    popover.style.display = 'block';
    popover.style.visibility = 'hidden';
    popover.classList.remove('popover-top');

    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const isInputOrTextarea = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    let top: number;
    let left = rect.left;

    if (isInputOrTextarea) {
      // Per input/textarea, preferisci in alto
      top = rect.top - popoverHeight - spacing;
      popover.classList.add('popover-top');
      // Se non c'è spazio, vai in basso
      if (top < 0) {
        top = rect.bottom + spacing;
        popover.classList.remove('popover-top');
      }
    } else {
      // Per gli altri elementi, preferisci in basso
      top = rect.bottom + spacing;
      // Se non c'è spazio, vai in alto
      if (rect.bottom + popoverHeight + spacing > windowHeight) {
        top = rect.top - popoverHeight - spacing;
        popover.classList.add('popover-top');
      }
    }

    // Collisione orizzontale: se esce a destra, allinea a destra
    if (rect.left + popoverWidth > windowWidth) {
      left = rect.right - popoverWidth;
    }

    // Assicurati che non esca a sinistra
    if (left < spacing) {
      left = spacing;
    }
    
    // Applica le posizioni calcolate
    popover.style.top = `${top + window.scrollY}px`;
    popover.style.left = `${left + window.scrollX}px`;
    
    // Rendi visibile con animazione
    popover.style.visibility = 'visible';
    target.setAttribute('aria-expanded', 'true');
    target.setAttribute('aria-controls', popover.id);
    
    setTimeout(() => popover.classList.add('visible'), 10);
  },

  // Nasconde il popover con un'animazione fluida
  hidePopover(popover: HTMLElement): void {
    if (!popover) return;
    const targetElement = document.querySelector(`[aria-controls="${popover.id}"]`) as HTMLElement;
    if (targetElement) {
      targetElement.setAttribute('aria-expanded', 'false');
    }
    popover.classList.remove('visible');
    setTimeout(() => {
      popover.style.display = 'none';
      popover.classList.remove('popover-top');
    }, 200);
  },

  // Funzione unificata per la gestione dei popover
  init(): void {
    // Gestione del focus per input e textarea
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      const popoverData = target.getAttribute('data-popover');
      const isInputOrTextarea = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (isInputOrTextarea && popoverData) {
        const parts = popoverData.split('>');
        const title: string = parts.length > 1 ? (parts[0] ?? '') :'';
        const message: string = parts.length > 1 ? parts.slice(1).join('>') : (parts[0] ?? '');

        let popoverId = target.dataset['popoverId'];
        let popover: HTMLElement | null = null;

        if (popoverId) {
          popover = document.getElementById(popoverId);
        } else {
          popover = Popover.createPopover(title, message);
          popoverId = `popover-${Math.random().toString(36).substr(2, 9)}`;
          popover.id = popoverId;
          target.dataset['popoverId'] = popoverId;
          document.body.appendChild(popover);
        }

        if (popover) {
          Popover.positionPopover(popover, target);
        }
      }
    });

    document.addEventListener('focusout', (e) => {
      const target = e.target as HTMLElement;
      const isInputOrTextarea = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      if (isInputOrTextarea && target.dataset['popoverId']) {
        const popover = document.getElementById(target.dataset['popoverId']);
        if (popover) {
          Popover.hidePopover(popover);
        }
      }
    });

    // Gestione del click per tutti gli altri elementi
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const popoverData = target.getAttribute('data-popover');
      const isInputOrTextarea = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (!isInputOrTextarea && popoverData) {
        const parts = popoverData.split('>');
        const title = parts.length > 1 ? (parts[0] ?? '') : '';
        const message = parts.length > 1 ? parts.slice(1).join('>') : (parts[0] ?? '');
        
        const popover = Popover.createPopover(title ?? '', message);
        const popoverId = `popover-${Math.random().toString(36).substr(2, 9)}`;
        popover.id = popoverId;
        document.body.appendChild(popover);

        Popover.positionPopover(popover, target);

        const hideAndRemove = () => {
          Popover.hidePopover(popover);
          setTimeout(() => popover.remove(), 200);
        };

        setTimeout(hideAndRemove, 3000);
      }
    });
  },

  // Inizializza un MutationObserver per pulire i popover quando gli elementi vengono rimossi
  initCleanup(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.dataset['popoverId']) {
            const popover = document.getElementById(node.dataset['popoverId']);
            popover?.remove();
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
};



/**
 * 
 * @param callback Funzione da eseguire dopo il delay
 * @param delay Ritardo in millisecondi
 * @returns 
 * Esegue la funzione dopo il delay solo se non viene chiamata nuovamente entro quel tempo
 */
export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  if (typeof callback !== "function" || typeof delay !== "number" || delay < 0) {
    console.error("Callback must be a function and delay must be a positive number");
    const noop: any = () => {};
    noop.cancel = () => {};
    return noop;
  }
  // Crea un timer per gestire il delay
  let timer: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    // recupera tutti gli args
    if (timer) clearTimeout(timer); // cancella il timer se esiste
    timer = setTimeout(() => {
      timer = null;
      callback(...args);
    }, delay); // esegue la callback dopo il delay
  };
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return debounced;
}

export const ui_download ={
  text: (data:any, fileName='Backup')=> 
    executeDownload(data, fileName, "text/plan", "txt"),

  json: (data:any, fileName='Backup')=>{ 
    const json = JSON.stringify(data, null, 2);
    executeDownload(json, fileName, "application/json", "json")
  },

  markdown: (data:any, fileName='Backup')=> 
    executeDownload(data, fileName, "text/markdown;charset=utf-8", "md"),
  
  document: (data:any, fileName='Backup')=> 
    executeDownload(data, fileName, "application/msword", "doc"),
}

function executeDownload(data: string, fileName:string, blobType: string, fileExtention:string) {
  const blob = new Blob([data], {
    type: blobType,
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url; 
  a.download = fileName + "." + fileExtention;
  a.click();

  URL.revokeObjectURL(url);
}

export const ui_upload ={
  json: <T>() => executeUpload<T>({ accept: ".json,application/json", parseJson: true }),
  
  markdown: () =>
    executeUpload<string>({ accept: ".md,text/markdown" }),

  
  text: () =>
    executeUpload<string>({ accept: ".txt,text/plain" }),
  
  yaml: () =>
    executeUpload<string>({ accept: ".yaml,.yml,text/yaml,application/yaml" }),

}

type UploadOptions = {
  accept?: string;
  parseJson?: boolean;
  multiple?: boolean;
};

async function executeUpload<T = string>({
  accept = "*/*",
  parseJson = false,
  multiple = false,
}: UploadOptions = {}): Promise<T | T[] | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;

    input.onchange = async () => {
      try {
        const files = Array.from(input.files ?? []);

        if (files.length === 0) {
          resolve(null);
          return;
        }

        const readFile = async (file: File) => {
          const text = await file.text();
          return parseJson ? JSON.parse(text) : text;
        };

        if (multiple) {
          const result = await Promise.all(files.map(readFile));
          resolve(result as T[]);
        } else {
          const result = await readFile(files[0]);
          resolve(result as T);
        }
      } catch (err) {
        reject(err);
      }
    };

    input.click();
  });
}

// copia la stringa nel  sistema
export async function ui_copy(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback:", err);
    }
  }

  // Fallback for browsers that don't support Clipboard API
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
}

// aggiunge un feedback a tutti i pulsanti di copia
export function ui_addCopyFeedback(e: Event){
  // cerca il pulsante container
  const copyButton = (e.target as HTMLElement).closest("[data-feedback]");
  if(!copyButton) return;

  // cerca l'icona
  const copyIcon = copyButton.querySelector("i.bi-copy");     
  if(!copyIcon || !copyIcon.classList.contains("bi-copy")) return;
  
  // rimuove bi-copy e aggiunge bi-check
  copyIcon.classList.remove("bi-copy");
  copyIcon.classList.add("bi-check-lg");
  
  // rimuove bi-check e aggiunge bi-copy
  setTimeout(() => {
    copyIcon.classList.remove("bi-check-lg");
    copyIcon.classList.add("bi-copy");
  }, 1500); 
}


/**
 * Inizializza la funzionalità di scroll automatico verso l'input attivo
 * Quando si preme un tasto, la pagina scorre per mantenere l'input visibile
 */
export function ui_initScrollToInput() {  
  // Rileva se siamo su mobile (larghezza <= 768px o touch support)
  function isMobile() {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
  };

  // Logica di scroll (estratta per essere riusabile)
  function _scrollElementIntoView(target: HTMLElement) {
    // Esegui solo su mobile
    if (!isMobile()) {
      return;
    }

    // Usa setTimeout per aspettare che la tastiera si apra
    setTimeout(() => {
      // Usa scrollIntoView per centrare l'elemento
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Aggiusta l'offset dopo lo scroll (80px dal top)
      setTimeout(() => {
        const currentScrollY = window.scrollY;
        const adjustedY = currentScrollY - 80;
        window.scrollTo({ top: adjustedY, behavior: 'smooth' });
      }, 100);
    }, 300);
  };

  // Handler per il focus su input/textarea
  function _scrollIntoElement(e: Event)  {
    const target = e.target as HTMLElement;
    
    // Verifica se è un input o textarea
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      return;
    }

    _scrollElementIntoView(target);
  };

  // Handler per i tasti (frecce direzionali e Tab)
  function _scrollOnKeydown(e: KeyboardEvent) {
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!keys.includes(e.key)) {
      return;
    }
    const target = document.activeElement as HTMLElement | null;
    if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) {
      return;
    }
    _scrollElementIntoView(target);
  };

  // Aggiungi listener per focusin (bubble version di focus)
  document.addEventListener('focusin', _scrollIntoElement, true);
  document.addEventListener('keydown', _scrollOnKeydown, true);
}

/**
 * Inizializza la funzionalità di popover per il title attribute
 * Quando si tiene premuto un pulsante (mousedown), mostra un popover con il title
 */
export function ui_initTitlePopover() {
  // Inietta gli stili CSS per il popover
  if (!document.getElementById('title-popover-styles')) {
    const style = document.createElement('style');
    style.id = 'title-popover-styles';
    style.textContent = `
      .title-popover {
        position: fixed;
        padding: 8px 12px;
        background: linear-gradient(0deg, #333, #555);
        color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        font-size: 12px;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        max-width: 300px;
        word-wrap: break-word;
      }
      .title-popover.visible {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  let currentPopover: HTMLElement | null = null;
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let isLongPress = false;
  let targetButton: HTMLButtonElement | null = null;

  // Gestione mousedown (pressione del pulsante)
  document.addEventListener('mousedown', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button') as HTMLButtonElement;
    
    if (button && button.title) {
      // Cancella qualsiasi timeout precedente
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }

      // Rimuovi il popover esistente se presente
      if (currentPopover) {
        currentPopover.remove();
        currentPopover = null;
      }

      // Reset flag
      isLongPress = false;
      targetButton = button;

      // Crea il nuovo popover
      currentPopover = document.createElement('div');
      currentPopover.className = 'title-popover';
      currentPopover.textContent = button.title;
      document.body.appendChild(currentPopover);

      // Posiziona il popover in modo intelligente
      const rect = button.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const popoverHeight = currentPopover.offsetHeight || 40; // stima altezza
      const spacing = 5;
      
      // Calcola se c'è spazio sufficiente in basso
      const spaceBelow = windowHeight - rect.bottom;
      const showAbove = spaceBelow < popoverHeight + spacing;
      
      if (showAbove) {
        // Posiziona sopra il pulsante
        currentPopover.style.left = `${rect.left + window.scrollX}px`;
        currentPopover.style.top = `${rect.top - popoverHeight - spacing + window.scrollY}px`;
        currentPopover.classList.add('popover-top');
      } else {
        // Posiziona sotto il pulsante
        currentPopover.style.left = `${rect.left + window.scrollX}px`;
        currentPopover.style.top = `${rect.bottom + spacing + window.scrollY}px`;
        currentPopover.classList.remove('popover-top');
      }

      // Avvia timer per long press (300ms)
      longPressTimer = setTimeout(() => {
        if (currentPopover) {
          currentPopover.classList.add('visible');
          isLongPress = true;
        }
      }, 300);
    }
  });

  // Gestione mouseup (rilascio del pulsante)
  document.addEventListener('mouseup', (e) => {
    // Cancella il timer di long press
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    if (currentPopover) {
      currentPopover.classList.remove('visible');
      hideTimeout = setTimeout(() => {
        if (currentPopover) {
          currentPopover.remove();
          currentPopover = null;
        }
      }, 200);
    }

    // Se è stato un long press, previeni il click
    if (isLongPress && targetButton) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      isLongPress = false;
      targetButton = null;
    }
  }, true);

  // Gestione click (previeni click se è stato un long press)
  document.addEventListener('click', (e) => {
    if (isLongPress && targetButton) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      isLongPress = false;
      targetButton = null;
    }
  }, true);

  // Gestione mouseleave (se il mouse esce dal pulsante)
  document.addEventListener('mouseleave', (e) => {
    const target = e.target as HTMLElement;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest('button');
    
    if (button && currentPopover) {
      // Cancella il timer di long press
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      currentPopover.classList.remove('visible');
      hideTimeout = setTimeout(() => {
        if (currentPopover) {
          currentPopover.remove();
          currentPopover = null;
        }
        isLongPress = false;
        targetButton = null;
      }, 200);
    }
  }, true);
}

/**
# MODULO ONVIEW - GESTIONE DI EVENTI DI VISIBILITÀ
Questo modulo fornisce un'implementazione per rilevare quando un elemento
entra o esce dal viewport usando Intersection Observer API.

CARATTERISTICHE PRINCIPALI:
- Trigger ogni volta che l'elemento entra/rientra nel viewport
- Supporto per opzioni personalizzate di IntersectionObserver
- Funzione di cleanup per disconnettere l'observer
- Passa l'evento IntersectionObserver alla callback

ESEMPI D'USO:
  const element = document.getElementById('my-element');
  const cleanup = ui_onViewportEnter(element, (entry) => {
    console.log('Element is visible:', entry.isIntersecting);
  });
  
  // Per disconnettere l'observer
  cleanup();

METODI DISPONIBILI:
- ui_onViewportEnter(element, callback, options?): Configura un observer per l'elemento specificato.
*/
export function ui_onViewportEnter(
  element: HTMLElement,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): () => void {
  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
    ...options
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Trigger solo quando l'elemento entra nel viewport
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, observerOptions);

  observer.observe(element);

  // Restituisce funzione di cleanup
  return () => {
    observer.unobserve(element);
    observer.disconnect();
  };
}
