import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

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
    private _loadingController: LoadingController
  ) {}

  ngOnInit() {}

  get isLogin(): boolean {
    return this._isLogin;
  }

  onLogin(): void {
    this.isLoading = true;
    this._authService.login();
    /** Create loading controller overlay */
    this._loadingController
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then((loadingEl) => {
        loadingEl.present();
        setTimeout(() => {
          this._router.navigateByUrl('/places/tabs/discover');
          loadingEl.dismiss();
          this.isLoading = false;
        }, 2000);
      });
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    console.log('email', email, 'password', password);

    if (this.isLogin) {
      // Send a request to login servers
    } else {
      // Send a request to signup servers
    }
  }

  OnSwitchAuthMode() {
    this._isLogin = !this._isLogin;
  }
}
