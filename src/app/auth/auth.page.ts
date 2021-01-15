import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit() {}

  onLogin(): void {
    this.isLoading = true;
    this._authService.login();
    setTimeout(() => {
      this._router.navigateByUrl('/places/tabs/discover');
      this.isLoading = false;
    }, 2000);
  }
}
