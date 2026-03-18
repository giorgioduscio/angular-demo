function injectDynamicStyles() {
  // Proprietà standard (larghezza, altezza, ecc.)
  const standardProperties = ['w', 'h', 'max-w', 'min-w', 'max-h', 'min-h'];

  // Valori standard (misure in pixel e valori speciali)
  const standardValues = [
    '10px', '20px', '30px', '40px', '50px', '60px', '70px', '80px', '90px', 
    '100px', '150px', '200px', '300px', '400px',
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
          ${cssProperty}: ${value} !important;
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

  // griglia flessibile
  const steps = ['100px', '150px', '200px', '250px', '300px', '350px', '400px'];
  steps.forEach(step => {
    cssRules += `
      .d-grid.responsive-${step} {
        grid-template-columns: repeat(auto-fit, minmax(${step}, 1fr));
      }
    `;
  });

  // flex table
  cssRules += `
    .d-flex-table {
      display: flex;
      flex-wrap: wrap;
    }
    .d-flex-table > * {
      flex: 1 1 auto;
    }
  `;
  
  // Inietta lo stile nel DOM
  style.textContent = cssRules;
  document.head.appendChild(style);
}


export default function customStyle() {
  // Esegui la funzione per iniettare gli stili
  injectDynamicStyles();
}