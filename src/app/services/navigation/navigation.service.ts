import { inject, Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';

export type NavContext = 'navbar' | 'footer';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);

  getNavigationRoutes(type?: string): Route[] {
    const allRoutes = this.flattenRoutes(this.router.config);
    if (type === 'navbar') return allRoutes.filter(r => r.data?.['showInNavbar']);
    if (type === 'footer') return allRoutes.filter(r => r.data?.['showInFooter']);
    return allRoutes;
  }

  private flattenRoutes(routes: Route[]): Route[] {
    const visitedPaths = new Set<string | undefined>();
    return routes.flatMap(route => {
      if (visitedPaths.has(route.path)) return [];
      visitedPaths.add(route.path);
      return route.children ? [route, ...this.flattenRoutes(route.children)] : [route];
    });
  }
}
