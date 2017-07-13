import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCharacteristicSectionComponent } from './image-characteristic-section.component';

describe('ImageCharacteristicSectionComponent', () => {
  let component: ImageCharacteristicSectionComponent;
  let fixture: ComponentFixture<ImageCharacteristicSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCharacteristicSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCharacteristicSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
