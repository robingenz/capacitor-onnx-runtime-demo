import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@app/core';
import { IonicModule } from '@ionic/angular';
import * as ort from 'onnxruntime-web';

@Component({
  selector: 'app-iris-dataset-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Iris Species</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Inference</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form [formGroup]="formGroup">
            <ion-item>
              <ion-input
                type="number"
                formControlName="sepalLength"
                [label]="'Sepal length (cm)'"
                [labelPlacement]="'stacked'"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input
                type="number"
                formControlName="sepalWidth"
                [label]="'Sepal width (cm)'"
                [labelPlacement]="'stacked'"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input
                type="number"
                formControlName="petalLength"
                [label]="'Petal length (cm)'"
                [labelPlacement]="'stacked'"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input
                type="number"
                formControlName="petalWidth"
                [label]="'Petal width (cm)'"
                [labelPlacement]="'stacked'"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input
                type="number"
                formControlName="class"
                [readonly]="true"
                [label]="'Class'"
                [labelPlacement]="'stacked'"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input
                type="number"
                formControlName="time"
                [readonly]="true"
                [label]="'Time (ms)'"
                [labelPlacement]="'stacked'"
              ></ion-input>
            </ion-item>
          </form>
          <ion-button (click)="downloadModel()">Download Model</ion-button>
          <ion-button (click)="runInference()" [disabled]="!this.blob"
            >Run Inference</ion-button
          >
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: [],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class IrisDatasetModalComponent {
  public formGroup = new FormGroup({
    sepalLength: new FormControl(5.2),
    sepalWidth: new FormControl(3.4),
    petalLength: new FormControl(1.4),
    petalWidth: new FormControl(0.2),
    class: new FormControl<number | undefined>(undefined),
    time: new FormControl<number | undefined>(undefined),
  });
  public blob: Blob | undefined;

  constructor(private readonly dialogService: DialogService) {}

  public async closeModal(): Promise<void> {
    await this.dialogService.dismissModal();
  }

  public async downloadModel(): Promise<void> {
    const element = await this.dialogService.showLoading();
    try {
      const response = await fetch('/assets/models/iris.onnx');
      this.blob = await response.blob();
    } finally {
      await element.dismiss();
    }
  }

  public async runInference(): Promise<void> {
    const blob = this.blob;
    if (!blob) {
      return;
    }
    const sepalLength = this.formGroup.get('sepalLength')?.value;
    const sepalWidth = this.formGroup.get('sepalWidth')?.value;
    const petalLength = this.formGroup.get('petalLength')?.value;
    const petalWidth = this.formGroup.get('petalWidth')?.value;
    if (!sepalLength || !sepalWidth || !petalLength || !petalWidth) {
      return;
    }
    const startTime = performance.now();
    const arrayBuffer = await blob.arrayBuffer();
    const session = await ort.InferenceSession.create(arrayBuffer);
    const data = Float32Array.from([
      sepalLength,
      sepalWidth,
      petalLength,
      petalWidth,
    ]);
    const tensor = new ort.Tensor('float32', data, [1, 4]);
    const input = {
      float_input: tensor,
    };
    const results = await session.run(input, ['output_label']);
    const endTime = performance.now();
    this.formGroup.patchValue({
      class: Number(results['output_label'].data),
      time: endTime - startTime,
    });
    // const result = results['output_label'].data as BigInt64Array;
    // console.log(results['output_label'].data);
    // var enc = new TextDecoder('utf-8');
    // console.log(enc.decode(result.buffer));
    // console.log(Number(result[0]));
  }
}
