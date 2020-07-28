import { TestBed } from '@angular/core/testing';
import { MapService } from './map.service';
import { HttpClientModule } from '@angular/common/http';

describe('MapServiceService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,]
    });
    service = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  // it('setCenter function to be called should be created', () => {
  //   service.g
  //   expect(service).toBeTruthy();
  // });

});
