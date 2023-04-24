import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@app/services';
import { IonicModule } from '@ionic/angular';
import * as ort from 'onnxruntime-web';

@Component({
  selector: 'app-auto-mpg-regression',
  templateUrl: './auto-mpg-regression.page.html',
  styleUrls: ['./auto-mpg-regression.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class AutoMpgRegressionPage {
  public formGroup = new FormGroup({
    cylinders: new FormControl(8),
    displacement: new FormControl(390),
    horsepower: new FormControl(190),
    weight: new FormControl(3850),
    acceleration: new FormControl(8.5),
    modelYear: new FormControl(70),
    origin: new FormControl(2),
    label: new FormControl<number | undefined>(undefined),
    time: new FormControl<number | undefined>(undefined),
  });
  public blob: Blob | undefined;

  constructor(private readonly dialogService: DialogService) {}

  public async runInference(): Promise<void> {
    let blob = this.blob;
    if (!blob) {
      blob = await this.downloadModel();
    }
    const cylinders = this.formGroup.get('cylinders')?.value;
    const displacement = this.formGroup.get('displacement')?.value;
    const horsepower = this.formGroup.get('horsepower')?.value;
    const weight = this.formGroup.get('weight')?.value;
    const acceleration = this.formGroup.get('acceleration')?.value;
    const modelYear = this.formGroup.get('modelYear')?.value;
    let origin = [1, 0, 0];
    if (this.formGroup.get('origin')?.value === 1) {
      origin = [0, 1, 0];
    } else if (this.formGroup.get('origin')?.value === 2) {
      origin = [0, 0, 1];
    }
    if (
      !cylinders ||
      !displacement ||
      !horsepower ||
      !weight ||
      !acceleration ||
      !modelYear ||
      !origin
    ) {
      return;
    }
    const startTime = performance.now();
    const arrayBuffer = await blob.arrayBuffer();
    const session = await ort.InferenceSession.create(arrayBuffer);
    const data = Float32Array.from([
      cylinders,
      displacement,
      horsepower,
      weight,
      acceleration,
      modelYear,
      ...origin,
    ]);
    const tensor = new ort.Tensor('float32', data, [1, 9]);
    const input = {
      normalization_input: tensor,
    };
    const results = await session.run(input, ['dense_7']);
    console.log(results);
    const endTime = performance.now();
    this.formGroup.patchValue({
      label: Number(results['dense_7'].data),
      time: endTime - startTime,
    });
  }

  private async downloadModel(): Promise<Blob> {
    const element = await this.dialogService.showLoading({
      message: 'Downloading model...',
    });
    try {
      const response = await fetch('/assets/models/auto-mpg.onnx');
      this.blob = await response.blob();
      return this.blob;
    } finally {
      await element.dismiss();
    }
  }
}
