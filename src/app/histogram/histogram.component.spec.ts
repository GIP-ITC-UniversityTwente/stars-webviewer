import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule, MatIconModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatCardModule, MatTooltipModule } from '@angular/material';


import { HistogramComponent } from './histogram.component';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';


describe('HistogramComponent', () => {
  let component: HistogramComponent;
  let fixture: ComponentFixture<HistogramComponent>;
  let userSelectionServiceStub;
  let starsAPIServiceStub;

  beforeEach(async(() => {

    userSelectionServiceStub = {};
    starsAPIServiceStub = {};

    TestBed.configureTestingModule({
      imports: [ BrowserModule, FormsModule, HttpModule, BrowserAnimationsModule, MatMenuModule, MatIconModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatCardModule, MatTooltipModule ],
      declarations: [ HistogramComponent ],
      providers: [
        { provide: UserSelectionService, useValue: userSelectionServiceStub }, // stub of service
        { provide: StarsAPIService, useValue: starsAPIServiceStub } //StarsAPIService // actual service
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
