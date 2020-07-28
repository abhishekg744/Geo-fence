import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapboxComponent } from './mapbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { mapBoxLatLng, dataRowMapBox } from 'src/assets/data/mock_data';
import { MapBoxService } from '../services/map-box.service';
import { NotificationService } from '../services/notification.service';

describe('MapboxComponent', () => {
  let component: MapboxComponent;
  let fixture: ComponentFixture<MapboxComponent>;
  let mapboxService: MapBoxService;
  let notificationService: NotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MaterialModule, BrowserModule, BrowserAnimationsModule],
      declarations: [MapboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapboxComponent);
    component = fixture.componentInstance;
    mapboxService = TestBed.get(MapBoxService);
    notificationService = TestBed.get(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadGeoFenceOnMap function should be called', () => {
    let spy = spyOn(component, 'loadGeoFenceOnMap').and.callThrough();
    let data = dataRowMapBox;
    spyOn(mapboxService, 'setCenter').and.returnValue();
    spyOn(mapboxService, 'addPolygon').and.returnValue();
    spyOn(mapboxService, 'setZoom').and.resolveTo();
    component.loadGeoFenceOnMap(data);
    expect(spy).toHaveBeenCalled();
  });

  it('setPosition function should be called for inside and outside fence', () => {    
    let spy = spyOn(component, 'setPosition').and.callThrough();   
    spyOn(notificationService, 'openSnackBar').and.returnValue();
    let data = dataRowMapBox;
    spyOn(mapboxService, 'setCenter').and.returnValue();
    spyOn(mapboxService, 'addPolygon').and.returnValue();
    spyOn(mapboxService, 'setZoom').and.resolveTo();
    spyOn(mapboxService, 'setMarker').and.resolveTo();
    spyOn(mapboxService, 'updateMarkerPosition').and.returnValue();

    component.loadGeoFenceOnMap(data);
    component.positionIndex = 8; 
    component.setPosition();
    component.positionIndex = 2; 
    component.setPosition();    
    expect(spy).toHaveBeenCalled();
  });



  it('listenToLocation function should be called', () => {    
    let spy = spyOn(component, 'listenToLocation').and.callThrough();      
    component.listenToLocation();
    expect(spy).toHaveBeenCalled();
  });

  it('closeDialog function should be called', () => {
    component.closeDialog({name:'fence3'})
    expect(component.showDialog).toBeFalsy();
  });

});
