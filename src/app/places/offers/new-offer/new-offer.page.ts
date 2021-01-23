import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { base64toBlob } from 'src/app/shared/util';

import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit, OnDestroy {
  form: FormGroup;
  private _createPlaceSub: Subscription;

  constructor(
    private _placesService: PlacesService,
    private _router: Router,
    private _loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        // updateOn: 'blur', //update when control lose focus
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        // updateOn: 'blur', //update when control lose focus
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        // updateOn: 'blur', //update when control lose focus
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        // updateOn: 'blur', //update when control lose focus
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        // updateOn: 'blur', //update when control lose focus
        validators: [Validators.required],
      }),
      image: new FormControl(null),
    });
  }

  ngOnDestroy(): void {
    this._createPlaceSub?.unsubscribe();
  }

  onCreateOffer(): void {
    if (!this.form || !this.form.get('image').value) return;
    console.log('Creating offer...', this.form);

    console.log('image value', this.form.get('image').value);

    this._loadingController
      .create({
        message: 'Creating place...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this._createPlaceSub = this._placesService
          .addPlace(
            this.form.value.title,
            this.form.value.description,
            +this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo)
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this._router.navigate(['/places/tabs/offers']);
          });
      });
  }

  async onImagePicked(imageData: string | File) {
    let imageFile;

    if (typeof imageData === 'string') {
      try {
        imageFile = await base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }

    this.form.patchValue({
      image: imageFile,
    });
  }
}
