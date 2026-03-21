import PersonaggioDND from "../../interfaces/personaggioDND";
import {toast} from "../../tools/feedbacksUI";

export const local = {
  async get(){
    const characterData = localStorage.getItem('character');
    return JSON.parse(characterData || '');
  },
  async set(newCharacter: PersonaggioDND){
    localStorage.setItem('character', JSON.stringify(newCharacter));
  },
  async copy(character: PersonaggioDND){
    const data = JSON.stringify(character, null, 2);
    navigator.clipboard.writeText(data);
  },
  async paste(){
    const text = await navigator.clipboard.readText()
    // deve contenere '{', '}', ']' e '['
    const requiredChars = ['{', '}', '[', ']', ':'];
    const hasRequiredChars = requiredChars.every(char => text.includes(char));
    if (!hasRequiredChars) {
      toast.danger("Il contenuto degli appunti non è un JSON valido.");
      return;
    }
    const result = JSON.parse(text);
    return result;
  },
}
