import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  constructor(
    private _placesService: PlacesService,
    private _navController: NavController,
    private _activatedRoute: ActivatedRoute
  ) {}
  place: Place;

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this._navController.navigateBack('/places/tabs/discover');
        return;
      }

      this.place = this._placesService.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace(): void {
    // this._router.navigateByUrl('/places/tabs/discover');
    // Use Nav Controller, which under the hood uses angular router
    // but displays a backward animation than default forward
    this._navController.navigateBack('/places/tabs/discover');
  }
}
