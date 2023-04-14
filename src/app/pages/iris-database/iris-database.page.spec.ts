import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IrisDatabasePage } from './iris-database.page';

describe('IrisDatabasePage', () => {
  let component: IrisDatabasePage;
  let fixture: ComponentFixture<IrisDatabasePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IrisDatabasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
