import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@app/services';
import { IonicModule } from '@ionic/angular';
import * as ort from 'onnxruntime-web';

@Component({
  selector: 'app-iris-classification',
  templateUrl: './iris-classification.page.html',
  styleUrls: ['./iris-classification.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class IrisClassificationPage {
  public formGroup = new FormGroup({
    sepalLength: new FormControl(5.2),
    sepalWidth: new FormControl(3.4),
    petalLength: new FormControl(1.4),
    petalWidth: new FormControl(0.2),
    label: new FormControl<number | undefined>(undefined),
    probability: new FormControl<number | undefined>(undefined),
    time: new FormControl<number | undefined>(undefined),
  });
  public blob: Blob | undefined;

  constructor(private readonly dialogService: DialogService) {}

  public async closeModal(): Promise<void> {
    await this.dialogService.dismissModal();
  }

  public async runInference(): Promise<void> {
    let blob = this.blob;
    if (!blob) {
      blob = await this.downloadModel();
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
    const results = await session.run(input, [
      'output_label',
      'output_probability',
    ]);
    console.log(results);
    const endTime = performance.now();
    this.formGroup.patchValue({
      label: Number(results['output_label'].data),
      probability: Number(results['output_probability'].data),
      time: endTime - startTime,
    });
  }

  private async downloadModel(): Promise<Blob> {
    const element = await this.dialogService.showLoading({
      message: 'Downloading model...',
    });
    try {
      const response = await fetch('/assets/models/iris.onnx');
      this.blob = await response.blob();
      return this.blob;
    } finally {
      await element.dismiss();
    }
  }
}
