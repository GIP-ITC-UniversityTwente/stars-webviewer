import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule, MatIconModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatCardModule, MatTooltipModule } from '@angular/material';

import { TimeSeriesComponent } from './time-series.component';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';

describe('TimeSeriesComponent', () => {
  let component: TimeSeriesComponent;
  let fixture: ComponentFixture<TimeSeriesComponent>;
  let userSelectionServiceStub;

  beforeEach(async(() => {

    userSelectionServiceStub = {};

    TestBed.configureTestingModule({
      imports: [ BrowserModule, FormsModule, HttpModule, BrowserAnimationsModule, MatMenuModule, MatIconModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatCardModule, MatTooltipModule],
      declarations: [ TimeSeriesComponent ],
      providers: [
        { provide: UserSelectionService, useValue: userSelectionServiceStub }, // stub of service
        StarsAPIService // actual service
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
