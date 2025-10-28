import { TestBed } from '@angular/core/testing';

import { RestaurantOwnerService } from './restaurant-owner.service';

describe('RestaurantOwnerService', () => {
  let service: RestaurantOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantOwnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
