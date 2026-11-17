# Relazione sul Layout Mobile-First

## Panoramica
Il sito NovelNext è progettato con un approccio **mobile-first**, ottimizzato specificamente per la visualizzazione su dispositivi mobili. L'architettura del layout garantisce un'esperienza utente fluida e responsiva su schermi di diverse dimensioni.

---

## 1. Configurazione Viewport

### File: `app/layout.tsx`

```typescript
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};
```

**Dettagli:**
- **`width: "device-width"`**: Adatta la larghezza del viewport alla larghezza del dispositivo, evitando lo zoom automatico
- **`initialScale: 1`**: Imposta lo zoom iniziale al 100%, garantendo che il contenuto sia leggibile senza ridimensionamento
- **`viewportFit: "cover"`**: Su iOS, fa sì che il contenuto copra l'intero schermo, inclusa l'area della notch
- **`interactiveWidget: "resizes-content"`**: Quando la tastiera virtuale si apre, il contenuto viene ridimensionato invece di essere coperto

---

## 2. Struttura Layout Principale

### File: `app/layout.tsx`

```tsx
<body className="h-dvh flex flex-col overflow-hidden text-bg-neutral">
  <div id="app" className="flex-1 overflow-y-auto mt-[50px]">
    <MainContent>{children}</MainContent>
  </div>
</body>
```

**Dettagli:**
- **`h-dvh`**: Usa l'alzza dinamica del viewport (Dynamic Viewport Height), che considera la barra degli indirizzi del browser mobile
- **`flex flex-col`**: Layout verticale flessibile con Flexbox
- **`overflow-hidden`**: Previene lo scroll a livello del body, delegandolo al contenitore interno
- **`flex-1`**: Il contenitore occupa tutto lo spazio disponibile
- **`overflow-y-auto`**: Abilita lo scroll verticale solo quando necessario
- **`mt-[50px]`**: Margine superiore di 50px per compensare la navbar fissa

---

## 3. Navbar Fissa in Alto

### File: `app/shareds/Navbar.tsx`

```tsx
<nav id="Navbar" className="fixed top-0 z-50 w-full print:hidden">
  <div className="w-full text-bg-dark border-b border-gray-800">
    <div className="mx-auto container max-w-[800px]">
      <div className="min-h-[50px] flex items-center">
        {/* Contenuto navbar */}
      </div>
    </div>
  </div>
</nav>
```

**Dettagli:**
- **`fixed top-0`**: Posizionamento fisso nella parte superiore dello schermo
- **`z-50`**: Z-index elevato per garantire che sia sempre sopra il contenuto
- **`w-full`**: Occupa tutta la larghezza dello schermo
- **`max-w-[800px]`**: Su desktop, il contenuto è limitato a 800px e centrato
- **`min-h-[50px]`**: Altezza minima di 50px per garantire spazio sufficiente per il tocco
- **Barra di progresso scroll**: Una linea orizzontale che mostra il progresso di lettura

---

## 4. Bottombar Fissa in Basso

### File: `app/shareds/Bottombar.tsx`

```tsx
<section id="bottombar" 
        className="fixed bottom-0 right-0 z-30 w-fit print:hidden md:left-1/2 md:-translate-x-1/2">
  <div className="flex justify-end items-end gap-1">
    {props.children}
  </div>
</section>
```

**Dettagli:**
- **`fixed bottom-0`**: Posizionamento fisso nella parte inferiore dello schermo
- **`right-0`**: Su mobile, allineata a destra
- **`md:left-1/2 md:-translate-x-1/2`**: Su desktop (schermi ≥768px), centrata orizzontalmente
- **`w-fit`**: La larghezza si adatta al contenuto
- **`z-30`**: Z-index inferiore alla navbar ma superiore al contenuto

### File: `app/shareds/Bottombar.sass`

```sass
.circle
    width: 50px
    height: 50px
    border-radius: 100%
    display: flex
    align-items: center
    justify-content: center
    box-shadow: 0 5px 5px #00000055
```

**Dettagli:**
- **Dimensioni 50x50px**: Ottimizzato per il tocco (dimensione minima raccomandata 44x44px)
- **`border-radius: 100%`**: Pulsanti circolari per un look moderno
- **Ombra**: Effetto di elevazione per migliorare la visibilità

---

## 5. Container del Contenuto

### File: `app/books/[id]/[part]/[section]/SectionComponent.tsx`

```tsx
<section id="SectionComponent" className="pb-10 text-bg-neutral">
  <div className="mx-auto container max-w-[400px]">
    <section className="min-h-dvh flex-1">
      {/* Contenuto */}
    </section>
  </div>
</section>
```

**Dettagli:**
- **`max-w-[400px]`**: Larghezza massima di 400px, ottimizzata per la lettura su mobile
- **`mx-auto`**: Centrato orizzontalmente
- **`min-h-dvh`**: Altezza minima pari al viewport dinamico
- **`pb-10`**: Padding inferiore di 2.5rem per evitare che il contenuto sia nascosto dalla bottombar

---

## 6. Scroll Padding per Safe Areas

### File: `app/styles.sass`

```sass
html
    scroll-behavior: smooth
    scroll-padding-top: calc(3.5rem + env(safe-area-inset-top))
    scroll-padding-bottom: calc(4rem + env(safe-area-inset-bottom))
```

**Dettagli:**
- **`scroll-behavior: smooth`**: Scorrimento fluido con animazione
- **`env(safe-area-inset-top)`**: Supporto per la notch di iPhone e altre aree di sistema
- **`env(safe-area-inset-bottom)`**: Supporto per l'home indicator di iPhone
- **Padding dinamico**: Lo scroll si adatta automaticamente alle diverse dimensioni delle safe area

---

## 7. Scrollbar Personalizzata

### File: `app/styles.sass`

```sass
html
    scrollbar-width: thin
    scrollbar-color: var(--color-lime-700) var(--color-dark)

::-webkit-scrollbar
    width: 8px
    height: 8px

::-webkit-scrollbar-thumb
    background: var(--color-lime-700)
    border-radius: 4px
```

**Dettagli:**
- **`scrollbar-width: thin`**: Scrollbar sottile su Firefox
- **Dimensioni 8px**: Compromesso tra visibilità e spazio occupato
- **Colori personalizzati**: Verde lime su sfondo scuro per coerenza con il tema
- **`border-radius: 4px`**: Angoli arrotondati per un look moderno

---

## 8. Utility Responsive

### Esempi nel codice:

```tsx
<span className="ms-1 hidden sm:inline">Segnalibri</span>
```

**Dettagli:**
- **`hidden sm:inline`**: Nasconde il testo "Segnalibri" su mobile, lo mostra su schermi ≥640px
- **`print:hidden`**: Nasconde elementi durante la stampa (navbar, bottombar, footer)

---

## 9. Ottimizzazioni Touch

### File: `app/styles.sass`

```sass
button, a
    &:not(:disabled)
        cursor: pointer !important
        &:hover
            filter: brightness(1.3) !important
            transition: filter 0.3s ease-in-out !important
        &:active
            filter: brightness(1.8) !important
            transition: filter 0.2s ease-in-out !important
```

**Dettagli:**
- **Feedback visivo**: Effetto brightness al tocco per confermare l'interazione
- **Transizioni fluide**: Animazioni di 0.2-0.3 secondi per un feedback naturale
- **Stato disabled**: Opacità ridotta e scala di grigi per elementi non interattivi

---

## 10. Gestione della Tastiera

Grazie alla configurazione del viewport con `interactiveWidget: "resizes-content"`, quando la tastiera virtuale si apre su mobile:
- Il contenuto viene ridimensionato invece di essere coperto
- L'utente può sempre vedere ciò che sta scrivendo
- Il layout si adatta dinamicamente allo spazio disponibile

---

## 11. Stili Specifici per Paragrafi

### File: `app/books/[id]/[part]/[section]/Section.sass`

Il file definisce diverse classi per lo stile dei paragrafi, tutte ottimizzate per mobile:
- **`.limitato`**: Larghezza 80%, max 400px, centrato
- **`.destra` / `.sinistra`**: Allineamento a destra/sinistra con margini
- **`.centro`**: Centrato orizzontalmente
- **`.dialogo` / `.sussurro`**: Stili per dialoghi con bordi arrotondati
- **`.lista`**: Liste con puntino personalizzato
- **`.dettaglio`**: Dettagli con bordo sinistro

Tutti questi stili usano unità relative e percentuali per adattarsi a schermi di diverse dimensioni.

---

## 12. Componenti Offcanvas e Modal

### File: `app/books/[id]/[part]/[section]/SectionComponent.tsx`

```tsx
<div className="fixed inset-0 z-50 flex">
  <div className="relative ml-auto w-80 max-w-full h-full">
    {/* Contenuto offcanvas */}
  </div>
</div>
```

**Dettagli:**
- **`fixed inset-0`**: Copre l'intero schermo
- **`w-80`**: Larghezza di 20rem (320px) su mobile
- **`max-w-full`**: Non supera mai la larghezza dello schermo
- **`ml-auto`**: Allineato a destra (slide-in da destra)

---

## Riassunto delle Best Practice Implementate

1. **Viewport ottimizzato**: Configurazione completa per dispositivi mobili
2. **Layout flessibile**: Flexbox per adattarsi a diverse dimensioni
3. **Posizionamento fisso**: Navbar e bottombar sempre accessibili
4. **Container limitato**: Larghezza massima di 400px per ottimale leggibilità
5. **Safe areas**: Supporto per notch e home indicator iOS
6. **Scrollbar sottile**: Minimizza lo spazio occupato
7. **Utility responsive**: Nasconde/mostra elementi in base alla dimensione
8. **Touch-friendly**: Pulsanti di dimensioni adeguate e feedback visivo
9. **Gestione tastiera**: Il contenuto non viene coperto dalla tastiera
10. **Stili adattivi**: Unità relative e percentuali per massima flessibilità

---

## Conclusione

Il layout di NovelNext è progettato con un approccio mobile-first rigoroso. Ogni aspetto del layout è stato ottimizzato per garantire un'esperienza utente eccellente su dispositivi mobili, mantenendo al contempo una buona usabilità su desktop attraverso l'uso di breakpoint e utility responsive.
