import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { LoaderService } from '../services/loader.service';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-geofence-management',
  templateUrl: './geofence-management.component.html',
  styleUrls: ['./geofence-management.component.scss']
})
export class GeofenceManagement implements OnInit {

  constructor(private mapService: MapService, private notificationService: NotificationService,
    private loaderService: LoaderService) { }
  @Input() GeoFenceNames;
  @Output() loadGeoFenceOnMap = new EventEmitter();
  @Output() deleteGeoFence = new EventEmitter();
  @Output() triggerDrawing = new EventEmitter();
  @Output() addGeoFence = new EventEmitter();

  polygons: any = [];
  newRecord: any = { name: '', coords: '' };
  selectedFence;
  isDrawOnMap = false;
  stepperValue = '1';
  showAddInput = false;
  inputError = false;

  ngOnInit(): void {
    this.mapService.currentGeofencePolygonList.subscribe(data => {
      this.polygons = data;
    });
  }

  stepperChanged(data) {
    console.log(data);
    if (data.value == '2') {
      this.isDrawOnMap = true;
    } else {
      this.isDrawOnMap = false;
    }
    this.triggerDrawing.emit(this.isDrawOnMap);
  }

  fenceChangedForAdd(event) {
    if (event.source.value === 'Add') {
      this.newRecord.name = '';
      this.showAddInput = true;
    } else {
      this.showAddInput = false;
      this.newRecord.name = event.source.value 
    }
  }

  isLatLngValid(coords) {
   this.inputError = this.mapService.isLatLngValid(coords);
  }

  selectedFenceChanged(event) {
    this.polygons.edit = false;
    if (event.source.value === 'Add') {
      this.selectedFence = '';
    } else {
      this.selectedFence = event.source.value;
      // get call by name
      this.mapService.getGeofenceByName(this.selectedFence).subscribe(res => {
        this.polygons = res;
        this.mapService.setCurrentGeofenceList(this.polygons);
      });
       
    }
    this.mapService.setCurrentGeofence(this.selectedFence);
  }

  loadOnMap(polygonData, tableindex) {
    polygonData.placeName = polygonData.name;
    polygonData.name = tableindex;
    this.loadGeoFenceOnMap.emit(polygonData);
  }

  addNewFence() {
    this.inputError= this.mapService.isLatLngValid(this.newRecord.coords);
    if(!this.inputError) {
      this.loaderService.show();
      this.mapService.addGeofenceData(this.newRecord).subscribe((res: any) => {
        this.GeoFenceNames.splice(0, 0, res.name);
        this.notificationService.openSnackBar('Geofence added', 1);
        console.log("Geofence added");
      },err => {
        this.notificationService.openSnackBar('Geofence not added', 0);
      }).add(() => {
        this.loaderService.hide();
      });
        let currentFence = this.mapService.getCurrentGeofence();
        let data:any = null;
        if (currentFence == this.newRecord.name) {
          data = this.mapService.getCurrentGeofenceList();
          data.push(this.newRecord);
        }
        this.addGeoFence.emit(data);
    } 
  }

  update(polygon){
    this.inputError= this.mapService.isLatLngValid(polygon.coords.toString());
    if(!this.inputError){
      this.loaderService.show();
      polygon.edit = !polygon.edit
      console.log("Polygon object",JSON.stringify(polygon));
      this.mapService.updateGeofenceData(polygon.coords.toString(),polygon.id).subscribe((res: any) => {
        this.notificationService.openSnackBar('Geofence updated', 1);
        console.log("Geofence updated");
      },err => {
        this.notificationService.openSnackBar('Geofence not updated', 0);
      }).add(() => {
        this.loaderService.hide();
      });
    }    
    // this.mapServiceService.updateFenceData()
  }

  delete(tableindex,polygon) {
    console.log("tableindex is ",tableindex);
    this.loaderService.show();
    this.mapService.deleteGeofenceData(polygon.id).subscribe((res: any) => {
      this.notificationService.openSnackBar('Geofence deleted',1);
      console.log("Geofence deleted");
    },err => {
      this.notificationService.openSnackBar('Geofence not deleted',0);
    }).add(() => {
      this.loaderService.hide();
    });
    this.polygons.splice(tableindex, 1);
    this.mapService.setCurrentGeofenceList(this.polygons);
    this.deleteGeoFence.emit(tableindex);
  }

}
