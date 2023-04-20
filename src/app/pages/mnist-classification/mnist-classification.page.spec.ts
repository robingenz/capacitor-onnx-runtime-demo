import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MnistClassificationPage } from './mnist-classification.page';

describe('MnistClassificationPage', () => {
  let component: MnistClassificationPage;
  let fixture: ComponentFixture<MnistClassificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MnistClassificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
