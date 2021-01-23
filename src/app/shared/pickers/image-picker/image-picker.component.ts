import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType,
} from '@capacitor/core';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  isLoading = false;
  selectedImage: string;
  usePicker = false;

  @Output() imagePick = new EventEmitter<string | File>();
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;

  constructor(
    private _alertController: AlertController,
    private platform: Platform
  ) {}

  ngOnInit() {
    console.log('Mobile', this.platform.is('mobile'));
    console.log('Hybrid', this.platform.is('hybrid'));
    console.log('iOS', this.platform.is('ios'));
    console.log('Android', this.platform.is('android'));
    console.log('Desktop', this.platform.is('desktop'));

    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }
  }

  async onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
      this.filePicker.nativeElement.click();
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

  onFileChosen($event: Event) {
    const pickedFile = (<HTMLInputElement>$event.target).files[0];

    if (!pickedFile) {
      return;
    }

    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}
