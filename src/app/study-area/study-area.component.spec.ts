import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyAreaComponent } from './study-area.component';

describe('StudyAreaComponent', () => {
  let component: StudyAreaComponent;
  let fixture: ComponentFixture<StudyAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
