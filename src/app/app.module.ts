
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
import { ImageCharacteristicSectionComponent } from './image-characteristic-section/image-characteristic-section.component';
import { FieldCharacteristicSectionComponent } from './field-characteristic-section/field-characteristic-section.component';
import { ClassifiedSeriesSectionComponent } from './classified-series-section/classified-series-section.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StudyAreaComponent,
    ImageCharacteristicSectionComponent,
    FieldCharacteristicSectionComponent,
    ClassifiedSeriesSectionComponent,
    MapComponent
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
