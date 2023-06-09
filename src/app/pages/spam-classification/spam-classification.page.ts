import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@app/services';
import { IonicModule } from '@ionic/angular';
import * as ort from 'onnxruntime-web';

@Component({
  selector: 'app-spam-classification',
  templateUrl: './spam-classification.page.html',
  styleUrls: ['./spam-classification.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class SpamClassificationPage {
  public formGroup = new FormGroup({
    text: new FormControl('URGENT, you have won, please click this link'),
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
    const text = this.formGroup.get('text')?.value;
    if (!text) {
      return;
    }
    const startTime = performance.now();
    const arrayBuffer = await blob.arrayBuffer();
    const session = await ort.InferenceSession.create(arrayBuffer);
    const data = [text];
    const tensor = new ort.Tensor('string', data, [1, 1]);
    const input = {
      string_input: tensor,
    };
    const results = await session.run(input, ['output_label']);
    const endTime = performance.now();
    this.formGroup.patchValue({
      label: Number(results['output_label'].data),
      time: endTime - startTime,
    });
  }

  private async downloadModel(): Promise<Blob> {
    const element = await this.dialogService.showLoading({
      message: 'Downloading model...',
    });
    try {
      const response = await fetch('/assets/models/spam.onnx');
      this.blob = await response.blob();
      return this.blob;
    } finally {
      await element.dismiss();
    }
  }
}
