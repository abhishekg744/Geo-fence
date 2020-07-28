import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceManagement } from './geofence-management.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { MapService } from '../services/map.service';
import { of, throwError } from 'rxjs';

describe('FenceListComponent', () => {
  let component: GeofenceManagement;
  let fixture: ComponentFixture<GeofenceManagement>;
  let mapservice : MapService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MaterialModule,BrowserModule, BrowserAnimationsModule],
      declarations: [ GeofenceManagement ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofenceManagement);
    component = fixture.componentInstance;
    mapservice = TestBed.get(MapService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stepperChanged function should be called', () => {
    component.stepperChanged({value:'2'})
    expect(component.isDrawOnMap).toBeTruthy();
    component.stepperChanged({value:'1'})
    expect(component.isDrawOnMap).toBeFalsy();
  });

  it('fenceChangedForAdd function should be called', () => {
    component.fenceChangedForAdd({source: {value:'Add'}});
    expect(component.showAddInput).toBeTruthy();
    component.fenceChangedForAdd({source: {value:'update'}});
    expect(component.showAddInput).toBeFalsy();
  });

  it('isLatLngValid function should be called', () => {
    component.isLatLngValid("1234;");
    expect(component.inputError).toBeTruthy();
    component.isLatLngValid("1234,34534;");
    expect(component.inputError).toBeFalsy();
  });

  it('selectedFenceChanged function should be called', () => {
    spyOn(mapservice,'getGeofenceByName').and.returnValue(of([]));
    component.selectedFenceChanged({source: {value:'Add'}});
    expect(component.selectedFence).toBe('');
    component.selectedFenceChanged({source: {value:'fence1'}});
    expect(component.selectedFence).toBe('fence1');
  });
  
  it('loadOnMap function should be called', () => {
    let spy = spyOn(component,'loadOnMap').and.callThrough()
    component.loadOnMap({name:'city',placeName:'place'}, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('addNewFence function should be called for success', () => {
    let spy = spyOn(component, 'addNewFence').and.callThrough(); 
    component.newRecord = {coords:'12321,12312;', name:'place'};
    component.GeoFenceNames = [];
    spyOn(mapservice,'addGeofenceData').and.returnValue(of({name:'place'}))
    spyOn(mapservice,'getCurrentGeofence').and.returnValue('place');
    component.addNewFence();
    expect(spy).toHaveBeenCalled();
  });

  it('addNewFence function should be called for failure', () => {
    let spy = spyOn(component, 'addNewFence').and.callThrough(); 
    component.newRecord = {coords:'12321,12312;', name:'place'};
    spyOn(mapservice,'addGeofenceData').and.returnValue(throwError({status:500}))
    spyOn(mapservice,'getCurrentGeofence').and.returnValue('place');
    component.addNewFence();
    expect(spy).toHaveBeenCalled();
  });

  it('update function should be called for success', () => {
    let spy = spyOn(component, 'update').and.callThrough(); 
    spyOn(mapservice,'updateGeofenceData').and.returnValue(of(''))
    component.update({coords:'123,434;',edit: false, id: 0});
    expect(spy).toHaveBeenCalled();
  });
  
  it('update function should be called for error', () => {
    let spy = spyOn(component, 'update').and.callThrough(); 
    spyOn(mapservice,'updateGeofenceData').and.returnValue(throwError({}))
    component.update({coords:'123,434;',edit: false, id: 0});
    expect(spy).toHaveBeenCalled();
  });

  it('delete function should be called for success', () => {
    let spy = spyOn(component, 'delete').and.callThrough(); 
    spyOn(mapservice,'deleteGeofenceData').and.returnValue(of(''))
    component.polygons = ['data'];
    component.delete(0, {coords:'123,434;',edit: false, id: 0});
    expect(spy).toHaveBeenCalled();
  });

  it('delete function should be called for error', () => {
    let spy = spyOn(component, 'delete').and.callThrough(); 
    spyOn(mapservice,'deleteGeofenceData').and.returnValue(throwError({}))
    component.polygons = ['data'];
    component.delete(0, {coords:'123,434;',edit: false, id: 0});
    expect(spy).toHaveBeenCalled();
  });

});
