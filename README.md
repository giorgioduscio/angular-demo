# 🎮 Angular Gaming Architecture Demo

Questa è una dimostrazione di architettura front-end professionale applicata al mondo del gaming e del gioco di ruolo, focalizzata su **scalabilità**, **performance** e **accessibilità (A11y)**.

## 🚀 Quick Start

### Con Docker (Consigliato)

Il progetto è containerizzato per garantire coerenza tra gli ambienti di sviluppo.

*   **Sviluppo:** `npm run docker:up` → [http://localhost:4200](http://localhost:4200)
*   **Monitoraggio:** `npm run docker:logs`

### Locale

1. `npm install`
2. `ng serve` → [http://localhost:4200](http://localhost:4200)

## 🛠 Tech Stack & Architecture

*   **Core:** Angular 17 (Standalone Components & Signals)
*   **State Management:** Servizi reattivi con RxJS e Signals per una gestione fluida della logica di gioco.
*   **Styling:** Bootstrap 5 + Custom CSS (Mobile First & Performance oriented).
*   **Testing:** Playwright per test E2E robusti e affidabili.
*   **Infrastruttura:** Docker & Docker Compose per un deployment riproducibile.

## 🏗️ Caratteristiche Enterprise (Best Practices)

*   **Performance Optimization:** Ottimizzazione del rendering tramite l'uso efficiente dei Signals di Angular e strategie di change detection mirate.
*   **Accessibilità (A11y):** Implementazione rigorosa di standard ARIA, navigabilità da tastiera e contrasti cromatici ottimizzati per il gaming inclusivo.
*   **Robustezza:** Tipizzazione forte con TypeScript per la gestione di algoritmi complessi (calcolo dadi, sistemi di combattimento e mappe).
*   **Scalabilità:** Architettura modulare che permette l'estensione facilitata di nuove meccaniche di gioco o schede personaggio.

## 📋 Funzionalità Core

*   **🔐 Sistema di Login:** Architettura di autenticazione basata su Guardie e Servizi centralizzati.
*   **🐉 Modulo D&D:** Gestione avanzata di schede personaggio e calcolatori meccanici per GDR.
*   **📊 Gestione Gerarchica:** Visualizzazione di strutture dati complesse (alberi delle abilità e nodi narrativi).
*   **🗺️ Arena Engine:** Motore di gestione mappe e combattimenti a turni.

---
*Sviluppato con enfasi su manutenibilità, clean code e standard A11y.*
