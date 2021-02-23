import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WigetComponent } from './wiget/wiget.component';
import { CitiesComponent } from './cities/cities.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StorigeService } from './storige.service';
import { StorageServiceModule } from 'ngx-webstorage-service';

@NgModule({
  declarations: [AppComponent, WigetComponent, CitiesComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, StorageServiceModule],
  providers: [StorigeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
