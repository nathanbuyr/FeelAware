import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoodDeciderPage } from './mood-decider.page';

describe('MoodDeciderPage', () => {
  let component: MoodDeciderPage;
  let fixture: ComponentFixture<MoodDeciderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodDeciderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
