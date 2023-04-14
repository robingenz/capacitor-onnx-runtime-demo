import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'iris-dataset',
    loadComponent: () =>
      import('./pages/iris-dataset/iris-dataset.page').then(
        (m) => m.IrisDatasetPage
      ),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'spam-dataset',
    loadComponent: () => import('./pages/spam-dataset/spam-dataset.page').then( m => m.SpamDatasetPage)
  },
];
