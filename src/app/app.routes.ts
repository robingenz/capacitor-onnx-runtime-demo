import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'iris-classification',
    loadComponent: () =>
      import('./pages/iris-classification/iris-classification.page').then(
        (m) => m.IrisClassificationPage
      ),
  },
  {
    path: 'spam-classification',
    loadComponent: () =>
      import('./pages/spam-classification/spam-classification.page').then(
        (m) => m.SpamClassificationPage
      ),
  },
  {
    path: 'mnist-classification',
    loadComponent: () =>
      import('./pages/mnist-classification/mnist-classification.page').then(
        (m) => m.MnistClassificationPage
      ),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
