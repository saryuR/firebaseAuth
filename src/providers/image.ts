import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";
import * as firebase from "firebase";
import { MediaCapture, CaptureVideoOptions } from "@ionic-native/media-capture";
import { File } from "@ionic-native/file";
import { VideoEditor } from "@ionic-native/video-editor";
import { Platform } from "ionic-angular";

import { Api } from "../providers";
// import { AlertProvider } from './alert';
// import { LoadingProvider } from '../loading';
// import { Constant } from '../constants';
import { Network } from "@ionic-native/network";
// import { BackgroundMode } from '@ionic-native/background-mode';

import { FilePath } from "@ionic-native/file-path";
import { AngularFireAuth } from "angularfire2/auth";

@Injectable()
export class ImageProvider {
  private filePath;
  private messages: any;
  private onlineStatus = "connected";
  // Image Provider
  // This is the provider class for most of the image processing including uploading images to Firebase.
  // Take note that the default function here uploads the file in .jpg. If you plan to use other encoding types, make sure to
  // set the encodingType before uploading the image on Firebase.
  // Example for .png:
  // data:image/jpeg;base64 -> data:image/png;base64
  // generateFilename to return .png
  private profilePhotoOptions: CameraOptions = {
    quality: 20,
    targetWidth: 384,
    targetHeight: 384,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };

  private photoMessageOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };
  private galleryvideoOptions: CameraOptions = {
    quality: 10,
    mediaType: this.camera.MediaType.VIDEO,
    destinationType: this.camera.DestinationType.DATA_URL,
    correctOrientation: true
  };

  private options: CaptureVideoOptions = { limit: 1, duration: 20 };

  private groupPhotoOptions: CameraOptions = {
    quality: 20,
    targetWidth: 384,
    targetHeight: 384,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };
  private documentMessageOptions: CameraOptions = {
    quality: 10,
    mediaType: this.camera.MediaType.ALLMEDIA,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: 0
  };

  // All files to be uploaded on Firebase must have DATA_URL as the destination type.
  // This will return the imageURI which can then be processed and uploaded to Firebase.
  // For the list of cameraOptions, please refer to: https://github.com/apache/cordova-plugin-camera#module_camera.CameraOptions

  constructor(
    public camera: Camera,
    public FilePath: FilePath,
    public mediaCapture: MediaCapture,
    public file: File,
    public videoEditor: VideoEditor,
    public network: Network,
    public api: Api,
    private afAuth: AngularFireAuth,
    public plt: Platform
  ) {
    console.log("Initializing Image Provider");
  }

  // Function to convert dataURI to Blob needed by Firebase
  imgURItoBlob(dataURI) {
    var binary = atob(dataURI.split(",")[1]);
    var mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  readImageBlob(ID, imageData,img): Promise<any> {
    return new Promise(resolve => {
      ID = this.afAuth.auth.currentUser.uid;
      let res;
      let imgBlob = this.imgURItoBlob(imageData);
      let metadata = {
        contentType: imgBlob.type
      };

      // setInterval(() => {
      //   if (!this.isOnline()) {
      //     let metadata = {
      //       'url': '',
      //       'size': '',
      //       'retry': true
      //     };
      //     res = metadata;
      //     resolve(metadata);
      //   }
      // }, 300);
      firebase
        .storage()
        .ref()
        .child("images/" + ID + "/" + this.generateFilename())
        .put(imgBlob, metadata)
        .then(snapshot => {
          this.deleteImageFile(img);
          // URL of the uploaded image!
          // let url = snapshot.metadata.downloadURLs[0];
          let url = "";
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            let metadata = {
              url: downloadURL,
              size: imgBlob.size,
              retry: false
            };
            res = metadata;
            resolve(metadata);
          });
        })
        .catch(error => {
          // this.alertProvider.showErrorMessage('image/error-image-upload');
          let metadata = { url: "", size: "", retry: true };
          res = metadata;
          resolve(metadata);
        });
      // setTimeout(() => {
      //   if (!res) {
      //     let metadata = {
      //       url: "",
      //       size: "",
      //       retry: true
      //     };
      //     resolve(metadata);
      //   }
      // }, 90000);
    });
  }

  // Generate a random filename of length for the image to be uploaded
  generateFilename() {
    var length = 8;
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  generateFilenameWithExt(ext) {
    var length = 8;
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ext;
  }

  // Set ProfilePhoto given the user and the cameraSourceType.
  // This function processes the imageURI returned and uploads the file on Firebase,
  // Finally the user data on the database is updated.
  setProfilePhoto(user, sourceType) {
    this.profilePhotoOptions.sourceType = sourceType;
    // this.loadingProvider.show();
    // Get picture from camera or gallery.
    this.camera
      .getPicture(this.profilePhotoOptions)
      .then(imageData => {
        // Process the returned imageURI.
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          contentType: imgBlob.type
        };
        // Generate filename and upload to Firebase Storage.
        firebase
          .storage()
          .ref()
          .child("images/" + user.userId + "/" + this.generateFilename())
          .put(imgBlob, metadata)
          .then(snapshot => {
            // Delete previous profile photo on Storage if it exists.
            this.deleteImageFile(user.img);
            // URL of the uploaded image!
            let url = snapshot.metadata.downloadURLs[0];
            let profile = {
              displayName: user.name,
              photoURL: url
            };
            // Update Firebase User.
            firebase
              .auth()
              .currentUser.updateProfile(profile)
              .then(success => {
                // Update User Data on Database.
                this.api
                  .updateCameraImage()
                  .doc(user.userId)
                  .update({
                    img: url
                  })
                  .then(success => {
                    // this.loadingProvider.hide();
                    // this.alertProvider.showProfileUpdatedMessage();
                  })
                  .catch(error => {
                    // this.loadingProvider.hide();
                    // this.alertProvider.showErrorMessage('profile/error-change-photo');
                  });
              })
              .catch(error => {
                // this.loadingProvider.hide();
                // this.alertProvider.showErrorMessage('profile/error-change-photo');
              });
          })
          .catch(error => {
            // this.loadingProvider.hide();
            // this.alertProvider.showErrorMessage('image/error-image-upload');
          });
      })
      .catch(error => {
        // this.loadingProvider.hide();
      });
  }

  setProfilePicFromWeb(imgBlob, user) {
    let metadata = {
      contentType: "image/png"
    };
    // Generate filename and upload to Firebase Storage.
    firebase
      .storage()
      .ref()
      .child("images/" + user.userId + "/" + this.generateFilename())
      .put(imgBlob, metadata)
      .then(snapshot => {
        // Delete previous profile photo on Storage if it exists.
        // this.deleteImageFile(user.img);
        // URL of the uploaded image!
        let url = snapshot.metadata.downloadURLs[0];
        let profile = {
          displayName: user.name,
          photoURL: url
        };
        // Update Firebase User.
        firebase
          .auth()
          .currentUser.updateProfile(profile)
          .then(success => {
            // Update User Data on Database.
            this.api
              .updateCameraImage()
              .doc(user.userId)
              .update({
                img: url
              })
              .then(success => {
                // this.loadingProvider.hide();
                // this.alertProvider.showProfileUpdatedMessage();
              })
              .catch(error => {
                // this.loadingProvider.hide();
                // this.alertProvider.showErrorMessage('profile/error-change-photo');
              });
          })
          .catch(error => {
            // this.loadingProvider.hide();
            // this.alertProvider.showErrorMessage('profile/error-change-photo');
          });
      })
      .catch(error => {
        // this.loadingProvider.hide();
        // this.alertProvider.showErrorMessage('image/error-image-upload');
      });
  }

  setTempProfilePhoto(sourceType) {
    this.profilePhotoOptions.sourceType = sourceType;
    // this.loadingProvider.show();
    // Get picture from camera or gallery.
    return this.camera
      .getPicture(this.profilePhotoOptions)
      .then(imageData => {
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          contentType: imgBlob.type
        };
        return firebase
          .storage()
          .ref()
          .child("images/register/" + "/" + this.generateFilename())
          .put(imgBlob, metadata)
          .then(snapshot => {
            let url = snapshot.metadata.downloadURLs[0];
            // this.loadingProvider.hide();
            return url;
          })
          .catch(error => {
            // this.loadingProvider.hide();
            // this.alertProvider.showErrorMessage('image/error-image-upload');
          });
      })
      .catch(error => {
        // this.loadingProvider.hide();
      });
  }

  // Upload and set the group object's image.
  setGroupPhoto(group, sourceType) {
    this.groupPhotoOptions.sourceType = sourceType;
    // this.loadingProvider.show();
    // Get picture from camera or gallery.
    this.camera
      .getPicture(this.groupPhotoOptions)
      .then(imageData => {
        // Process the returned imageURI.
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          contentType: imgBlob.type
        };
        firebase
          .storage()
          .ref()
          .child(
            "images/" +
              firebase.auth().currentUser.uid +
              "/" +
              this.generateFilename()
          )
          .put(imgBlob, metadata)
          .then(snapshot => {
            this.deleteImageFile(group.img);
            // URL of the uploaded image!
            let url = snapshot.metadata.downloadURLs[0];
            group.img = url;
            // this.loadingProvider.hide();
          })
          .catch(error => {
            // this.loadingProvider.hide();
            // this.alertProvider.showErrorMessage('image/error-image-upload');
          });
      })
      .catch(error => {
        // this.loadingProvider.hide();
      });
  }

  // Set group photo and return the group object as promise.
  setGroupPhotoPromise(group, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.groupPhotoOptions.sourceType = sourceType;
      // this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera
        .getPicture(this.groupPhotoOptions)
        .then(imageData => {
          // Process the returned imageURI.
          let imgBlob = this.imgURItoBlob(
            "data:image/jpeg;base64," + imageData
          );
          let metadata = {
            contentType: imgBlob.type
          };
          firebase
            .storage()
            .ref()
            .child(
              "images/" +
                firebase.auth().currentUser.uid +
                "/" +
                this.generateFilename()
            )
            .put(imgBlob, metadata)
            .then(snapshot => {
              this.deleteImageFile(group.img);
              // URL of the uploaded image!
              let url = snapshot.metadata.downloadURLs[0];
              group.img = url;
              // this.loadingProvider.hide();
              resolve(group);
            })
            .catch(error => {
              // this.loadingProvider.hide();
              // this.alertProvider.showErrorMessage('image/error-image-upload');
            });
        })
        .catch(error => {
          // this.loadingProvider.hide();
        });
    });
  }

  //Delete the image given the url.
  deleteImageFile(path) {
    var fileName = path.substring(
      path.lastIndexOf("%2F") + 3,
      path.lastIndexOf("?")
    );
    firebase
      .storage()
      .ref()
      .child("images/" + firebase.auth().currentUser.uid + "/" + fileName)
      .delete()
      .then(() => {})
      .catch(error => {});
  }

  //Delete the user.img given the user.
  deleteUserImageFile(user) {
    var fileName = user.img.substring(
      user.img.lastIndexOf("%2F") + 3,
      user.img.lastIndexOf("?")
    );
    firebase
      .storage()
      .ref()
      .child("images/" + user.userId + "/" + fileName)
      .delete()
      .then(() => {})
      .catch(error => {});
  }

  // Delete group image file on group storage reference.
  deleteGroupImageFile(groupId, path) {
    var fileName = path.substring(
      path.lastIndexOf("%2F") + 3,
      path.lastIndexOf("?")
    );
    firebase
      .storage()
      .ref()
      .child("images/" + groupId + "/" + fileName)
      .delete()
      .then(() => {})
      .catch(error => {});
  }

  // Upload photo message and return the url as promise.
  uploadPhotoMessage(sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.sourceType = sourceType;
      // Get picture from camera or gallery.
      this.camera
        .getPicture(this.photoMessageOptions)
        .then(imageData => {
          let metadata = { localUrl: "data:image/jpeg;base64," + imageData };
          resolve(metadata);
        })
        .catch(error => {});
    });
  }

  // Upload group photo message and return a promise as url.
  uploadGroupPhotoMessage(groupId, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.sourceType = sourceType;
      // this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera
        .getPicture(this.photoMessageOptions)
        .then(imageData => {
          // Process the returned imageURI.
          let imgBlob = this.imgURItoBlob(
            "data:image/jpeg;base64," + imageData
          );
          let metadata = {
            contentType: imgBlob.type
          };
          // Generate filename and upload to Firebase Storage.
          firebase
            .storage()
            .ref()
            .child("images/" + groupId + "/" + this.generateFilename())
            .put(imgBlob, metadata)
            .then(snapshot => {
              // URL of the uploaded image!
              let url = snapshot.metadata.downloadURLs[0];
              let metadata = { url: url, size: imgBlob.size };
              // this.loadingProvider.hide();
              resolve(metadata);
            })
            .catch(error => {
              // this.loadingProvider.hide();
              // this.alertProvider.showErrorMessage('image/error-image-upload');
            });
        })
        .catch(error => {
          // this.loadingProvider.hide();
        });
    });
  }
  uploadGroupVideoMessage(groupId, sourceType): Promise<any> {
    return new Promise((resolve, reject) => {
      this.galleryvideoOptions.sourceType = sourceType;
      // this.loadingProvider.show();

      this.camera.getPicture(this.galleryvideoOptions).then(
        data => {
          let videoUrl = "";
          if (this.plt.is("android")) {
            videoUrl = "file://" + data;
          } else if (this.plt.is("ios")) {
            videoUrl = data;
          }
          let x = videoUrl.split("/");
          let filepath = videoUrl.substring(0, videoUrl.lastIndexOf("/"));
          let name = x[x.length - 1];
          this.file.readAsArrayBuffer(filepath, name).then(
            success => {
              //READ THE FILE FOR SIZE AND UPLOAD
              let blob = new Blob([success], { type: "video/mp4" });
              if (blob.size / 1000000 <= 20) {
                let storageRef = firebase.storage().ref();
                let upload = storageRef
                  .child("videos/" + groupId + "/" + name)
                  .put(blob);
                upload.on(
                  firebase.storage.TaskEvent.STATE_CHANGED,
                  snapshot => {
                    let progress =
                      (upload.snapshot.bytesTransferred /
                        upload.snapshot.totalBytes) *
                      100;
                  },
                  err => {
                    // this.loadingProvider.hide();
                    // this.alertProvider.showToast("Error = " + JSON.stringify(err));
                    console.log("error in uploading" + err);
                  },
                  () => {
                    let metadat = {
                      url: upload.snapshot.downloadURL,
                      size: blob.size
                    };
                    // this.loadingProvider.hide();
                    resolve(metadat);
                  }
                );
              } else {
                // this.loadingProvider.hide();
                // this.alertProvider.showToast(Constants.errorMessages.sizeLimitMsg);
              }
            },
            err => {
              // this.loadingProvider.hide();
              // this.alertProvider.showToast("Encoding Error");
            }
          );
        },
        err => {
          reject(JSON.stringify(err));
          // this.loadingProvider.hide();
          console.log("Media Err = " + +JSON.stringify(err));
        }
      );
    });
  }

  toBase64(url: string) {
    return new Promise<string>(function(resolve) {
      let xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = function() {
        let reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.send();
    });
  }

  isOnline(): boolean {
    if (this.network.type !== "none") {
      return true;
    } else if (this.network.type === "none") {
      return false;
    } else {
      return false;
    }
  }

  uploadVideoMessage(Id, data): Promise<any> {
    return new Promise((resolve, reject) => {
      let fileUri;
      let res;
      if (typeof data == "string") {
        fileUri = "file://" + data;
      } else {
        fileUri = data[0].fullPath;
      }
      setInterval(() => {
        if (!this.isOnline()) {
          let metadata = {
            url: "",
            size: "",
            retry: true
          };
          res = metadata;
          resolve(metadata);
        }
      }, 300);
      this.videoEditor
        .transcodeVideo({
          fileUri: fileUri,
          outputFileName: "Output",
          outputFileType: this.videoEditor.OutputFileType.MPEG4,
          optimizeForNetworkUse: this.videoEditor.OptimizeForNetworkUse.YES, // ios only
          saveToLibrary: true, // optional, defaults to true
          deleteInputFile: false, // optional (android only), defaults to false
          maintainAspectRatio: true, // optional (ios only), defaults to true
          width: 640, // optional, see note below on width and height
          height: 640, // optional, see notes below on width and height
          videoBitrate: 1000000, // optional, bitrate in bits, defaults to 1 megabit (1000000)
          fps: 24, // optional (android only), defaults to 24
          audioChannels: 2, // optional (ios only), number of audio channels, defaults to 2
          audioSampleRate: 44100, // optional (ios only), sample rate for the audio, defaults to 44100
          audioBitrate: 128000, // optional (ios only), audio bitrate for the video in bits, defaults to 128 kilobits (128000)
          progress: function(info) {} // info will be a number from 0 to 100
        })
        .then((videoUrl: string) => {
          //transcode over
          if (this.plt.is("android")) {
            videoUrl = "file://" + videoUrl;
          }
          let x = videoUrl.split("/");
          let filepath = videoUrl.substring(0, videoUrl.lastIndexOf("/"));
          let name = x[x.length - 1];
          //read the file and upload
          this.file
            .readAsArrayBuffer(filepath, name)
            .then(success => {
              let blob = new Blob([success], { type: "video/mp4" });
              if (blob.size / 1000000 <= 20) {
                // this.loadingProvider.hide();
                let storageRef = firebase.storage().ref();
                let upload = storageRef
                  .child("videos/" + Id + "/" + name)
                  .put(blob);
                upload.on(
                  firebase.storage.TaskEvent.STATE_CHANGED,
                  snapshot => {
                    let progress =
                      (upload.snapshot.bytesTransferred /
                        upload.snapshot.totalBytes) *
                      100;
                  },
                  err => {
                    // this.loadingProvider.hide();
                    // this.alertProvider.showToast("Media Err" + JSON.stringify(err));
                    let metadata = {
                      url: "",
                      size: "",
                      retry: true
                    };
                    res = metadata;
                    resolve(metadata);
                  },
                  () => {
                    let data = {
                      url: upload.snapshot.downloadURL,
                      size: blob.size,
                      localUrl: videoUrl,
                      retry: false
                    };
                    res = data;
                    resolve(data);
                  }
                );
              } else {
                res = {
                  url: "",
                  size: "",
                  retry: true
                };
                // this.alertProvider.showToast(Constants.errorMessages.sizeLimitMsg);
              }
            })
            .catch((err: any) => {
              res = {
                url: "",
                size: "",
                retry: true
              };
              // this.alertProvider.showToast("Error in Reading file");
            });
        })
        .catch((error: any) => {
          // this.alertProvider.showToast(JSON.stringify(error));
          let metadata = {
            url: "",
            size: "",
            retry: true
          };
          res = metadata;
          resolve(metadata);
        });
      setTimeout(() => {
        if (!res) {
          let metadata = {
            url: "",
            size: "",
            retry: true
          };
          resolve(metadata);
        }
      }, 120000);
    });
  }

  groupVideoMessageupload(groupId, data): Promise<any> {
    return new Promise((resolve, reject) => {
      let fileUri;
      if (typeof data == "string") {
        fileUri = "file://" + data;
      } else {
        fileUri = data[0].fullPath;
      }
      this.videoEditor
        .transcodeVideo({
          fileUri: fileUri,
          outputFileName: "Output",
          outputFileType: this.videoEditor.OutputFileType.MPEG4,
          optimizeForNetworkUse: this.videoEditor.OptimizeForNetworkUse.YES, // ios only
          saveToLibrary: true, // optional, defaults to true
          deleteInputFile: false, // optional (android only), defaults to false
          maintainAspectRatio: true, // optional (ios only), defaults to true
          width: 640, // optional, see note below on width and height
          height: 640, // optional, see notes below on width and height
          videoBitrate: 1000000, // optional, bitrate in bits, defaults to 1 megabit (1000000)
          fps: 24, // optional (android only), defaults to 24
          audioChannels: 2, // optional (ios only), number of audio channels, defaults to 2
          audioSampleRate: 44100, // optional (ios only), sample rate for the audio, defaults to 44100
          audioBitrate: 128000, // optional (ios only), audio bitrate for the video in bits, defaults to 128 kilobits (128000)
          progress: function(info) {} // info will be a number from 0 to 100
        })
        .then((videoUrl: string) => {
          //transcode over
          if (this.plt.is("android")) {
            videoUrl = "file://" + videoUrl;
          }
          let x = videoUrl.split("/");
          let filepath = videoUrl.substring(0, videoUrl.lastIndexOf("/"));
          let name = x[x.length - 1];

          this.file
            .readAsArrayBuffer(filepath, name)
            .then(success => {
              let blob = new Blob([success], { type: "video/mp4" });
              if (blob.size / 1000000 <= 20) {
                // this.loadingProvider.hide();
                let storageRef = firebase.storage().ref();
                let upload = storageRef
                  .child("videos/" + groupId + "/" + name)
                  .put(blob);
                upload.on(
                  firebase.storage.TaskEvent.STATE_CHANGED,
                  snapshot => {
                    let progress =
                      (upload.snapshot.bytesTransferred /
                        upload.snapshot.totalBytes) *
                      100;
                  },
                  err => {
                    // this.loadingProvider.hide();
                    // this.alertProvider.showToast("Media Err" + JSON.stringify(err));
                    let metadata = {
                      url: "",
                      size: "",
                      retry: true
                    };
                    resolve(metadata);
                  },
                  () => {
                    let data = {
                      url: upload.snapshot.downloadURL,
                      size: blob.size,
                      localUrl: videoUrl
                    };
                    resolve(data);
                  }
                );
              } else {
                // this.alertProvider.showToast(Constants.errorMessages.sizeLimitMsg);
              }
            })
            .catch((err: any) => {
              console.log("in reading" + JSON.stringify(err));
              // this.alertProvider.showToast("Error in Reading file");
              let metadata = {
                url: "",
                size: "",
                retry: true
              };
              resolve(metadata);
            });
        })
        .catch((error: any) => {
          // this.alertProvider.showToast(JSON.stringify(error));
        });
    });
  }

  //select video from gallery
  uploadVideoMessageFromGallery(conversationId, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.galleryvideoOptions.sourceType = sourceType;
      // this.loadingProvider.show();
      this.camera.getPicture(this.galleryvideoOptions).then(
        data => {
          let videoUrl = "";
          if (this.plt.is("android")) {
            videoUrl = "file://" + data;
          } else if (this.plt.is("ios")) {
            videoUrl = data;
          }
          let x = videoUrl.split("/");
          let filepath = videoUrl.substring(0, videoUrl.lastIndexOf("/"));
          let name = x[x.length - 1];
          this.file.readAsArrayBuffer(filepath, name).then(
            success => {
              let blob = new Blob([success], { type: "video/mp4" });
              if (blob.size / 1000000 <= 20) {
                let storageRef = firebase.storage().ref();
                let upload = storageRef
                  .child("videos/" + conversationId + "/" + name)
                  .put(blob);
                upload.on(
                  firebase.storage.TaskEvent.STATE_CHANGED,
                  snapshot => {
                    let progress =
                      (upload.snapshot.bytesTransferred /
                        upload.snapshot.totalBytes) *
                      100;
                  },
                  err => {
                    // this.loadingProvider.hide();
                    // this.alertProvider.showToast(JSON.stringify(err));
                  },
                  () => {
                    let metadat = {
                      url: upload.snapshot.downloadURL,
                      size: blob.size
                    };
                    // this.loadingProvider.hide();
                    resolve(metadat);
                  }
                );
              } else {
                // this.alertProvider.showToast(Constants.errorMessages.sizeLimitMsg);
              }
            },
            err => {
              // this.loadingProvider.hide();
              // this.alertProvider.showToast("Type Miss Match Error");
            }
          );
        },
        err => {
          // this.loadingProvider.hide();
          // this.alertProvider.showToast(JSON.stringify(err));
        }
      );
    });
  }

  // Upload event photo message and return a promise as url.
  uploadeventPhoto(sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.sourceType = sourceType;
      // this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera
        .getPicture(this.photoMessageOptions)
        .then(imageData => {
          // Process the returned imageURI.
          let imgBlob = this.imgURItoBlob(
            "data:image/jpeg;base64," + imageData
          );
          let metadata = {
            contentType: imgBlob.type
          };
          // Generate filename and upload to Firebase Storage.
          firebase
            .storage()
            .ref()
            .child("events/" + this.generateFilename())
            .put(imgBlob, metadata)
            .then(snapshot => {
              // URL of the uploaded image!
              let url = snapshot.metadata.downloadURLs[0];
              let metadata = {
                url: url,
                size: imgBlob.size,
                type: imgBlob.type
              };
              // this.loadingProvider.hide();
              resolve(metadata);
            })
            .catch(error => {
              // this.loadingProvider.hide();
              // this.alertProvider.showErrorMessage('image/error-image-upload');
            });
        })
        .catch(error => {
          // this.loadingProvider.hide();
        });
    });
  }

  // Upload event photo message and return a promise as url.
  uploadtxclusivesPhoto(sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.sourceType = sourceType;
      // this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera
        .getPicture(this.photoMessageOptions)
        .then(imageData => {
          // Process the returned imageURI.
          let imgBlob = this.imgURItoBlob(
            "data:image/jpeg;base64," + imageData
          );
          let metadata = {
            contentType: imgBlob.type
          };
          // Generate filename and upload to Firebase Storage.
          firebase
            .storage()
            .ref()
            .child("txclusives/" + this.generateFilename())
            .put(imgBlob, metadata)
            .then(snapshot => {
              // URL of the uploaded image!
              let url = snapshot.metadata.downloadURLs[0];
              let metadata = { url: url, size: imgBlob.size };
              // this.loadingProvider.hide();
              resolve(metadata);
            })
            .catch(error => {
              // this.loadingProvider.hide();
              // this.alertProvider.showErrorMessage('image/error-image-upload');
            });
        })
        .catch(error => {
          // this.loadingProvider.hide();
        });
    });
  }

  uploadDocument(): Promise<any> {
    return new Promise(resolve => {
      // this.loadingProvider.show();
      this.camera.getPicture(this.documentMessageOptions).then(
        data => {
          let docUrl = "file://" + data;
          let x = docUrl.split("/");
          let filepath = docUrl.substring(0, docUrl.lastIndexOf("/"));
          let name = x[x.length - 1];
          if (
            name.substring(name.lastIndexOf(".")).toLowerCase() == ".pdf" ||
            name.substring(name.lastIndexOf(".")).toLowerCase() == ".doc" ||
            name.substring(name.lastIndexOf(".")).toLowerCase() == "docx"
          ) {
            this.file.readAsArrayBuffer(filepath, name).then(success => {
              let blob = new Blob([success]);
              // let timestamp = (Math.floor(Date.now() / 1000)).toString();

              let storageRef = firebase.storage().ref();
              let type;
              if (
                name.substring(name.lastIndexOf(".")).toLowerCase() == ".pdf"
              ) {
                type = "application/pdf";
              }
              if (
                name.substring(name.lastIndexOf(".")).toLowerCase() == ".docx"
              ) {
                type =
                  "application/vnd.openxmlformats - officedocument.wordprocessingml.document";
              }
              if (
                name.substring(name.lastIndexOf(".")).toLowerCase() == ".doc"
              ) {
                type = " application/msword";
              }
              let upload = storageRef
                .child(
                  "documents/" +
                    this.generateFilenameWithExt(
                      name.substring(name.lastIndexOf("."))
                    )
                )
                .put(blob, { contentType: type });
              upload.on(
                "state_changed",
                snapshot => {
                  let progress =
                    (upload.snapshot.bytesTransferred /
                      upload.snapshot.totalBytes) *
                    100;
                  //  let process = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                },
                err => {
                  console.log("err=>", err);
                  // this.loadingProvider.hide();
                },
                () => {
                  // this.loadingProvider.hide();
                  resolve({ url: upload.snapshot.downloadURL, name: name });
                }
              );
            });
          } else {
            // this.loadingProvider.hide();
            // this.alertProvider.showToast("only Documents's are  allowed");
          }
        },
        err => {
          // this.loadingProvider.hide();
          console.log("Media Err = " + err);
        }
      );
    });
  }

  eventProfileMediaHandler(): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.loadingProvider.show();
      this.camera.getPicture(this.documentMessageOptions).then(
        data => {
          let fileUrl = "file://" + data;
          let limitExid: boolean = false;
          let x = fileUrl.split("/");
          let filepath = fileUrl.substring(0, fileUrl.lastIndexOf("/"));
          let name = x[x.length - 1];
          let extFile = name.substring(name.lastIndexOf(".")).toLowerCase();
          let image =
            extFile == ".jpg" ||
            extFile == ".jpeg" ||
            extFile == ".png" ||
            extFile == ".bmp";
          let video =
            extFile == ".m4v" ||
            extFile == ".avi" ||
            extFile == ".mpg" ||
            extFile == ".mp4";
          let gif = extFile == ".gif";
          //if (name.substring(name.lastIndexOf('.')) == '.pdf' || name.substring(name.lastIndexOf('.')) == '.doc' || name.substring(name.lastIndexOf('.')) == "docx") {
          if (image || video || gif) {
            this.file.resolveLocalFilesystemUrl(fileUrl).then(fileEntry => {
              fileEntry.getMetadata(metadata => {
                if (metadata.size > 20295261) {
                  limitExid = true;
                } else {
                  limitExid = false;
                }
              });
            });
            if (!limitExid) {
              this.file.readAsArrayBuffer(filepath, name).then(
                success => {
                  let blob = new Blob([success]);
                  let storageRef = firebase.storage().ref();
                  let type;
                  let content;
                  if (image) {
                    type = "image/jpeg";
                    content = "image";
                  }
                  if (
                    name.substring(name.lastIndexOf(".")) == ".m4v" ||
                    name.substring(name.lastIndexOf(".")) == ".avi" ||
                    name.substring(name.lastIndexOf(".")) == ".mpg" ||
                    name.substring(name.lastIndexOf(".")) == ".mp4"
                  ) {
                    type = "video/mp4";
                    content = "video";
                  }
                  if (name.substring(name.lastIndexOf(".")) == ".gif") {
                    type = "image/gif";
                    content = "image";
                  }
                  let upload = storageRef
                    .child(
                      "events/" +
                        this.generateFilenameWithExt(
                          name.substring(name.lastIndexOf("."))
                        )
                    )
                    .put(blob, { contentType: type });
                  upload.on(
                    "state_changed",
                    snapshot => {
                      let progress =
                        (upload.snapshot.bytesTransferred /
                          upload.snapshot.totalBytes) *
                        100;
                      //  let process = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                    },
                    err => {
                      // this.loadingProvider.hide();
                      reject(true);
                    },
                    () => {
                      // this.loadingProvider.hide();
                      resolve({
                        url: upload.snapshot.downloadURL,
                        name: name,
                        type: content
                      });
                    }
                  );
                },
                err => {
                  // this.loadingProvider.hide();
                  reject(true);
                }
              );
            } else {
              // this.loadingProvider.hide();
              // this.alertProvider.showToast(Constants.errorMessages.sizeLimitMsg);
            }
          } else {
            // this.loadingProvider.hide();
            // this.alertProvider.showToast("only Media File are allowed");
          }
        },
        err => {
          // this.loadingProvider.hide();
          console.log("Media Err = " + err);
        }
      );
    });
  }
}
