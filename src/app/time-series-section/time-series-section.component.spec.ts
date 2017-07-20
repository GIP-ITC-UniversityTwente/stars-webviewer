import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSeriesSectionComponent } from './time-series-section.component';

describe('TimeSeriesSectionComponent', () => {
  let component: TimeSeriesSectionComponent;
  let fixture: ComponentFixture<TimeSeriesSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSeriesSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSeriesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
