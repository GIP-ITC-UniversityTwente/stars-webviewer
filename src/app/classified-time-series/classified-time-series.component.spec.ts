import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifiedTimeSeriesComponent } from './classified-time-series.component';

describe('ClassifiedTimeSeriesComponent', () => {
  let component: ClassifiedTimeSeriesComponent;
  let fixture: ComponentFixture<ClassifiedTimeSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifiedTimeSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifiedTimeSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
