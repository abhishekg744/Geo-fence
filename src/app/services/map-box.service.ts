import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { environment } from 'src/environments/environment';
import { MapConfig } from '../mapbox/mapbox-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapBoxService {

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/satellite-v9';
  lat;
  lng;
  markers = [];
  newCoorinates = new BehaviorSubject('');
  draw;

  constructor() { }

  getMapObject(longitude = 0, latitude = 0) {
    if (this.map === undefined) {
      (mapboxgl as any).accessToken = environment.mapToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 11,
        center: [longitude, latitude]
      });
      // Add map controls
      // this.map.addControl(new mapboxgl.NavigationControl());
     // this.map = this.setMarker(longitude, latitude);
    }
    this.map.on('load', () => {
    console.log('mapLoaded');
    });
    return this.map;
  }

  addDrawingManager() {
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: MapConfig.DrawingManager.Controls,    
    });
    this.map.addControl(this.draw);
    this.map.on('draw.create', (event) => this.updateArea(event));
    // this.map.on('draw.delete', this.updateArea);
    // this.map.on('draw.update', this.updateArea);
  }

  updateArea(event) {
    let coordinates = event.features[0].geometry.coordinates[0].join(';');
    console.log(event.features[0].geometry.coordinates[0].join(';'));
    this.newCoorinates.next(coordinates);
    this.draw.deleteAll();
  }

  setCenter(longitude, latitude) {
    this.map.setCenter([longitude, latitude]);
  }

  setMarker(longitude, latitude) {
    var marker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(this.map);
    this.markers.push(marker);
    return this.map;
  }

  updateMarkerPosition(longitude, latitude) {
    this.markers[0].setLngLat([longitude, latitude])
  }

  applyBounds(bounds) {
    var bbox = [[-79, 43], [-73, 45]];
    this.map.fitBounds(bounds, {
      padding: { top: 10, bottom: 25, left: 15, right: 5 }
    });
    return this.map;
  }


  addPolygon(id, coords) {
   
      this.map.addSource(id, {
        'type': 'geojson',
        'data': {
          'properties': {},
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              coords
            ]
          }
        }
      });
      this.map.addLayer({
        'id': id,
        'type': 'fill',
        'source': id,
        'layout': {},
        'paint': {
          'fill-color': MapConfig.CustomDrawing.polygon.color,
          'fill-opacity': MapConfig.CustomDrawing.polygon.opacity
        }
      });

  }

  getZoom() {
    return this.map.getZoom();
  }

  setZoom(factor) {
    this.map.setZoom(factor);
    return this.map;
  }

  removeAllMarkers() {
    this.markers.forEach((marker: mapboxgl.Marker) => {
      marker.remove();
    });
  }

  resizeMap() {
    setTimeout(() => {
      this.map.resize();
    }, 1000);
  }

}
