# Angular demo

Questo progetto è stato generato con [Angular CLI](https://github.com/angular/angular-cli) versione 17.3.7.

Progetto sviluppato per **scopo ludico**. Si stanno sviluppando demo di giochi, schede digitali per giochi di ruolo e giochi da tavolo digitalizzati.

## Server di sviluppo

Esegui `ng serve` per un server di sviluppo. Naviga su `http://localhost:4200/`. 

**Docker:** eseguire i seguenti comandi per avviare l'applicazione in un container Docker:

```bash
npm run docker:up
npm run docker:logs
```

## Scaffolding del codice

Esegui `ng generate component nome-componente` per generare un nuovo componente. Puoi anche usare `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Compilazione (Build)

Esegui `ng build` per compilare il progetto. Gli artefatti della compilazione verranno memorizzati nella directory `dist/`.

## Esecuzione dei test

Esegui `npx playwright test` per eseguire tutti i test disponibili nel progetto.

* **Test per componente specifico:** `npx playwright test src/app/tests/nomeFile.test.js`
* **Esempio:** `npx playwright test src/app/tests/list.test.js`

## Ulteriore aiuto

Per ottenere ulteriore aiuto su Angular CLI usa `ng help` o consulta la pagina [Angular CLI Overview and Command Reference](https://angular.io/cli).

## Funzionalità

L'applicazione include le seguenti funzionalità, sviluppate per scopi di **intrattenimento e sperimentazione**:

* **Sistema di Login:** Gestione dell'accesso e autenticazione degli utenti (simulazione).
* **Pagina DND:** Sezione dedicata a contenuti e strumenti per **Dungeons & Dragons** (gioco di ruolo).
* **Gestione Liste:** Creazione e organizzazione di liste personalizzate (es. inventari, equipaggiamenti).
* **Area Personale:** Sezione per la gestione del profilo e delle impostazioni utente (simulazione).
* **Home Page:** La pagina principale di atterraggio del sito.
* **Gestione Gerarchica:** Visualizzazione e gestione di dati strutturati gerarchicamente (es. albero delle abilità, strutture narrative).
