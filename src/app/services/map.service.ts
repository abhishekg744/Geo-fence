import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { URL } from 'src/assets/data/url';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  public currentGeofencePolygonList = new BehaviorSubject([]);
  private currentGeofence = '';
  coordsPattern =  /^[0-9.,-;]+$/; 
  component='';  

  setComponent(component){
    this.component=component;
  }

  getCurrentLocation() {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position.coords);
      });
    });
  }
  
  setCurrentGeofenceList(fenceList) {
    this.currentGeofencePolygonList.next(fenceList);
  }

  getCurrentGeofenceList() {
    return this.currentGeofencePolygonList.value;
  }

  setCurrentGeofence(fence) {
    this.currentGeofence = fence;
  }

  getCurrentGeofence() {
    return this.currentGeofence;
  }

  isLatLngValid(coords) {
    if(!this.coordsPattern.test(coords)) {
      return true;
    }
    if (coords != undefined && coords.length > 0) {
      let length = coords.length;
      if (coords[length - 1] == ";") {
        coords = coords.substring(0, (length - 1));
      }
      let valuesCount = (coords.split(';')).length;
      if (valuesCount == (coords.split(',')).length -1) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  getGeofenceByName(name){
      return this.http.get<any>(URL.getGeofenceByName.replace('component',this.component) + name);
  }

  getAllGeoFenceNames(){
    return this.http.get(URL.getAllGeoFenceNames.replace('component',this.component));
  }

  
  addGeofenceData(geofenceData) {
    geofenceData.mapType = this.component;
    return this.http.post(URL.addGeofenceData, geofenceData);
  }


  updateGeofenceData(geofenceData,id) {
    return this.http.put(URL.updateGeofenceData +id, {"coords":geofenceData});
  }

  deleteGeofenceData(id) {
    return this.http.delete(URL.deleteGeofenceData + id);
  }


}
