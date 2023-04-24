import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class HomePage {
  public datasets = {
    Tabular: [
      {
        name: 'Auto MPG',
        url: '/auto-mpg-regression',
      },
      {
        name: 'Iris Species',
        url: '/iris-classification',
      },
      {
        name: 'Spam',
        url: '/spam-classification',
      },
    ],
    'Computer Vision': [
      {
        name: 'MNIST Image',
        url: '/mnist-classification',
      },
    ],
  };
}
