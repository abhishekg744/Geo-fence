import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapComponent } from './google-map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS } from '@angular/material/autocomplete';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { NotificationService } from '../services/notification.service';
import { setupGoogleMock, fenceNames, geoPlace, confirmCoordsData, latLng } from 'src/assets/data/mock_data';

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;
  let notificationService: NotificationService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MaterialModule,BrowserModule, BrowserAnimationsModule],
      declarations: [ GoogleMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    notificationService = TestBed.get(NotificationService);
    setupGoogleMock();
    component.GeoFenceNames = fenceNames;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onMapReady function should be called', () => {
   
    let spy = spyOn(component, 'onMapReady').and.callThrough();
    spyOn(component, 'initializeDrawingManager').and.returnValue();
    spyOn(component, 'addCustomRunIcon').and.returnValue();
    component.onMapReady({})
    expect(component).toBeTruthy();
  });

  it('closeDialog function should be called', () => {
   
    let spy = spyOn(component, 'deleteOverlay').and.callThrough();
    component.selectedOverlay = {
      setMap: function(data) {},
    };
    component.closeDialog({name:'fence3'})
    expect(spy).toHaveBeenCalled();
    expect(component.showDialog).toBeFalsy();
  });

  it('initializeMapSearch function should be called', () => {
    let spy = spyOn(component, 'initializeMapSearch').and.callThrough();
    component.initializeMapSearch();
    expect(spy).toHaveBeenCalled();
  });

  it('placeChanged function should be called', () => {
    let spy = spyOn(component, 'placeChanged').and.callThrough();
    component.placeChanged(geoPlace);
    expect(spy).toHaveBeenCalled();
  });

  it('triggerDrawing function should be called', () => {    
    component.triggerDrawing(true);
    expect(component.enableDrawing).toBeTrue();
  });

  it('confirmCoordinates function should be called', () => {
    component.confirmCoordinates(confirmCoordsData);
    expect(component.showDialog).toBeTrue();
  });

  it('listenToLocation function should be called', () => {    
    let spy = spyOn(component, 'listenToLocation').and.callThrough();      
    component.listenToLocation();
    expect(spy).toHaveBeenCalled();
  });

  it('loadGeoFenceOnMap function should be called', () => {    
    let spy = spyOn(component, 'loadGeoFenceOnMap').and.callThrough();   
   let data = {coords: latLng };   
   let letmapObj: any = {setCenter:(data:any)=>{}}
    component.map =letmapObj;
    component.loadGeoFenceOnMap(data);    
    expect(spy).toHaveBeenCalled();
  });

  it('setPosition function should be called for inside and outside fence', () => {    
    let spy = spyOn(component, 'setPosition').and.callThrough();   
    spyOn(notificationService, 'openSnackBar').and.returnValue();
    let data = {coords: latLng };   
   let letmapObj: any = {setCenter:(data:any)=>{}}
    component.map =letmapObj;
    component.loadGeoFenceOnMap(data); 
    component.positionIndex = 8; 
    component.setPosition();
    component.positionIndex = 2; 
    component.setPosition();    
    expect(spy).toHaveBeenCalled();
  });

  it('setPosition function should be called for clear interval', () => {    
    let spy = spyOn(component, 'setPosition').and.callThrough();    
    component.positions = [];
    component.positionIndex = 2; 
    component.setPosition();    
    expect(component.positionIndex).toBe(0);
  });

  it('deleteGeoFence function should be called', () => {    
    let spy = spyOn(component, 'deleteGeoFence').and.callThrough();    
    component.coords = []; 
    component.deleteGeoFence('1');    
    expect(spy).toHaveBeenCalled();
  });

});
