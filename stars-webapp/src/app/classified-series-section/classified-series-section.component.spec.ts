import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifiedSeriesSectionComponent } from './classified-series-section.component';

describe('ClassifiedSeriesSectionComponent', () => {
  let component: ClassifiedSeriesSectionComponent;
  let fixture: ComponentFixture<ClassifiedSeriesSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifiedSeriesSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifiedSeriesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
