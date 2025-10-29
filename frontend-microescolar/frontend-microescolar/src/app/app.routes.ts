import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'chicos', loadComponent: () => import('./pages/chicos/chicos.component').then(m => m.ChicosComponent) },
      { path: 'micros', loadComponent: () => import('./pages/micros/micros.component').then(m => m.MicrosComponent) },
      { path: 'choferes', loadComponent: () => import('./pages/choferes/choferes.component').then(m => m.ChoferesComponent) },
    ]
  }
];