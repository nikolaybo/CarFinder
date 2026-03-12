import { TestBed } from '@angular/core/testing';
import { provideRouter, CanActivateFn } from '@angular/router';
import { authGuard } from './guard.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
