import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IrisClassificationPage } from './iris-classification.page';

describe('IrisClassificationPage', () => {
  let component: IrisClassificationPage;
  let fixture: ComponentFixture<IrisClassificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IrisClassificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
