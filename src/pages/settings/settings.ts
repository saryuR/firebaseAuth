import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormArray, AbstractControl,ValidatorFn,ValidationErrors  } from '@angular/forms';
import { Api } from '../../providers';
import { Settings } from '../../providers';
import { EmailValidator } from '../../validators/email';
import { ImageProvider } from '../../providers/image';
import { Camera } from '@ionic-native/camera';
import { ViewChild } from '@angular/core';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  private showMenu = [];
  private applyToall = [];
  private user={'img':''}
  private alert;
  @ViewChild('fileInput') fileInput;

  private userBasicDetails: FormGroup;
  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,public api:Api,public alertCtrl: AlertController,public imageProvider: ImageProvider,public camera:Camera,
    public navParams: NavParams,
    public translate: TranslateService) {
      this.initDetail();
      this.initProfileFileds();
  }

  //init all forms with validations
  initProfileFileds() {
    this.userBasicDetails = this.formBuilder.group({
      first_name: ['', Validators.compose([EmailValidator.namevalidations, Validators.required])],
      last_name: ['', Validators.compose([EmailValidator.namevalidations, Validators.required])],
      date_of_birth: ['', Validators.compose([])],
      place_of_birth: ['', Validators.compose([])],
      gender: ['', Validators.compose([])],
      marital_status: ['', Validators.compose([])],
      children: ['', Validators.compose([])],
      nationality: ['', Validators.compose([])],
      about_you: ['', Validators.compose([])],
      contact_number: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      children_details: this.formBuilder.array([
        //this.initNewChildsFields()
      ]),
    });
  }

  initNewChildsFields(): FormGroup {
    return this.formBuilder.group({
      gender: ['', Validators.compose([Validators.required])],//['', Validators.compose([EmailValidator.isValid])]
      date_of_birth: ['', Validators.compose([Validators.required])]
    });
  }

  initDetail() {
    this.api.getUser().valueChanges().subscribe((user:any) => {
      console.log(user)
      this.user = user;
      let userBasicDetails = Object.assign(this.userBasicDetails.getRawValue(), user);
      this.userBasicDetails.patchValue(userBasicDetails);
      // if (user['children_details'].length > 0) {
      //   user.children_details.forEach((element, i) => {
      //     this.addDynamicInputField(this.userBasicDetails.controls.children_details, 'childs', i);
      //   });
      // } else {
      //   this.addDynamicInputField(this.userBasicDetails.controls.children_details, 'childs', 0);
      // }
    });
  }

  addDynamicInputField(control, type, i): void {
    control.push(this.initNewChildsFields());
  }
  removeDynamicInputField(i: number, control, type): void {
    // const control = <FormArray>this.skillProfileData.controls.university_detail;
    control.removeAt(i);
  }

  enterKey(social_description) {
    console.log(social_description)
    social_description.added = 200
  }
  submitBasicProfile(){
    if (!this.userBasicDetails.valid) {
    } else {
      this.api.updateProfile(this.userBasicDetails.value).then(data => {
        console.log(data)
      }, err => {
      });
    }
  }

   // Change user's profile photo. Uses imageProvider to process image and upload on Firebase and update userData.
   setPhoto() {
    if (Camera['installed']()) {
    // Ask if the user wants to take a photo or choose from photo gallery.
    this.alert = this.alertCtrl.create({
      title: 'Set Profile Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    }).present();
  }else{
      this.fileInput.nativeElement.click();

  }
  }

  checkAndScrollToInvalidElement(target1, target2, target3, target4) {
    // let target1 = $('ion-input.ng-invalid:first input');
    // let target2 = $('ion-select.ng-invalid:first button');
    let target;
    if (target1[0] || target2[0] || target3[0] || target4[0]) {
      if (target1[0]) {
        target = target1[0]
      } else if (target2[0]) {
        target = target2[0]
      } else if (target3[0]) {
        target = target3[0]
      } else if (target4) {
        target = target4[0]
      }
      console.log(target)
      if (target.id == '') {
        var minNumber = -100;
        var maxNumber = 40
        target.id = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
      }
      console.log(target1)
      let elem = document.getElementById(target.id);
      if (elem) {
        let box = elem.getBoundingClientRect();
        let body = document.body;
        let docEl = document.documentElement;
        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let clientTop = docEl.clientTop || body.clientTop || 0;
        let top = box.top + scrollTop - clientTop;
        // let cDim = this.content.getContentDimensions();
        // let scrollOffset = Math.round(top) + cDim.scrollTop - cDim.contentTop;

        // console.log(scrollOffset)
        // this.content.scrollTo(0, scrollOffset - 100, 500).then(data => {
        // });
      }
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.userBasicDetails.patchValue({ 'img': imageData });
      // this.user['img'] = imageData;
      console.log(event.target.files[0])
      this.imageProvider.readImageBlob('',imageData,this.user['img']).then(data =>{
        this.user['img']=data.url;
        this.api.updateImage(data.url).then(data1 => {
          console.log(data1)
        }, err => {
        });
      });
      // this.imageProvider.setProfilePicFromWeb(event.target.files[0],this.user);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.userBasicDetails.controls['img'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */

}
