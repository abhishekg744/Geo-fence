import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceManagement } from './geofence-management.component';

describe('FenceListComponent', () => {
  let component: GeofenceManagement;
  let fixture: ComponentFixture<GeofenceManagement>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeofenceManagement ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofenceManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
