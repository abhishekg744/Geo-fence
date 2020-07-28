import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGeofenceComponent } from './add-geofence.component';
import { MapService } from 'src/app/services/map.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification.service';
import { of, throwError } from 'rxjs';

describe('AddCoordsComponent', () => {
  let component: AddGeofenceComponent;
  let fixture: ComponentFixture<AddGeofenceComponent>;
  let mapservice: MapService;
  let notificationService: NotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MaterialModule,BrowserModule, BrowserAnimationsModule],
      declarations: [ AddGeofenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGeofenceComponent);
    component = fixture.componentInstance;
    mapservice = TestBed.get(MapService);
    notificationService = TestBed.get(NotificationService);
    component.data ={
      text: "1231231231231,123213;"
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selectedFenceChanged function to be called', () => {
    component.selectedFenceChanged({source: {value: 'Add'}});
    expect(component.isAddFence).toBe(true);
    component.selectedFenceChanged({source: {value: 'update'}});
    expect(component.isAddFence).toBe(false);
  });

  it('addNewFence function to be called with success', () => {
    spyOn(mapservice, 'addGeofenceData').and.returnValue(of(''));
    spyOn(notificationService, 'openSnackBar').and.returnValue();
    let spy = spyOn(component, 'close').and.callThrough();
    component.addNewFence();
    expect(spy).toHaveBeenCalled();
  });

  it('addNewFence function to be called with error', () => {
    spyOn(mapservice, 'addGeofenceData').and.returnValue(throwError({status:500}));
    spyOn(notificationService, 'openSnackBar').and.returnValue();
    let spy = spyOn(component, 'close').and.callThrough();
    component.addNewFence();
    expect(spy).toHaveBeenCalled();
  });
  
});
