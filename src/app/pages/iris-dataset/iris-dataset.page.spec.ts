import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IrisDatasetPage } from './iris-dataset.page';

describe('IrisDatasetPage', () => {
  let component: IrisDatasetPage;
  let fixture: ComponentFixture<IrisDatasetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IrisDatasetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
