import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GoogleMapComponent } from './google-map/google-map.component';
import { NguiMapModule} from '@ngui/map';
import { MapboxComponent } from './mapbox/mapbox.component'; 
import { GeofenceManagement } from './geofence-management/geofence-management.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { AddGeofenceComponent } from './geofence-management/add-geofence/add-geofence.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GoogleMapComponent,  
    GeofenceManagement, AddGeofenceComponent, MapboxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=visualization,places,drawing'})
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
