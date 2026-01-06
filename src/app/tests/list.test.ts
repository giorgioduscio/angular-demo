import { test, expect } from '@playwright/test';

test.describe('ListComponent', () => {
  const LIST_URL = 'http://localhost:4200/list';
  const TEST_ITEM_TITLE = 'Test_' + Date.now();

  test.beforeEach(async ({ page }) => {
    // Navigate to the list page
    await page.goto(LIST_URL);
    // Clear local storage before each test to ensure a clean state
    await page.evaluate(() => localStorage.clear());
    // Reload the page to apply the cleared local storage
    await page.goto(LIST_URL);
  });

  async function CREATE(page:any) {
    await page.locator('form input[name="title"]').fill(TEST_ITEM_TITLE);
    await page.locator('form button[type="submit"]').click();
    console.log(`* Compilazione: ${TEST_ITEM_TITLE}`);
  }

  test('CREATE', async ({ page }) => {
    // conta tutti gli elementi iniziali della lista
    const counter_start = await page.locator('main input[name="title"]').count();
    console.log(`* Lunghezza lista: ${counter_start}`);
    
    // Esegue form
    await CREATE(page);
    
    // conta tutti gli Lunghezza lista dopo l'aggiunta
    const listItems = page.locator('main input[name="title"]');
    const counter_end = await listItems.count();
    const aggiuntaAvvenuta = counter_end > counter_start;
    console.log(`* Lunghezza lista: ${counter_end}`);

    const lastItem = await listItems.nth(counter_end - 1).inputValue();
    const valoreCambiato = lastItem ===TEST_ITEM_TITLE;
    console.log(`* Elemento aggiunto: ${lastItem}`);
    
    expect(aggiuntaAvvenuta && valoreCambiato).toBeTruthy()
    await page.screenshot({ path: 'test-results/list-create.png' });
  });

  test('UPDATE', async ({ page }) => {
    await CREATE(page);
    // seleziona l'ultima coppia di input e checkbox
    const list_inputs = page.locator('main input[name="title"]');   
    const last_input = list_inputs.last();
    const input_value_start = await last_input.inputValue();
    
    const list_checkboxes = page.locator('main input[type="checkbox"]');
    const last_checkbox = list_checkboxes.last();
    const checkbox_value_start = await last_checkbox.isChecked();
    console.log(`* Iniziale: ${checkbox_value_start} ${input_value_start}`);

    await last_input.fill((await last_input.inputValue()).toUpperCase());
    await last_checkbox.click();
    console.log(`* Modifica: ${await last_checkbox.isChecked()} ${await last_input.inputValue()}`);

    const isChange = checkbox_value_start !== await last_checkbox.isChecked() || 
                     input_value_start !== await last_input.inputValue();
    expect(isChange).toBeTruthy();
    await page.screenshot({ path: 'test-results/list-update.png' });
  });

  test('DELETE', async ({ page }) => {
    await CREATE(page);
    // seleziona tutti i pulsanti di eliminazione
    const deleteButtons = page.locator('button.btn-danger');
    const counter_start = await deleteButtons.count();
    console.log(`* Lunghezza lista: ${counter_start}`);
    
    // clicca l'ultimo pulsante
    const lastButton = deleteButtons.last();
    await lastButton.click();
    // clicca conferma
    await page.locator('button#agree-ok').click();
    
    // verifica che il conteggio sia diminuito
    const counter_end = await deleteButtons.count();
    const eliminazioneAvvenuta = counter_end < counter_start;
    console.log(`* post-delete: ${counter_end}`);
    
    expect(eliminazioneAvvenuta).toBeTruthy();
    await page.screenshot({ path: 'test-results/list-delete.png' });
  });
});

