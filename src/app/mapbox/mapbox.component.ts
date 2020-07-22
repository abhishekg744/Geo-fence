import { Component, OnInit } from '@angular/core';
import { MapBoxService } from 'src/app/services/map-box.service';
import { isPointInPolygon } from 'geolib';
import { NotificationService } from '../services/notification.service';
import { MapConfig } from './mapbox-config';
import { MapService } from '../services/map.service';
import { positions } from 'src/assets/data/position_data';
import { CONSTANTS } from '../contants';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent implements OnInit {

  constructor(private mapBoxService: MapBoxService, private mapService: MapService,
    private notificationService: NotificationService) { }
  GeoFenceNames = ['fence1', 'fence2'];
  map
  polygons;
  showDialog = false;
  dialogData: any;
  mapPolygons = [];
  positions = positions;
  positionIndex = 0;
  intervalObject;
  isMarkerAdded = false;
  async ngOnInit() {
    sessionStorage.component = CONSTANTS.MAPBOX_COMPONENT;
    this.mapService.currentGeofencePolygonList.subscribe(data => {
      this.polygons = data;
    });

    this.mapBoxService.newCoorinates.subscribe(data => {
      this.confirmCoordinates(data);
    });    
    this.loadMap();
    this.mapService.setCurrentGeofenceList(
      [{ 'name': 'Sasken Building', 'placeName': 'sasken', 'coords': "77.63858714934412,12.954675760848616;77.63921966283107,12.954550194885982;77.63900882500275,12.953768259968001;77.63839973794074,12.953899533885362;77.63858714934412,12.954675760848616;" }]
    );

  }

  loadMap(coords = 0) {
    this.map = this.mapBoxService.getMapObject(MapConfig.MapCenter[0],MapConfig.MapCenter[1]);
    this.mapBoxService.setZoom(16);
    this.mapBoxService.addDrawingManager();
  }

  loadGeoFenceOnMap(data) {
    console.log(data);
    let convertedData = this.convertToMapPolygons(data);
    // this.coords.push({name: data.name, polygonCoords: convertedData, placeName: data.placeName});
  }

  convertToMapPolygons(polygon) {
    let polygonCoords = polygon.coords;
    let  mapPolygonsRow = polygon;
    mapPolygonsRow.polygonCoords = [];
    if (polygonCoords[polygonCoords.length - 1] == ';') {
      polygonCoords = polygonCoords.substring(0, polygonCoords.length - 1);
    }
    let latlngValues = polygonCoords.split(';');
    latlngValues = latlngValues.map((data) => {
      let row = data.split(',');
      mapPolygonsRow.polygonCoords.push({lat:parseFloat(row[1]), lng: parseFloat(row[0])});
      return [parseFloat(row[0]), parseFloat(row[1])];
    });
    console.log('v  - ', latlngValues);
    this.mapPolygons.push(mapPolygonsRow);
    console.log('M  - ', this.mapPolygons);
    this.mapBoxService.addPolygon(polygon.name.toString(), latlngValues);
    this.mapBoxService.setZoom(16);
  }

  confirmCoordinates(data) {
    if (data != "") {
      this.dialogData = {
        text: data,
        fenceData: this.GeoFenceNames
      }
      this.showDialog = true;
    }
  }

  closeDialog(result) {

    if (result != null && result != 'clear') {
      if (this.GeoFenceNames.indexOf(result.name) == -1) {
        this.GeoFenceNames.splice(0, 0, result.name);
      }
    }
    this.showDialog = false;
  }

  // change position of marker every second
  listenToLocation() {
    this.intervalObject = setInterval(() =>
       this.setPosition(), 1000
     );
   }
   
  // live marker positioning
  setPosition() {
    if (this.positionIndex <= this.positions.length - 1) {
      let position = this.positions[this.positionIndex];
      if(!this.isMarkerAdded) {
        this.mapBoxService.setMarker(position[1], position[0]);
        this.isMarkerAdded = true;
      } else {
        this.mapBoxService.updateMarkerPosition(position[1], position[0]);
      }
      this.positionIndex ++;
      let currentPosition = { 'lat': position[0], 'lng': position[1] };
      console.log('position', currentPosition);
      this.mapPolygons.forEach(polygon => {
        console.log('Inside '+ polygon.placeName,isPointInPolygon(currentPosition,polygon.polygonCoords));
        //let index = this.positionOcupiedPolygons.indexOf(polygon.placeName);
        if (isPointInPolygon(currentPosition, polygon.polygonCoords)) {
         // this.positionOcupiedPolygons.push(name);
          if(polygon.entered != true) {
            this.notificationService.openSnackBar("Entered inside " + polygon.placeName, 1);
            polygon.entered = true;
            polygon.left = false;
          }
        } else {         
          if (polygon.entered == true && polygon.left != true) {
            polygon.left = true;
            polygon.entered = false;
            this.notificationService.openSnackBar("Left " + polygon.placeName, 1);
          }
        }
      });
    }
    else{
      clearInterval(this.intervalObject);
      this.positionIndex = 0;
    }
  }

}
