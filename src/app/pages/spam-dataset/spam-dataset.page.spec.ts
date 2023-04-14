import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpamDatasetPage } from './spam-dataset.page';

describe('SpamDatasetPage', () => {
  let component: SpamDatasetPage;
  let fixture: ComponentFixture<SpamDatasetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SpamDatasetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
