import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rutas de autenticación (sin layout)
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent) 
  },
  
  // Rutas protegidas (con layout)
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'micros', pathMatch: 'full' },
      { path: 'chicos', loadComponent: () => import('./pages/chicos/chicos.component').then(m => m.ChicosComponent) },
      { path: 'micros', loadComponent: () => import('./pages/micros/micros.component').then(m => m.MicrosComponent) },
      { path: 'choferes', loadComponent: () => import('./pages/choferes/choferes.component').then(m => m.ChoferesComponent) },
    ]
  },
  
  // Ruta por defecto
  { path: '**', redirectTo: 'login' }
];