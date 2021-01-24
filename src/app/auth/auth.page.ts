import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  private _isLogin = true;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _loadingController: LoadingController,
    private _alertController: AlertController
  ) {}

  ngOnInit() {}

  get isLogin(): boolean {
    return this._isLogin;
  }

  private _authenticate(email: string, password: string): void {
    this.isLoading = true;
    this._authService.login();
    /** Create loading controller overlay */
    this._loadingController
      .create({
        keyboardClose: true,
        message: this.isLogin ? 'Logging in...' : 'Signing up...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        if (this.isLogin) {
        } else {
          // Send a request to signup servers
          this._authService.signup(email, password).subscribe(
            (response: AuthResponseData) => {
              this.isLoading = false;
              loadingEl.dismiss();
              this._router.navigateByUrl('/places/tabs/discover');
            },
            (errRes) => {
              const code = errRes.error.error.message;
              let message = 'Could not sign you up, please try again.';

              if (code === 'EMAIL_EXISTS') {
                message = 'This email address exists already!';
              }

              this.isLoading = false;
              loadingEl.dismiss();
              this._showAlert(message);
            }
          );
        }
      });
  }

  private _showAlert(message: string) {
    this._alertController
      .create({
        header: 'Authentication failed',
        message,
        buttons: [{ text: 'Close', role: 'cancel' }],
      })
      .then((alertEl) => alertEl.present());
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    console.log('email', email, 'password', password);

    this._authenticate(email, password);
  }

  OnSwitchAuthMode() {
    this._isLogin = !this._isLogin;
  }
}
