import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@app/services';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { IonicModule } from '@ionic/angular';
import * as ort from 'onnxruntime-web';

@Component({
  selector: 'app-mnist-classification',
  templateUrl: './mnist-classification.page.html',
  styleUrls: ['./mnist-classification.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class MnistClassificationPage implements OnInit {
  public formGroup = new FormGroup({
    imgAsBase64: new FormControl<string | undefined>(undefined),
    label: new FormControl<number | undefined>(undefined),
    time: new FormControl<number | undefined>(undefined),
  });
  public blob: Blob | undefined;

  constructor(private readonly dialogService: DialogService) {}

  public ngOnInit(): void {
    this.downloadImageAsBase64().then((imgAsBase64) => {
      this.formGroup.patchValue({
        imgAsBase64,
      });
    });
  }

  public async pickImage(): Promise<void> {
    const { files } = await FilePicker.pickFiles({
      readData: true,
      types: ['image/png'],
    });
    const firstFile = files[0];
    if (!firstFile) {
      return;
    }
    this.formGroup.patchValue({
      imgAsBase64: `data:image/png;base64,${firstFile.data}`,
    });
  }

  public async runInference(): Promise<void> {
    let blob = this.blob;
    if (!blob) {
      blob = await this.downloadModel();
    }
    const imgAsBase64 = this.formGroup.get('imgAsBase64')?.value;
    if (!imgAsBase64) {
      return;
    }
    const startTime = performance.now();
    const arrayBuffer = await blob.arrayBuffer();
    const session = await ort.InferenceSession.create(arrayBuffer);
    const data = await this.convertImgToNumberArray(imgAsBase64);
    const tensor = new ort.Tensor('float32', data, [1, 28, 28]);
    const input = {
      flatten_input: tensor,
    };
    const results = await session.run(input, ['dense_1']);
    const resultData = results['dense_1'].data as Float32Array;
    const endTime = performance.now();
    this.formGroup.patchValue({
      label: Number(resultData.indexOf(Math.max(...resultData))),
      time: endTime - startTime,
    });
  }

  private async downloadImageAsBase64(): Promise<string> {
    const response = await fetch('/assets/mnist/8.png');
    const blob = await response.blob();
    return this.convertBlobToBase64(blob);
  }

  private async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  private async downloadModel(): Promise<Blob> {
    const element = await this.dialogService.showLoading({
      message: 'Downloading model...',
    });
    try {
      const response = await fetch('/assets/models/mnist.onnx');
      this.blob = await response.blob();
      return this.blob;
    } finally {
      await element.dismiss();
    }
  }

  private convertImgToNumberArray(imgAsBase64: string): Promise<number[]> {
    const image = new Image();
    image.src = imgAsBase64;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get context');
    }
    return new Promise((resolve) => {
      image.onload = function () {
        canvas.width = 28;
        canvas.height = 28;
        context.drawImage(image, 0, 0, 28, 28);
        const imageData = context.getImageData(0, 0, 28, 28);
        const dataArray: number[] = [];
        for (let i = 0; i < imageData.data.length; i += 4) {
          const gray =
            (imageData.data[i] +
              imageData.data[i + 1] +
              imageData.data[i + 2]) /
            3;
          dataArray.push(gray);
        }
        resolve(dataArray);
      };
    });
  }
}
