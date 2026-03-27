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

- x search input
- programmazione+test nello stesso file
- prova ad aggiungere un iframe
3) inserire audio o video

## dnd
2. inserire le schede dei diversi personaggi che l'utente ha salvato
2. guida equipaggiamento
2. guida abilità (una stella accanto alla label)
3. file di autocompletamento (competenza tiri salvezza in base alla classe)
3. talenti
3. incantesimi: sezione attacchi ed incantesimi. aggiungere incantesimi

# arena

- ? layout: risultato dadi in alto a destra
- fix: nella cartella /arena controlla se nei file, divisi per ambito, ci sono funzionalità che non gli riguardano
- fix: nella cartella /arena, bisogna evitare troppi toast. proposta: i toast devono essere invocati solo nel file arena.component.ts. nei service, sostituisci i toast con i console.danger