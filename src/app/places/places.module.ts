import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacesPageRoutingModule } from './places-routing.module';

import { PlacesPage } from './places.page';
import { ImagePickerComponent } from '../shared/pickers/image-picker/image-picker.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlacesPageRoutingModule],
  declarations: [PlacesPage],
})
export class PlacesPageModule {}
