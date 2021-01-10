/** Created a CanLoad guard instead of a CanActivate because the lazy loaded module would be loaded on
 * CanActivate even if the user is not allowed to access it */
import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private _authService: AuthService, private _router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this._authService.userIsAuthenticated) {
      this._router.navigateByUrl('/auth');
    }

    return this._authService.userIsAuthenticated;
  }
}
