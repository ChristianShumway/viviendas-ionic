import { TestBed } from '@angular/core/testing';

import { NoShowLoginGuard } from './no-show-login.guard';

describe('NoShowLoginGuard', () => {
  let guard: NoShowLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoShowLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
