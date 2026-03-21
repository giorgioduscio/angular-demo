type ToastColor = "primary" | "secondary" | "danger" | "success" | "warning" | "info";

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

class ToastManager {
  private static instance: ToastManager;
  private toastPool: HTMLElement[] = [];
  private readonly MAX_POOL_SIZE = 5;
  private styleInjected = false;
  private colors = {
    primary: '#007bff',
    secondary: '#6c757d',
    danger: '#dc3545',
    success: '#198754',
    warning: '#ffc107',
    info: '#0dcaf0'
  };

  // Costruttore privato per singleton
  private constructor() { }

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
          padding: 15px 20px;
          margin: 0 auto;
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 500px;
          z-index: 10;
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

  // Mostra un toast
  public show(message: string, color: ToastColor = "secondary"): void {
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

      // Colori chiari di bootstrap richiedono testo scuro
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
          <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
            <div class="modal-content bg-${colorePulsante} ${textColor} border-0 shadow-lg">
              <div class="modal-header border-0 pb-0">
                <button type="button" class="${closeBtnClass} ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body text-center py-4">
                <p class="mb-0 fs-5 fw-medium">${message}</p>
              </div>
              <div class="modal-footer border-0 justify-content-between pb-4 pt-0">
                <button type="button" class="btn ${isLightColor ? 'btn-dark' : 'btn-light'} btn-sm px-3" data-bs-dismiss="modal">Annulla</button>
                <button type="button" class="btn ${isLightColor ? 'btn-outline-dark' : 'btn-outline-light'} btn-sm px-3" id="${modalId}-ok">${messaggioPulsante}</button>
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
      primary: '#007bff',
      secondary: '#6c757d',
      danger: '#dc3545',
      success: '#198754',
      warning: '#ffc107',
      info: '#0dcaf0'
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
          z-index: 10000;
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
        z-index: 100;
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
  createPopover(title: string | null, message: string): HTMLElement {
    let popover = document.createElement('div');
    const headerId = `popover-header-${Math.random().toString(36)}`;
    const bodyId = `popover-body-${Math.random().toString(36)}`;
    const formattedMessage = message .split('* ') .filter(item => item.trim());
    popover.innerHTML =`
      <div  class="popover" role="dialog" aria-live="polite" 
            aria-labelledby="${headerId}" aria-describedby="${bodyId}">
            
        <div id="${headerId}" class="popover-header">${title ||''}</div>

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
        const title = parts.length > 1 ? parts[0] : null;
        const message = parts.length > 1 ? parts.slice(1).join('>') : parts[0];

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
        const title = parts.length > 1 ? parts[0] : null;
        const message = parts.length > 1 ? parts.slice(1).join('>') : parts[0];
        
        const popover = Popover.createPopover(title, message);
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


