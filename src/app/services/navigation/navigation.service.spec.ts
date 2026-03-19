import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { NavigationService } from './navigation.service';

@Component({ template: '', standalone: true })
class StubComponent {}

const testRoutes: Routes = [
  { path: 'home',  component: StubComponent, data: { showInNavbar: true,  showInFooter: false } },
  { path: 'login', component: StubComponent, data: { showInNavbar: true,  showInFooter: false } },
  { path: 'about', component: StubComponent, data: { showInNavbar: false, showInFooter: true  } },
  { path: 'terms', component: StubComponent, data: { showInNavbar: false, showInFooter: true  } },
];

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(testRoutes)],
    });
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getNavigationRoutes() returns all routes', () => {
    expect(service.getNavigationRoutes().length).toBe(4);
  });

  it('getNavigationRoutes("navbar") returns only navbar routes', () => {
    const routes = service.getNavigationRoutes('navbar');
    expect(routes.length).toBe(2);
    routes.forEach(r => expect(r.data?.['showInNavbar']).toBeTrue());
  });

  it('getNavigationRoutes("footer") returns only footer routes', () => {
    const routes = service.getNavigationRoutes('footer');
    expect(routes.length).toBe(2);
    routes.forEach(r => expect(r.data?.['showInFooter']).toBeTrue());
  });

  it('getNavigationRoutes() deduplicates routes with the same path', () => {
    const routes = service.getNavigationRoutes();
    const paths = routes.map(r => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('getNavigationRoutes() with unknown type returns all routes', () => {
    const routes = service.getNavigationRoutes('unknown');
    expect(routes.length).toBe(4);
  });
});
