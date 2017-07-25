import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdMenuModule, MdIconModule, MdButtonModule, MdSelectModule, MdCheckboxModule, MdCardModule, MdTooltipModule } from '@angular/material';

import { StudyAreaComponent } from './study-area.component';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';

describe('StudyAreaComponent', () => {
  let component: StudyAreaComponent;
  let fixture: ComponentFixture<StudyAreaComponent>;
  let userSelectionServiceStub;

  beforeEach(async(() => {

    userSelectionServiceStub = {};

    TestBed.configureTestingModule({
      imports: [ BrowserModule, FormsModule, HttpModule, BrowserAnimationsModule, MdMenuModule, MdIconModule, MdButtonModule, MdSelectModule, MdCheckboxModule, MdCardModule, MdTooltipModule ],
      declarations: [ StudyAreaComponent ],
      providers: [
        { provide: UserSelectionService, useValue: userSelectionServiceStub }, // stub of service
        StarsAPIService // actual service
      ]
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

  it('stub object and injected UserSelectionService should not be the same', () => {
    expect(UserSelectionService === userSelectionServiceStub).toBe(false);
  });

});
