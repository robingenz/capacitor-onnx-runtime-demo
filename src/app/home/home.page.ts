import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { IrisDatasetModalComponent } from './iris-dataset-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {
  constructor(private modalCtrl: ModalController) {}

  public async openIrisDatasetModal(): Promise<void> {
    const element = await this.modalCtrl.create({
      component: IrisDatasetModalComponent,
      showBackdrop: false,
      cssClass: 'fullscreen-modal',
    });
    await element.present();
  }
}
