import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@app/services';
import { IonicModule } from '@ionic/angular';
import * as ort from 'onnxruntime-web';

@Component({
  selector: 'app-spam-dataset',
  templateUrl: './spam-dataset.page.html',
  styleUrls: ['./spam-dataset.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class SpamDatasetPage {
  public formGroup = new FormGroup({
    text: new FormControl('URGENT, you have won, please click this link'),
    spam: new FormControl<number | undefined>(undefined),
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
      const response = await fetch('/assets/models/spam.onnx');
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
      spam: Number(results['output_label'].data),
      time: endTime - startTime,
    });
  }
}
