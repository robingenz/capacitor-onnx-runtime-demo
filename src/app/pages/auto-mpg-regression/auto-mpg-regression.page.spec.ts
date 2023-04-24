import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoMpgRegressionPage } from './auto-mpg-regression.page';

describe('AutoMpgRegressionPage', () => {
  let component: AutoMpgRegressionPage;
  let fixture: ComponentFixture<AutoMpgRegressionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AutoMpgRegressionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
