import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { MapboxComponent } from './mapbox/mapbox.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },  
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'google-map',
    component: GoogleMapComponent
  },
  {
    path: 'mapbox',
    component: MapboxComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
