import { Component } from '@angular/core';
import { HierarchyBBComponent } from "./hierarchyBB.component";

@Component({
  selector: 'app-hierarchyB',
  standalone: true,
  imports: [HierarchyBBComponent],
  template: `
    <main class="p-2 border rounded my-2" style="max-width: 300px;">
      <header class="d-flex align-items-center gap-2">
        <h3>Componente B</h3>
      </header>
      <div class="d-flex flex-wrap justify-content-evenly gap-2 mt-2">
        <app-hierarchyBB></app-hierarchyBB>
      </div>
    </main>
  `,
})
export class HierarchyBComponent{
  
}
