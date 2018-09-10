import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User,Api } from '../../providers';
/**
 * Generated class for the NewMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-message',
  templateUrl: 'new-message.html',
})
export class NewMessagePage {
  private friends: any = [];
  private searchFriend: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api) {
  }

  ionViewDidLoad() {
    // Initialize
    this.searchFriend = '';

    // Get user's friends.
    this.api.getallConversations().valueChanges().subscribe((emails:any) => {
      if (emails) {
        let details =[];
        Object.keys(emails).forEach(key => {
        this.friends.push({"username":key,"Email":emails[key]});
        });
      }else{
      this.friends = [];
    }
  });
  }

  message(userId) {
    this.navCtrl.push('ChatPage', { userId: userId });
  }

  // Back
  goback() {
    this.navCtrl.pop();
  }
}
