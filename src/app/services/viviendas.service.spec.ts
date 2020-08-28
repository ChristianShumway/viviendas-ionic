import { TestBed } from '@angular/core/testing';

import { ViviendasService } from './viviendas.service';

describe('ViviendasService', () => {
  let service: ViviendasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViviendasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
