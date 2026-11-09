# Comandi abituali

git reset head~1
git push origin -f main 
npx playwright test src/app/tests/list.test.ts

# Prassi git

`<tipo>(<ambito opzionale>): <descrizione>`

- tipo: feat, fix, docs, style, refactor, test, chore

Esempi:

- feat(auth): add login with Google
- fix(ui): correct button alignment on mobile
- docs: update README with setup instructions

# Cose da completare

## Generali 

* [] 1) layout ottimizzato per mobile
* [] 3) inserire audio o video
* [] search input
* [] programmazione+test nello stesso file

## dnd
2. inserire le schede dei diversi personaggi che l'utente ha salvato
2. guida equipaggiamento
2. guida abilità (una stella accanto alla label)
3. file di autocompletamento (competenza tiri salvezza in base alla classe)
3. talenti
3. incantesimi: sezione attacchi ed incantesimi. aggiungere incantesimi

# mini
mini.component.ts
* implementare la pagina per più personaggi. la pagina deve gestire più personaggi in diverse schede
  * in basso deve comparire una bottombar (overflow horizontal) con, a sinistra, un pulsante per aggiungere un nuovo personaggio e, a destra, i personaggi salvati 
  
