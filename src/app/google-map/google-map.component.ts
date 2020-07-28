import { Component, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { isPointInPolygon } from 'geolib';
import { DrawingManager } from '@ngui/map';
import { MapConfig } from './google-map-config';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../services/notification.service';
import { LoaderService } from '../services/loader.service';
import { MapService } from '../services/map.service';
import { positions } from 'src/assets/data/position_data';
import { CONSTANTS } from '../contants';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {

  constructor(public dialog: MatDialog, private mapService: MapService,private ref: ChangeDetectorRef,
    private notificationService: NotificationService, private loaderService: LoaderService, private zone: NgZone) { }

  selectedOverlay: any;
  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  // if backend is not running, this is needed to enable dummy data,
  // once backend is in place this will anyhow gets replaced
  GeoFenceNames = ['fence1', 'fence2'];
  mapCenter ;
  drawOptions = {
    position: 2,
    drawingModes: MapConfig.Drawing_Manager.Modes,
  };
  polygonOptions = MapConfig.Drawing_Manager.polygonOptions;

  coords = [];
  positions = positions;
  positionIndex = 0;
  position: any ;
  map: google.maps.Map;
  dialogData:any;
  showDialog = false;
  enableDrawing = false;
  loading=false;
  positionOcupiedPolygons = [];
  intervalObject  ;

  autocomplete: any;
  address: any = {};
  center: any;
  //mapInput = new FormControl();
  searchOptions = [];

  ngOnInit(): void {
    this.mapService.setComponent(CONSTANTS.GOOGLEMAP_COMPONENT);
    let currentLocation = this.mapService.getCurrentLocation().then((data: any) => {
     // this.mapCenter = data.latitude.toString() + ',' + data.longitude.toString();
     this.mapCenter = MapConfig.Map_Center;
      console.log("CurrentLocation", data)
    });
    
    // listen to loader to enable/disable
    this.loaderService.loaderState.subscribe((res: any) => {
      this.loading = res;
    });

    this.mapService.getAllGeoFenceNames().subscribe((res: any) => {
      this.GeoFenceNames = res;
    }, err => {
      console.log("Error Response", err);
    });

    // if backend is not running, this is needed to enable dummy data,
    // once backend is in place this will anyhow gets replaced
    this.mapService.setCurrentGeofenceList(
      [{ 'name': '1', 'placeName': 'sasken', 'coords': "12.954612386058743,77.638535;12.954421568269561,77.63922432771683;12.953770695532927,77.63901511541367;12.953922304595407,77.63839552513123;" }]
    );
  }

  onMapReady(map) {
    this.map = map;
    console.log('map', map);
    this.initializeDrawingManager();
    //this.initializeMapSearch();
    this.addCustomRunIcon();
  }

  addCustomRunIcon() {
    var span = document.createElement('button');
    span.classList.add('material-icons', 'run-icon', 'custom-icon');
    span.textContent = 'directions_run'
    span.addEventListener('click', async () => {
      this.zone.run(() => {
        this.listenToLocation();
    });
    });
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(span);
  }

  initializeMapSearch() {
    var input = (document.getElementById('map-input') as HTMLInputElement);
    var autocomplete = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', this.map);
        autocomplete.setFields(
          ['address_components', 'geometry', 'icon', 'name']);
          autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            console.log(place);
          });
  }

  // delete polygon on map
  deleteOverlay() {
    if (this.selectedOverlay) {
      this.selectedOverlay.setMap(null);
      delete this.selectedOverlay;
    }
  }

  placeChanged(place) {
    this.center = place.geometry.location;
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }
    this.ref.detectChanges();
  }

  triggerDrawing(isDrawEnabled) {
    this.enableDrawing = isDrawEnabled;    
  }

  initializeDrawingManager() {
    this.drawingManager['initialized$'].subscribe(dm => {
      google.maps.event.addListener(dm, 'overlaycomplete',  event => {
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          dm.setDrawingMode(null);
          google.maps.event.addListener(event.overlay, 'click', e => {
            this.selectedOverlay = event.overlay;
            this.selectedOverlay.setEditable(true);
          });
          this.selectedOverlay = event.overlay;
          this.selectedOverlay.setEditable(true);
           this.confirmCoordinates(event.overlay.getPath().getArray())
        }
      });
    });
  }

  confirmCoordinates(data) {
    let text = '';
    data.forEach(item => {
      text += item.lat() + ',' + item.lng() + ';';
    });
    this.dialogData = {
      text: text,
      fenceData: this.GeoFenceNames
    }
    this.showDialog = true;    
  }

  // change position of marker every second
  listenToLocation() {
    this.intervalObject = setInterval(() =>
       this.setPosition(), 1000
     );
   }
   
  // live marker positioning
  setPosition() {
    this.positionIndex++;
    if (this.positionIndex <= this.positions.length - 1) {
      var pos = this.positions[this.positionIndex];
      this.position = { 'lat': pos[0], 'lng': pos[1] };
      console.log('position- positionIndex', this.position, this.positionIndex);
      this.coords.forEach(polygon => {
        console.log('Inside '+ polygon.placeName,isPointInPolygon(this.position,polygon.polygonCoords));
        //let index = this.positionOcupiedPolygons.indexOf(polygon.placeName);
        if (isPointInPolygon(this.position, polygon.polygonCoords)) {
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

  loadGeoFenceOnMap(data) {
    console.log(data);
    let convertedData = this.convertToMapPolygons(data.coords);  
    this.coords.push({name: data.name, polygonCoords: convertedData, placeName: data.placeName});
  }

  deleteGeoFence(index) {
    console.log(this.coords, index);
    this.coords = this.coords.splice((this.coords.findIndex(c => c.name == index), 1));
  }

  // converting string coords to map formate  
  convertToMapPolygons(latLngValues) {
    if (latLngValues[latLngValues.length - 1] == ';') {
      latLngValues = latLngValues.substring(0, latLngValues.length - 1);
    }
    let eachValue = latLngValues.split(';');
    this.mapCenter = eachValue[0].split(',');
    this.map.setCenter({ lat: parseFloat(this.mapCenter[0]), lng: parseFloat(this.mapCenter[1]) });
    let data = eachValue.map(value => {
      value = value.split(',');
      let modifiedValue = { lat: parseFloat(value[0]), lng: parseFloat(value[1]) };
      value = modifiedValue;
      return value;
    });   
    return data;
  }

  closeDialog(result) {

    if (result != null && result != 'clear') {
      if (this.GeoFenceNames.indexOf(result.name) == -1) {
        this.GeoFenceNames.splice(0, 0, result.name);
      }
    }
    if(this.selectedOverlay != undefined) {
      this.deleteOverlay(); 
    }
    this.showDialog = false;
  }

}
