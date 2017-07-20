
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdMenuModule, MdIconModule, MdButtonModule, MdSelectModule, MdCheckboxModule, MdCardModule, MdTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import 'hammerjs';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { StudyAreaComponent } from './study-area/study-area.component';
import { ClassifiedSeriesSectionComponent } from './classified-series-section/classified-series-section.component';
import { MapComponent } from './map/map.component';
import { HistogramComponent } from './histogram/histogram.component';
import { TimeSeriesComponent } from './time-series/time-series.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StudyAreaComponent,
    ClassifiedSeriesSectionComponent,
    MapComponent,
    HistogramComponent,
    TimeSeriesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdMenuModule, MdIconModule, MdButtonModule, MdSelectModule, MdCheckboxModule, MdCardModule, MdTooltipModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
