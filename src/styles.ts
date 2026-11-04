export default function injectDynamicStyles() {
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
  style.textContent = cssRules +roundedDirections();
  document.head.appendChild(style);
}

function roundedDirections() {
  const directions = {
    't':['top-left', 'top-right'],
    'r':['top-right', 'bottom-right'],
    'b':['bottom-right', 'bottom-left'],
    'l':['bottom-left', 'top-left']
  };

  let cssRules = '';
  for (const [direction, corners] of Object.entries(directions)) {
    cssRules += `
      .rounded-${direction} {
        border-radius: 0;
        border-${corners[0]}-radius: 0.25rem;
        border-${corners[1]}-radius: 0.25rem;
      }
    `;
  }
  
  return cssRules;
}

/* TAILWWIND

"use client";

import { useEffect } from "react";

export default function DynamicStyles() {
  useEffect(() => {
    applyStyle();
  }, []);

  return null;
}


// === TESTO AD ALTO CONTRASTO PER TUTTI I COLORI TAILWIND ===
export const tailwind_colors_steps = [
  { bg:"transparent", color:"white" }, 
  { bg:"current", color:'white' }, 
  { bg:"white",   color:"black" }, 
  { bg:"black",   color:"white" }, 

  { bg:"yellow",  white_after: 600}, 
  { bg:"amber",   white_after: 600}, 
  { bg:"lime",    white_after: 600}, 
  { bg:"green",   white_after: 600}, 
  { bg:"cyan",    white_after: 500}, 
  { bg:"teal",    white_after: 500}, 
  { bg:"emerald", white_after: 500}, 
  { bg:"sky",     white_after: 500}, 
  { bg:"orange",  white_after: 500}, 
  { bg:"fuchsia", white_after: 400}, 
  { bg:"blue",    white_after: 400}, 
  { bg:"pink",    white_after: 400}, 
  { bg:"rose",    white_after: 400}, 
  { bg:"red",     white_after: 400}, 
  { bg:"purple",  white_after: 400}, 
  { bg:"violet",  white_after: 400}, 
  { bg:"indigo",  white_after: 400}, 
  { bg:"slate",   white_after: 400}, 
  { bg:"neutral", white_after: 500}, 
  { bg:"stone",   white_after: 500}, 
  { bg:"gray",    white_after: 400}, 
  { bg:"zinc",    white_after: 500}, 
];

export const tailwind_colors = tailwind_colors_steps.map(item=> item.bg)

export const tailwind_shades = [100, 200, 300, 400, 500, 600, 700, 800, 900];

function applyStyle() {
  const styleTag = document.createElement("style");

  // === TRANSLATE (X e Y) ===
  const translateClasses = [1, 2, 3, 4, 5].map(i => `
    .translate-y-${i} {
      transform: translateY(${i}rem);
    }
    .-translate-y-${i} {
      transform: translateY(-${i}rem);
    }
    .translate-x-${i} {
      transform: translateX(${i}rem);
    }
    .-translate-x-${i} {
      transform: translateX(-${i}rem);
    }
  `).join("\n");


  // === CLIP-PATH (Slash e Reverse Slash) ===
  const slashVariants = [
    { name: "left", clip: "polygon(5% 0%, 100% 0%, 100% 100%, 0% 100%)" },
    { name: "top", clip: "polygon(0% 0%, 100% 10%, 100% 100%, 0% 100%)" },
    { name: "right", clip: "polygon(0% 0%, 100% 0%, 95% 100%, 0% 100%)" },
    { name: "bottom", clip: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 90%)" },
    { name: "x", clip: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)" },
    { name: "y", clip: "polygon(0% 0%, 100% 10%, 100% 100%, 0% 90%)" },
  ];

  const rSlashVariants = [
    { name: "left", clip: "polygon(0% 0%, 100% 0%, 100% 100%, 5% 100%)" },
    { name: "top", clip: "polygon(0% 10%, 100% 0%, 100% 100%, 0% 100%)" },
    { name: "right", clip: "polygon(0% 0%, 95% 0%, 100% 100%, 0% 100%)" },
    { name: "bottom", clip: "polygon(0% 0%, 100% 0%, 100% 90%, 0% 100%)" },
    { name: "x", clip: "polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)" },
    { name: "y", clip: "polygon(0% 10%, 100% 0%, 100% 90%, 0% 100%)" },
  ];

  const slashClasses = [
    ...slashVariants.map(v => `
      .slash-${v.name} {
        clip-path: ${v.clip};
      }
    `),
    ...rSlashVariants.map(v => `
      .r-slash-${v.name} {
        clip-path: ${v.clip};
      }
    `),
  ].join("\n");


  

  // Genera tutte le classi .text.bg-*-* usando tailwind_colors_steps
  const textBgClasses = tailwind_colors_steps.map(item => {
    // Colori speciali con colore definito
      if (item.color) {
        return `
          .text.bg-${item.bg} {
            color: ${item.color};
          }
        `;
      // Colori con white_after per sfumature
      } else if (item.white_after) {
        return tailwind_shades
          .map(shade => {
            const textColor = shade < item.white_after ? "black" : "white";
            return `
              .text.bg-${item.bg}-${shade} {
                color: ${textColor};
              }
            `;
          })
          .join("\n");
      }
      return "";
    })
    .join("\n");

  // Combina tutti gli stili
  styleTag.textContent = [
    translateClasses,
    slashClasses,
    textBgClasses,
    appClasses(),
  ].join("\n");

  document.head.appendChild(styleTag);
}

const colorTokens: Record<string, { value: string; fg: string }> = {
  primary:   { value: 'var(--color-lime-500)', fg: 'black' },
  secondary: { value: 'var(--color-lime-700)', fg: 'white' },
  tertiary:  { value: 'var(--color-lime-800)', fg: 'white' },
  danger:    { value: 'var(--color-red-500)',  fg: 'white' },
  light:     { value: 'var(--color-lime-300)', fg: 'black' },
  neutral:   { value: 'var(--color-gray-600)', fg: 'white' },
  dark:      { value: 'var(--color-dark)',     fg: 'white' },
};

function appClasses(): string {
  const blocks: string[] = [];

  for (const [name, { value, fg }] of Object.entries(colorTokens)) {
    blocks.push(`.text-${name} {
      color: ${value};
    }
    .text-bg-${name} {
      background-color: ${value};
      color: ${fg};
    }
    .bg-${name} {
      background-color: ${value};
    }
    .border-${name} {
      border-color: ${value};
    }
    .outline-${name} {
      outline-color: ${value};
    }`);
  }

  return blocks.join('\n');
};

*/