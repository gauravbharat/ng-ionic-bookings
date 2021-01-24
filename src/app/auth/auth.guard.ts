/** Created a CanLoad guard instead of a CanActivate because the lazy loaded module would be loaded on
 * CanActivate even if the user is not allowed to access it */
import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
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
    return this._authService.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          return this._authService.autoLogin();
        }

        return of(isAuthenticated);
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this._router.navigateByUrl('/auth');
        }
      })
    );
  }
}
