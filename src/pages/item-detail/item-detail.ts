import { Component, ViewChild } from '@angular/core';

import { Items,Api } from '../../providers';
import * as firebase from 'firebase';
import { IonicPage,NavController, NavParams, App, Navbar } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  @ViewChild(Navbar) navBar: Navbar;
  public messagesdata:any = [];
  private conversations: any = [];
  private groups: any;
  private updateDateTime: any;

  constructor(public navCtrl: NavController, navParams: NavParams, items: Items,public api:Api,public app: App) {
    this.item = navParams.get('item') || items.defaultItem;
    this.getConversation();
  }


  getConversation() {
    // Get info of conversations of current logged in user.
    this.api.getCurrentUser().valueChanges().subscribe((res: any) => {
      let conversations = res.conversations;
      if (res.conversations && conversations.length > 0) {
        conversations.forEach((conversation, index) => {
          //console.log(index)
          if (conversation) {
            // Get conversation partner info.
            //console.log(conversation)
            this.api.getOtherUser(conversation.userId).valueChanges().subscribe((user: any) => {
              conversation.img = user.img;
              conversation.name = user.firstName + ' ' + user.lastName;
              // Get conversation info.
              this.messagesdata[index] = this.api.getConversationData(conversation.conversationId).valueChanges().take(1).subscribe((messages: any) => {
                this.api.getConversationLast(conversation.conversationId).valueChanges().take(1).subscribe((obj: any) => {
                  // Get last message of conversation.
                  console.log(obj)
                  let lastMessage = obj[0];
                  if (obj.length > 0) {
                    conversation.date = obj[0].date;
                  }
                  conversation.typeCon = 'message';
                  conversation.unreadMessagesCount = 0;
                  if (lastMessage) {
                    conversation.date = lastMessage.date;
                    conversation.sender = lastMessage.sender;
                    // Set unreadMessagesCount
                    if (lastMessage.sender != firebase.auth().currentUser.uid && messages.totalMessages) {
                      conversation.unreadMessagesCount = messages.totalMessages - conversation.messagesRead;
                    }
                    // Process last message depending on messageType.
                    if (lastMessage.type == 'text') {
                      lastMessage.message = lastMessage.message.replace(/<\/*a.*?>/g, '');
                      conversation.message = lastMessage.message;
                      if (lastMessage.sender == firebase.auth().currentUser.uid) {
                        conversation.message = 'You: ' + lastMessage.message;
                      }
                    } else if (lastMessage.type == 'contact') {
                      conversation.message = lastMessage.message.phoneNumber;
                    } else if (lastMessage.type == 'url') {
                      conversation.message = lastMessage.message.site;
                    } else if (lastMessage.type == 'image') {
                      conversation.message = 'has sent you a photo message.';
                      if (lastMessage.sender == firebase.auth().currentUser.uid) {
                        conversation.message = 'You sent a photo message.';
                      }
                    } else if (lastMessage.type == 'video') {
                      conversation.message = 'has sent you a video message.';
                      if (lastMessage.sender == firebase.auth().currentUser.uid) {
                        conversation.message = 'You sent a video message.';
                      }
                    }
                    // Add or update conversation.
                  }
                  this.addOrUpdateConversation(conversation);
                });
              })
            });
          }
        });
      } else {
        this.conversations = [];
        // this.loadingProvider.hide();
      }
    });
  }

    addOrUpdateConversation(conversation) {
      //console.log(conversation.date)
      if (conversation.date) {
        conversation.date = conversation.date
      }
      if (this.conversations.length == 0) {
        this.conversations = [conversation];
      } else {
        var index = -1;
        for (var i = 0; i < this.conversations.length; i++) {
          if (this.conversations[i].groupKey !== undefined && this.conversations[i].groupKey == conversation.groupKey) {
            index = i;
          }
          if (this.conversations[i].conversationId !== undefined && this.conversations[i].conversationId == conversation.conversationId) {
            index = i;
          }
        }
        if (index > -1) {
          this.conversations[index] = conversation;
        } else {
          this.conversations.push(conversation);
        }
        //console.log(this.conversations)
        // Sort by last active date.
        this.conversations.sort((a: any, b: any) => {
          let date1 = new Date(a.date);
          let date2 = new Date(b.date);
          if (date1 > date2) {
            return -1;
          } else if (date1 < date2) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    }

    newMessage(i) {
      this.app.getRootNav().push('NewMessagePage');
    }



}
