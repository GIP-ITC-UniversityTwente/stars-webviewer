import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule, MatIconModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatCardModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import 'hammerjs';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { StudyAreaComponent } from './study-area/study-area.component';
import { MapComponent } from './map/map.component';
import { HistogramComponent } from './histogram/histogram.component';
import { TimeSeriesComponent } from './time-series/time-series.component';
import { ClassifiedTimeSeriesComponent } from './classified-time-series/classified-time-series.component';
import { AuthService } from './services/auth.service';
import { CallbackComponent } from './callback/callback.component';
import { HomeComponent } from './home/home.component';
import { ROUTES } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StudyAreaComponent,
    MapComponent,
    HistogramComponent,
    TimeSeriesComponent,
    ClassifiedTimeSeriesComponent,
    CallbackComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatMenuModule, MatIconModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatCardModule, MatTooltipModule,
    FlexLayoutModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
