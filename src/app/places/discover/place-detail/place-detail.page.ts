import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  constructor(private _router: Router, private _navController: NavController) {}

  ngOnInit() {}

  onBookPlace(): void {
    // this._router.navigateByUrl('/places/tabs/discover');
    // Use Nav Controller, which under the hood uses angular router
    // but displays a backward animation than default forward
    this._navController.navigateBack('/places/tabs/discover');
  }
}
