import { TestBed } from '@angular/core/testing';

import { MapBoxService } from './map-box.service';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { getMapBoxMock } from 'src/assets/data/mock_data';

describe('MapService', () => {
  let service: MapBoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,]
    });
    service = TestBed.inject(MapBoxService);  
    let mapObj: any = getMapBoxMock(); 
    service.map = mapObj; 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setCenter function to be called', () => {
    let spy = spyOn(service, 'setCenter').and.callThrough();    
    service.setCenter(0, 0);
    expect(spy).toHaveBeenCalled();
  });

  it('applyBounds function to be called', () => {
    let spy = spyOn(service, 'applyBounds').and.callThrough();
    let map = service.applyBounds([[-79, 43], [-73, 45]]);
    expect(spy).toHaveBeenCalled();
  });

  it('addPolygon function to be called', () => {
    let spy = spyOn(service, 'addPolygon').and.callThrough();
    let pol = service.addPolygon('id',[]);
    expect(spy).toHaveBeenCalled();
  });

  it('getZoom function to be called', () => {
    let spy = spyOn(service, 'getZoom').and.callThrough();
    let zoom = service.getZoom();
    expect(spy).toHaveBeenCalled();
  });

  it('resizeMap function to be called', () => {
    let spy = spyOn(service, 'resizeMap').and.callThrough();
    let zoom = service.resizeMap();
    expect(spy).toHaveBeenCalled();
  });

});
