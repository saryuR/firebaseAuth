import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingProvider {
  loading;
  constructor(private toastCtrl: ToastController, public loadingController: LoadingController) {
    console.log('Hello LoadingProvider Provider');
  }

  show() {
    if (!this.loading) {
      this.loading = this.loadingController.create({
        spinner: 'hide',
        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"><div class="loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div></div>
        </div>`,
      });
      this.loading.present();
    }
  }

  //Hide loading
  hide() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
  

}
