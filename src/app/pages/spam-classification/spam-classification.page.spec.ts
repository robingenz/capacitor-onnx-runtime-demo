import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpamClassificationPage } from './spam-classification.page';

describe('SpamClassificationPage', () => {
  let component: SpamClassificationPage;
  let fixture: ComponentFixture<SpamClassificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SpamClassificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
