import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

export interface AuthResponseData {
  idToken: string; //A Firebase Auth ID token for the newly created user.
  email: string; //The email for the newly created user.
  refreshToken: string; //A Firebase Auth refresh token for the newly created user.
  expiresIn: string; //The number of seconds in which the ID token expires.
  localId: string; //The uid of the newly created user.
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userIsAuthenticated = false; //temp set to true
  private _userId = null;

  constructor(private _http: HttpClient) {}

  get userId(): string {
    return this._userId;
  }

  get userIsAuthenticated(): boolean {
    return this._userIsAuthenticated;
  }

  signup(email: string, password: string) {
    return this._http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      { email, password, returnSecureToken: true }
    );
  }

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
