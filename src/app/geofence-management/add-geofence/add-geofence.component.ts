import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-add-geofence',
  templateUrl: './add-geofence.component.html',
  styleUrls: ['./add-geofence.component.scss'],
  
})
export class AddGeofenceComponent implements OnInit {

  isAddFence = false;
  newRecord: any = { name: '', coords: '' };
  constructor(private mapService: MapService, private loaderService: LoaderService,private notificationService: NotificationService
    ) {
  }
  @Input() data;
  @Output() closeDialog = new EventEmitter();
    
  ngOnInit() {
    this.newRecord.coords = this.data.text;
  }

  selectedFenceChanged(event) {
    if (event.source.value === 'Add') {
      this.newRecord.name = '';
      this.isAddFence = true;
    } else {
      this.isAddFence = false;
      this.newRecord.name = event.source.value;      
    }
  }

  addNewFence() {
    this.loaderService.show();
    this.mapService.addGeofenceData(this.newRecord).subscribe((res: any) => {
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
      this.mapService.setCurrentGeofenceList(data);
    }
    this.close(this.newRecord);
  }

  
  close(data = null) {
    this.closeDialog.emit(data);
  }
}
