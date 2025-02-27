import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  router: Router;

  constructor(router: Router) {
    this.router = router;
   }

  getNavigationRoutes(type?: string): Route[] {
    let availableRoutes: Route[] = this.flattenRoutes(this.router.config);
    switch (type) {
      case "navbar":
        availableRoutes = availableRoutes.filter(route => route.data?.["showInNavbar"]);
        break;
      case "footer":
        availableRoutes = availableRoutes.filter(route => route.data?.["showInFooter"]);
        break;
    }
    return availableRoutes;
  }

  private flattenRoutes(routes: Route[]): Route[] {
    const seen = new Set(); // Track unique routes
    return routes.flatMap(route => {
      if (seen.has(route.path)) return []; // Avoid duplicates
      seen.add(route.path);
      return route.children ? [route, ...this.flattenRoutes(route.children)] : [route];
    });
  }
}
