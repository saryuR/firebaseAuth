import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs";

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = "https://example.com/api/v1";

  constructor(
    public http: HttpClient,
    public af: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    af.firestore.settings({ timestampsInSnapshots: true });
  }
  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url + "/" + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + "/" + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + "/" + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + "/" + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + "/" + endpoint, body, reqOpts);
  }

  loginWithEmail(credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }
  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  signupUser(newEmail: string, newPassword: string,obj): Promise<any> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(newEmail, newPassword)
      .then(data => {
        // this.user = this.afAuth.authState;
        obj["userId"] = this.afAuth.auth.currentUser.uid;
        this.addnewCollectionInfo("/userInfo", obj);
      });
  }

  addnewCollectionInfo(name, jsonObj) {
    const id = this.af.createId();
    if(jsonObj["userId"] == ''){
      jsonObj["userId"] = id;
    }
    this.af
      .collection(name)
      .doc(this.afAuth.auth.currentUser.uid)
      .set(jsonObj);
  }

  addToConversationList(emails){
    let email = {}
    email[this.afAuth.auth.currentUser.uid]=emails;
    return this.af
    .collection('/registered_Users/')
    .doc('emails').update(emails).then(data=>{
    console.log(data)
    }).catch(e =>{
      this.af
    .collection('/registered_Users/')
    .doc('emails').set({emails})
    });
  }

  getUser(id) {
    return this.af.collection('userInfo').doc(this.afAuth.auth.currentUser.uid);
  }

  updateProfile(jsonObj){
    jsonObj['userId']= this.afAuth.auth.currentUser.uid;
    return this.af.collection('/userInfo/').doc(this.afAuth.auth.currentUser.uid).update(jsonObj);
  }

  updateCameraImage() {
    return this.af.collection('/userInfo/');
  }
  updateImage(url) {
    return this.af.collection('/userInfo/').doc(this.afAuth.auth.currentUser.uid).update({ img: url });
  }

  getCurrentUser() {
    return this.af.collection('/userInfo/').doc(this.afAuth.auth.currentUser.uid);
  }

  getOtherUser(userId) {
    return this.af.collection('/userInfo/').doc(userId);
  }

  getConversationLast(conversationId) {
    return this.af.collection('/conversations/').doc(conversationId).collection('messages', ref => ref.limit(1).orderBy('date', 'desc'));
  }
  getConversationData(conversationId) {
    return this.af.collection('/conversations/').doc(conversationId);
  }
  getConversationLenght(conversationId) {
    return this.af.collection('/conversations/').doc(conversationId);
  }
  setConversation(conversationId) {
    return this.af.collection('/conversations/').doc(conversationId).collection('messages');
  }

  updateConversion(cuurent_uid,conversation){
  this.af.collection('/accounts/').doc(cuurent_uid).update({
    conversations: conversation
  });
}

getallConversations(){
  return this.af.collection('/registered_Users/').doc('emails');
}

getConversationMessages(conversationId) {
  return this.af.collection('/conversations/').doc(conversationId).collection('messages', ref => ref.orderBy('date', 'asc')).valueChanges();
}

updateConversationMessages(conversationId, i) {
  return this.af.collection('/conversations/' + conversationId + '/messages/').doc(i);
}



}
