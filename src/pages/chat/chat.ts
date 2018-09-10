import { Component, ViewChild, Input, ApplicationRef, ElementRef } from '@angular/core';
import { IonicPage,NavController, NavParams, Content, ModalController, ViewController } from 'ionic-angular';
import * as firebase from 'firebase';
import { MediaCapture, CaptureVideoOptions } from '@ionic-native/media-capture';
import { Camera } from '@ionic-native/camera';
import { Api } from '../../providers';
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  @ViewChild('input') myInput;
  @ViewChild('wrapper') wrapper: ElementRef;
  private userId:any
  conver_array :any =[];
  private friend: any;
  private currentUser: any;
  private message: any;
  private conversationId: any;
  private messages: any;
  // private alert: any;
  private updateDateTime: any;
  private messagesToShow: any;
  private startIndex: any = 0;
  private scrollDirection: any = 'bottom';
  // Set number of messages to show.
  private numberOfMessages = 10;
  private imgData: any;
  private overLayIndex: -1;
  private isCopy: any;
  private share: any;
  private isDelete: any;
  private hideNavBar: boolean;
  private selectedMessage: any;
  private replaytoThisMsg: any;
  private replayMessage: any;
  private options: CaptureVideoOptions = { limit: 1, duration: 20 };
  private setUrlMsg = { image: "", title: "", site: "/" };
  private messageSubscription: any;
  userSubscription: any;
  private adminUser;
  private msgIndex: -1;
  private messageToScroll: any;
  private imgUploade: boolean = true;
  firstloaded = false;
  lastIndex;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api,public af: AngularFirestore,
    private afAuth: AngularFireAuth) {
    this.userId = this.navParams.get('userId');
  }

  ngAfterViewInit() {
    // this.content.ionScrollEnd.subscribe((data) => {
    //   if (this.messageToScroll) {
    //     this.goToMessage(this.messageToScroll);
    //     this.messageToScroll = undefined;
    //   }
    // });

  }

  ionViewDidLoad() {
    this.userId = this.navParams.get('userId');
    console.log(this.userId)
    // this.imgData = this.navParams.get('imgData');
    // this.imgUploade = true;
    // this.hideNavBar = false;

    let users = []
    users.push(firebase.auth().currentUser.uid)
    users.push(this.userId)

    this.conver_array = {
      dateCreated: new Date(),
      users: users,
      totalMessages: 0
    };

    // Get friend details.
    this.api.getOtherUser(this.userId).valueChanges().take(1).subscribe((frind) => {
      let friend = frind;
    });
    this.api.getCurrentUser().valueChanges().take(1).subscribe((user) => {
      let currentUser = user;
    });

    this.userSubscription = this.api.getUser(this.userId).valueChanges().subscribe((conversation: any) => {
      if (conversation.conversations !== undefined) {
        // User already have conversation with this friend, get conversation
        this.conversationId = _.filter(conversation.conversations, element => {
          return element.userId == this.currentUser.userId;
        });
        if (this.conversationId.length > 0) {
          this.conversationId = this.conversationId[0].conversationId
          // Get conversation
          this.messageSubscription = this.api.getConversationMessages(this.conversationId).subscribe((messages: any) => {
            this.numberOfMessages = messages.length;
            console.log('messages', messages)
            if (this.messages) {
              // Just append newly added messages to the bottom of the view.
              if (messages.length > this.messages.length) {
                let start = this.messages.length;
                console.log(start, this.messages.length, messages.length)
                for (start; start < messages.length; start++) {
                  this.messages.push(messages[start]);
                  this.messagesToShow.push(messages[start]);
                  this.api.getUser(messages[start].sender).valueChanges().take(1).subscribe((user: any) => {
                    if (this.messagesToShow[start]) {
                      this.messagesToShow[start].avatar = user.img;
                    }
                  });
                }
                this.scrollDirection = 'bottom';
                this.setMessagesRead(this.messages);
                // if (messages[messages.length - 1].sender == firebase.auth().currentUser.uid && messages[messages.length - 1].type == 'video'
                //   && messages[messages.length - 1].videoUploaded == true) { }

                // else {
                //   let message = messages[messages.length - 1];
                //   this.dataProvider.getUser(message.sender).valueChanges().take(1).subscribe((user: any) => {
                //     message.avatar = user.img;
                //   });
                //   this.dataProvider.getUser(message.sender).valueChanges().take(1).subscribe((user: any) => {
                //     message.name = user.name;
                //   });
                //   this.messages.push(message);
                //   // Also append to messagesToShow.
                //   this.messagesToShow.push(message);
                //   // Reset scrollDirection to bottom.
                //   this.scrollDirection = 'bottom';
                //   this.setMessagesRead(this.messages);
                // }
              }
              else if (messages.length == this.messages.length) {
                this.messagesToShow = [];
                this.messagesInit(messages);
              }
            } else {
              this.messagesInit(messages);
              this.setMessagesRead(messages);
            }
          });
        } else {
          this.conversationId = null;
          this.loadingProvider.show()
          this.dataProvider.CreateNewConv(this.conver_array, this.userId);
          // this.dataProvider.addConvo().add({
          //   dateCreated: new Date(),
          //   users: users,
          //   totalMessages: 0
          // }).then((res:any)=>{
          //   this.conversationId = res.id;
          //   this.loadingProvider.hide()
          //   this.addConvToUserAccount(firebase.auth().currentUser.uid, res.id, this.userId)
          //   this.addConvToUserAccount(this.userId, res.id, firebase.auth().currentUser.uid)
          // })
        }
      } else {
        console.log('else');
        this.api.CreateNewConv(this.conver_array, this.userId);
      }
    });
  }

  setMessagesRead(messages) {
    if (this.navCtrl.getActive().instance instanceof MessagePage) {
      // Update user's messagesRead on database.
      let totalMessagesCount;
      this.dataProvider.getConversationMessages(this.conversationId).take(1).subscribe((res: any) => {
        totalMessagesCount = res.length;
        this.dataProvider.userAccountConv(this.currentUser.userId).valueChanges().take(1).subscribe((res: any) => {
          let conversations = res.conversations;
          for (let i = 0; i < conversations.length; i++) {
            if (conversations[i].conversationId == this.conversationId) {
              conversations[i].messagesRead = totalMessagesCount
            }
          }
          this.dataProvider.userAccountConv(this.currentUser.userId).update({
            conversations: conversations
          })
        })
      });
    }
  }

  CreateNewConv(conver_array, userId) {  
    new Promise(resolve => {
      this.af.collection('/conversations/').add(
        conver_array
      ).then(res => {
        let result: any = res;
        let conversationId = result.id;
        console.log('successs')
        console.log('result', result)
        let key = result._key.path.segments[1];
        this.insertKey(firebase.auth().currentUser.uid, conversationId, userId);
      }).catch(error => {
        console.log('failed')
      });
    });
  }

  insertKey(cuurent_uid, conversationId, userId) {
    // console.log('cuurent_uid',cuurent_uid)
    // console.log('conversationId',conversationId)
    // console.log('userId',userId)
    this.af.collection('/accounts/').doc(cuurent_uid).valueChanges().take(1).map(response => response).subscribe(result => {

      let conversation: any;
      if (result['conversations'] == undefined) {
        conversation = [{
          conversationId: conversationId,
          messagesRead: 0,
          userId: userId
        }]
      } else {
        conversation = result['conversations'];
        conversation.push({
          conversationId: conversationId,
          messagesRead: 0,
          userId: userId
        })
      }
      this.angularfire.collection('/accounts/').doc(cuurent_uid).update({
        conversations: conversation
      });
    });

}
