import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'log',
    loadComponent: () => import('./pages/log/log.page').then( m => m.LogPage)
  },
  {
    path: 'entry-detail',
    loadComponent: () => import('./pages/entry-detail/entry-detail.page').then( m => m.EntryDetailPage)
  },
  {
    path: 'mood-decider',
    loadComponent: () => import('./pages/mood-decider/mood-decider.page').then( m => m.MoodDeciderPage)
  },
];
