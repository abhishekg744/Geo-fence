import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { MaterialModule } from '../material.module';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
