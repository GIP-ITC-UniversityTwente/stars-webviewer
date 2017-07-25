import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { MapComponent } from './map.component';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let userSelectionServiceStub;

  beforeEach(async(() => {

    userSelectionServiceStub = {};

    TestBed.configureTestingModule({
      imports: [HttpModule],
      declarations: [ MapComponent ],
      providers: [
        { provide: UserSelectionService, useValue: userSelectionServiceStub }, // stub of service
        StarsAPIService // actual service
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();



  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
