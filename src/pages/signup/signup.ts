import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController,LoadingController,AlertController,Loading} from 'ionic-angular';
import { User,Api } from '../../providers';
import { MainPage } from '../';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { ToastProvider } from '../../providers/toast/toast';
import { LoadingProvider } from '../../providers/loading/loading';
import { Constants } from '../../constants/constant';
import { Constants_it } from '../../constants/constant_it';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, password: string } = {
    name: 'Test Human',
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  private signupErrorString: string;
  public loading: Loading;
  private loginErrorString: string;
  signupForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  error: any;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private fb: FormBuilder,  public loadingCtrl: LoadingController,public alertCtrl: AlertController,private loadingProvider: LoadingProvider, private toastProvider: ToastProvider,
    public api:Api) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
    this.signupForm = this.fb.group({
      first_name: ['', Validators.compose([EmailValidator.namevalidations,Validators.maxLength(20), Validators.required])],
      last_name: ['', Validators.compose([EmailValidator.namevalidations,Validators.maxLength(20), Validators.required])],
      // contact_number: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      username: ['', Validators.compose([EmailValidator.userNamevalidations, Validators.maxLength(20), Validators.required])],
      // country_code: ['', Validators.compose([Validators.required])],
      referral_code:  ['', Validators.compose([])],
      is_term_accept: ['true', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')])],
      password_confirmation: ['', Validators.required]
    }, {
        validator: EmailValidator.MatchPassword // your validation method
      });
  }

  doSignup() {
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {

      this.navCtrl.push(MainPage);

      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
  signupUser() {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
      // if (localStorage.getItem('language') == 'en') {
        this.toastProvider.presentToast(Constants.userLoginMessages.fillFields)
      // } else {
      //   this.toastProvider.presentToast(Constants_it.userLoginMessages.fillFields)
      // }
    } else {
      let inputparam = {
        email: this.signupForm.value.email,
        contact_number: this.signupForm.value.contact_number,
        first_name: this.signupForm.value.first_name,
        last_name: this.signupForm.value.last_name,
        country_code: this.signupForm.value.country_code,
        is_term_accept: this.signupForm.value.is_term_accept,
        password: this.signupForm.value.password,
        password_confirmation: this.signupForm.value.password_confirmation,
        username: this.signupForm.value.username,
      };

      this.api.signupUser(this.signupForm.value.email,this.signupForm.value.password,this.signupForm.value)
        .then(authData => {
          this.api.addToConversationList(this.signupForm.value.email);
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
  }
}
