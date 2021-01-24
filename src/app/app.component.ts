import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

/** Get rid of cordova plugins and use capacitor plugins */
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppState, Capacitor, Plugins } from '@capacitor/core';

import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub$: Subscription;
  private _previousAuthState = false;

  constructor(
    private platform: Platform,
    private _authService: AuthService,
    private _router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    this.authSub$ = this._authService.userIsAuthenticated.subscribe(
      (isAuth) => {
        if (!isAuth && this._previousAuthState !== isAuth) {
          this._router.navigateByUrl('/auth');
        }

        this._previousAuthState = isAuth;
      }
    );

    /** Check Auth State When App Resumes (from background?) */
    Plugins.App.addListener(
      'appStateChange',
      this.checkAuthOnResume.bind(this)
    );
  }

  ngOnDestroy() {
    this.authSub$?.unsubscribe();
  }

  onLogout(): void {
    this._authService.logout();
    // this._router.navigateByUrl('/auth');
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this._authService
        .autoLogin()
        .pipe(take(1))
        .subscribe((success) => {
          if (!success) {
            this.onLogout();
          }
        });
    }
  }
}
