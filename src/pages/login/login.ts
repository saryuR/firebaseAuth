import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController,LoadingController,AlertController,Loading} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { User,Api } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  public loading: Loading;
  private loginErrorString: string;
  loginForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  error: any;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private fb: FormBuilder,  public loadingCtrl: LoadingController,public alertCtrl: AlertController,
    public api:Api) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
    this.loginForm = this.fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(/[a-z0-9!#$%&amp;amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;amp;'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
      });
  }

  // Attempt to login in through our User service
  loginUser() {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      let credentials = {email:this.loginForm.value.email, password:this.loginForm.value.password};
      this.api.loginWithEmail(credentials)
        .then(authData => {
          this.navCtrl.setRoot(MainPage);
        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
    // this.user.login(this.account).subscribe((resp) => {
    //   this.navCtrl.push(MainPage);
    // }, (err) => {
    //   this.navCtrl.push(MainPage);
    //   // Unable to log in
    //   let toast = this.toastCtrl.create({
    //     message: this.loginErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
  }
}
