import { FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { randomCompiler } from "../../tools/randomCompiler";

export interface FormField {
  type: string;
  key: string;
  label: string;
  value: string | number | boolean;
  placeholder?: string;
  message?: string;
  options?: { label: string, value: string | number }[];
  
  asterisk?: boolean;
  validation?: (value: any) => boolean; // Questa potrebbe essere deprecata o usata per logica custom non-Angular
  errorMessage?: string;
  validators?: ValidatorFn[]; 
}

export function initForm(): FormField[] {
  const result: FormField[] = [
    {
      type: 'text',
      key: 'email',
      label: 'Email',
      value: '',
      placeholder: 'Es: mario.rossi@gmail.com',
      asterisk: true,
      errorMessage: 'Email non valida.',
      validators: [Validators.required, Validators.email, Validators.minLength(3)] 
    },
    {
      type: 'text',
      key: 'username',
      label: 'Username',
      value: '',
      placeholder: 'Es: Interista_sbarazzino_123',
      asterisk: true,
      errorMessage: 'L\'username deve contenere almeno 6 caratteri.',
      validators: [Validators.required, Validators.minLength(6)] 
    },
    {
      type: 'password',
      key: 'password',
      label: 'Password',
      value: '',
      placeholder: 'Es: es3mpio_' + randomCompiler.number(999999),
      asterisk: true,
      errorMessage: 'La password deve avere tra 6 e 16 caratteri.',
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(16)] 
    },
    {
      type: 'select',
      key: 'role',
      label: 'Ruolo',
      value: '',
      placeholder: 'Seleziona un ruolo',
      options: [
        { value: 0, label: 'Admin' },
        { value: 1, label: 'Writer' },
        { value: 2, label: 'User' },
      ],
      asterisk: true,
      errorMessage: 'Devi selezionare un ruolo.',
      validators: [Validators.required]
    },
  ];
  return result;
}

/*
 * Funzione helper per creare un FormGroup a partire dalla configurazione.
   Il componente che ospita il form può usare questa funzione.
*/
export function getForm(config: FormField[]): FormGroup {
  const group: any = {};
  config.forEach(field => {
    group[field.key] = new FormControl(field.value || '', field.validators || []);
  });
  return new FormGroup(group);
}
