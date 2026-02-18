import { Routes } from '@angular/router';
import { GeneratorComponent } from './features/generator/generator.component';

export const routes: Routes = [
  {
    path: '',
    component: GeneratorComponent
  },
  {
    path: 'gemini',
    loadComponent: () => import('../app/features/gemini/gemini.component').then(m => m.GeminiComponent)
  }
];
