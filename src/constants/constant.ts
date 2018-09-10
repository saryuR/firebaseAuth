
export namespace Constants {
  // replace with your key
  export const version = '0.0.12';
  export const iosVersion = '0.0.13';
  // export var mode = "admin";
  export var mode = "user";
  export const welcomeMessage = '';
  // export const liveApi = "https://gopib.online/";
  // export const localApi = "http://192.168.1.128/gopib/public";
  // export const apiUrl = "https://gopib.net";
  // export const apiUrl = "https://gopib.online";
  // export const apiUrl = "https://gopib.net";
  export const apiUrl = "http://192.168.1.138/gopib/public";
  export const apiVersion = "v1";

  // export const apiVersion = "v1";

  export const appComponentMessages = {
    internetGone: "Please check internet connectivity",
    notImplemetedMessage: 'Coming soon!',
    title: '<div class="popup-title"><span><img src="assets/icon/import-contact-popup.svg"></span><font>Import Contact From Other Accounts</font></div>',
    message: '<div class="popup-details" ><div class="list"><span class="menu-icon"><img src="assets/icon/phone-book-popup.svg"></span>Phone Book</div><div class="list last"><span class="menu-icon"><img src="assets/icon/csv.svg"></span>CSV or vCard file</div><div class="line-or"></div><div class="two-col"><div><span class="menu-icon"><img src="assets/icon/gmail.svg"></span>Gmail</div><div><span class="menu-icon"><img src="assets/icon/yahoo.svg"></span>Yahoo</div></div></div> ',
    cancel: 'Cancel',
  }
  export const contactProfileMessages = {
    select_conatctNumber: 'Select Contact Number',
    cancel: 'Cancel',
    Makecall: "Make call",
    prvideMobile: "Please provide mobile number to call",
    SendMessage: "Send Message",
    prvideMobileMessage: "Please provide mobile number to message", 
    notImplemetedMessage: 'Coming soon!',
    FirstName: "Please enter a valid firstName",
    LastName: "Please enter a valid last name",
    contact_number: "Please enter a valid phone no",
    email: "Please provide a valid email",
    selectContactsToImport: "Please select contacts to import by select all or pressing on contacts",
    SomethingWentWrong: "Something went wrong!",
    mergeContacts: "Merge feature for mobile application is coming soon, Please login via website to merge duplicate contacts.",
    slowLoading:"We are finding the duplicate contacts for you. Please wait for us to complete the process. It may take several minutes."

  }

  export const userProfileMessages = {
    FirstName: "Please enter a valid firstName",
    LastName: "Please enter a valid last name",
    contact_number: "Please enter a valid phone no",
    ChildrenErr: "Children field is required",
    languageErr: "Language field is required",
    notImplemetedMessage: 'Coming soon!',
    title: 'Set Profile Photo',
    cancel: 'Cancel',
    gallery: 'Choose from Gallery',
    camera: 'Take Photo'
  }

  export const dashBoardMessages = {
    title: '<div class="popup-title"><span><img src="assets/icon/import-contact-popup.svg"></span><font>Import Contact From Other Accounts</font></div>',
    message: '<div class="popup-details" ><div class="list"><span class="menu-icon"><img src="assets/icon/phone-book-popup.svg"></span>Phone Book</div><div class="list last"><span class="menu-icon"><img src="assets/icon/csv.svg"></span>CSV or vCard file</div><div class="line-or"></div><div class="two-col"><div><span class="menu-icon"><img src="assets/icon/gmail.svg"></span>Gmail</div><div><span class="menu-icon"><img src="assets/icon/yahoo.svg"></span>Yahoo</div></div></div> ',
    cancel: 'Cancel',
    notImplemetedMessage: 'Coming soon!',
    yes: 'Yes',
    favorite_title: 'Add as favourite ?'
  }

  export const userLoginMessages = {
    notImplemetedMessage: 'Coming soon!',
    validCredentials: "Please provide valid credentials!",
    email: "Please provide a valid email",
    fillFields: "Please fill in all required fields"

  }

  export const errorMessages = {
    failed: 'Failed!',
    sizeLimitMsg: 'Size can\'t be exceeds more than 20MB',
    emailValidation: 'Email validation error',
    profileUpdated: 'Your profile has been successfully updated!',
    internetGone: "Please check internet connectivity",
    validCredentials: "Please provide valid credentials!",
    selectContactsToImport: "Please select contacts to import by select all or pressing on contacts",
    SomethingWentWrong: "Something went wrong!",
    ChildrenErr: "Children field is required",
    languageErr: "Language field is required",
    FirstName: "Please enter a valid firstName",
    LastName: "Please enter a valid last name",
    contact_number: "Please enter a valid phone no",
    prvideMobile: "Please provide mobile number to call",
    prvideMobileMessage: "Please provide mobile number to message",
    email: "Please provide a valid email",
    emailorMobile:  "Please provide a valid email or mobile number",
    otp: "Please provide a valid Otp", 
    mergeContactSelection: "Please select at least 2 or more record to merge",
    emailErr:"Enter a combination of at least 8 characters or longer, uppercase letter, lowercase letter and number."
  };

  export const successMessages = {
    profileUpdated: 'Profile updated!',
    messageCoppied: 'Message copied',
    formSubmitted: 'Form submitted',
    inviteSent: 'Invite sent!',
    requestSent: 'Request sent!',
    requestDeleted: 'Deleted!',
    otpSend: 'Please check your mobile for OTP',
    presentErrorMessage: 'Please go nearby location of event to mark your presence',
    presentSuccessMessage: 'Your present has been marked, you have earned 100 points',
    setPresentStatus: 'Please mark your Presence',
    smsSentSuccess: 'SMS sent successFully',
    copiedReferalcode: "copied"
  };
  export const notImplemetedMessages = {
    notImplemetedMessage: 'Coming soon!',
    Cancel: 'Cancel'
  }
  export const Alert = {
    title: '<div class="popup-title"><span><img src="assets/icon/import-contact-popup.svg"></span><font>Import Contact From Other Accounts</font></div>',
    message: '<div class="popup-details" ><div class="list"><span class="menu-icon"><img src="assets/icon/phone-book-popup.svg"></span>Phone Book</div><div class="list last"><span class="menu-icon"><img src="assets/icon/csv.svg"></span>CSV or vCard file</div><div class="line-or"></div><div class="two-col"><div><span class="menu-icon"><img src="assets/icon/gmail.svg"></span>Gmail</div><div><span class="menu-icon"><img src="assets/icon/yahoo.svg"></span>Yahoo</div></div></div> ',
    cancel: 'Cancel',
    select_conatctNumber: 'Select Contact Number',
    SendMessage: "Send Message",
    Makecall: "Make call",
    confirmPopup:"Are you sure do you want to disconnect with"
  }
  export const Slide = {
    title1: 'Match Me',
    title2: 'Security',
    title3: 'Invite Friends',
    title4: 'Create Group',
    description1: 'Your contacts are very valuable for YOU… make the most out of them. Or Get the most value out of your contacts.',
    description2: 'Your information is for your benefit. Your privacy is our priority.',
    description3: 'Become a premium client and unleash the benefits of your contacts and information. Start earning now.',
    description4: 'Search inside and outside of your current contacts for the perfect profiles to create your groups. ',
  }
  // export const Upload = {
  //   title: 'Set Profile Photo',
  //   cancel: 'Cancel',
  //   gallery: 'Choose from Gallery',
  //   camera: 'Take Photo'
  // }

  export const Update = {
    title_update : 'New Version available',
    message_update : 'Please, update app to new version to continue to use it.!!!',
    button_update : 'UPDATE',
  }

}
