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
    classification: [
      {
        name: 'Iris Species',
        url: '/iris-classification',
      },
      {
        name: 'MNIST',
        url: '/mnist-classification',
      },
      {
        name: 'Spam',
        url: '/spam-classification',
      },
    ],
  };
}
