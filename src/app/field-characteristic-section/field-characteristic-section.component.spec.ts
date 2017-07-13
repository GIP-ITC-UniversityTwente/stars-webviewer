import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldCharacteristicSectionComponent } from './field-characteristic-section.component';

describe('FieldCharacteristicSectionComponent', () => {
  let component: FieldCharacteristicSectionComponent;
  let fixture: ComponentFixture<FieldCharacteristicSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldCharacteristicSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldCharacteristicSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
