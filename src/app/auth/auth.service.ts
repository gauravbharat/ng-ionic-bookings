import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string; //A Firebase Auth ID token for the newly created user.
  email: string; //The email for the newly created user.
  refreshToken: string; //A Firebase Auth refresh token for the newly created user.
  expiresIn: string; //The number of seconds in which the ID token expires.
  localId: string; //The uid of the newly created user.
  registered?: boolean; //Whether the email is for an existing account
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private _activeLogoutTimer: any;

  constructor(private _http: HttpClient) {}

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        }

        return null;
      })
    );
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        }

        return false;
      })
    );
  }

  autoLogin() {
    //'from' returns a promise observable
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map((storedData: any) => {
        if (!storedData || !storedData?.value) {
          return null;
        }

        console.log('storedData', storedData);

        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          token: string;
          tokenExpirationDate: string;
          email: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );

        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  signup(email: string, password: string) {
    return this._http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap((userData) => {
          this._setUserData(userData);
        })
      );
  }

  login(email: string, password: string) {
    return this._http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap((userData) => {
          this._setUserData(userData);
        })
      );
  }

  private _setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );

    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );

    this._user.next(user);
    this.autoLogout(user.tokenDuration);

    this._storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }

  private _storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const value = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
      email,
    });

    Plugins.Storage.set({ key: 'authData', value });
  }

  logout() {
    if (this._activeLogoutTimer) {
      clearTimeout(this._activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }

  private autoLogout(duration: number) {
    if (this._activeLogoutTimer) {
      clearTimeout(this._activeLogoutTimer);
    }

    this._activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  ngOnDestroy() {
    if (this._activeLogoutTimer) {
      clearTimeout(this._activeLogoutTimer);
    }
  }
}
