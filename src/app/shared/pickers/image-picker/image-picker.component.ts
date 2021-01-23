import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType,
} from '@capacitor/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  isLoading = false;
  selectedImage: string;

  @Output() imagePick = new EventEmitter<string>();

  constructor(private _alertController: AlertController) {}

  ngOnInit() {}

  async onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    try {
      const image = await Plugins.Camera.getPhoto({
        quality: 50,
        source: CameraSource.Prompt,
        correctOrientation: true,
        // height: 320,
        width: 300,
        resultType: CameraResultType.DataUrl,
      });

      this.selectedImage = image.dataUrl;
      this.imagePick.emit(image.dataUrl);
    } catch (error) {
      console.log(error, 'error on image capture');
    }
  }
}
