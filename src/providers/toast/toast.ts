import { Injectable } from '@angular/core';
import { ToastController,AlertController } from 'ionic-angular';

@Injectable()
export class ToastProvider {

  constructor(private toastCtrl: ToastController,public alertCtrl: AlertController) {
    console.log('Hello ToastProvider Provider');
  }


  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      // dismissOnPageChange:true,
      // cssClass:'toast-message',
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  presentToastWithPage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      // cssClass:'toast-message',
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  presentToastWithClose(message) {
    let toast = this.toastCtrl.create({ 
      message: message,
      position: 'bottom',
      showCloseButton: true,
      dismissOnPageChange:true,
      // cssClass:'toast-message',
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });  
    toast.present();
  }


  alert1(msg) {
    let alert1 = this.alertCtrl.create();
    alert1.setCssClass("call-popup alert-message-error");
    alert1.setCssClass("alert-message-error csv-message-error");   
        alert1.addInput({
          type: 'button',
          label: msg,   //element.contact_no,  
          value: msg,
        });    
  
    alert1.addButton('OK');
    alert1.present();
  }

  presentToastLongTime(message) {
    let toast = this.toastCtrl.create({
    message: message,
    duration: 6000,
    position: 'bottom',
    // dismissOnPageChange:true,
    // cssClass:'toast-message',
    });
    toast.onDidDismiss(() => {
    console.log('Dismissed toast');
    });
    toast.present();
    }

}
