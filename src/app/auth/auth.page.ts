import { Component, OnInit } from '@angular/core';
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
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _loadingController: LoadingController
  ) {}

  ngOnInit() {}

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
}
