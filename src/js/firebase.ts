/// <reference path="myTypes.ts" />

function firebase_log(color, messageContents, data?) {
  console.colourLog("#F00", color, messageContents, data);
}

class WrappedNode {
  private node;
  private text;
  constructor(node, text) {
    this.node = node;
    this.text = text;
  }

  child(name: string): WrappedNode {
    return new WrappedNode(this.node.child(name), this.text + name + "/")
  }

  on(type, callback) {
    firebase_log("#FF0", "Requested callback on " + this.text);
    return this.node.on(type, callback);
  }

  off(type, callback) {
    firebase_log("#0FF", "Disconnecting callback on " + this.text);
    return this.node.off(type, callback);
  }

  once(type, callback) {
    firebase_log("#F0F", "Single use callback on " + this.text);
    return this.node.once(type, callback);
  }

  push(data?) {
    firebase_log("#FFF", "Pushing data on " + this.text, data);
    return this.node.push(data);
  }

  set(data) {
    firebase_log("#00F", "Setting data on " + this.text, data);
    return this.node.set(data);
  }
}

class FirebaseWrapper {
  constructor(firebase) {
    firebase_log("#F00", "Initialising firebase");
    firebase.initializeApp({
      apiKey: "AIzaSyD-b_XD6-Eoe-hQnSsIyHt_s2P2bexLu_E",
      authDomain: "jrtapsell-ctf.firebaseapp.com",
      databaseURL: "https://jrtapsell-ctf.firebaseio.com",
      projectId: "jrtapsell-ctf",
      storageBucket: "jrtapsell-ctf.appspot.com",
      messagingSenderId: "706159874560"
    });
    firebase_log("#F00", "Initialised firebase");

    this.now = firebase.database.ServerValue.TIMESTAMP;
    this.firebase = firebase;
    this.authUpdate((user) => {
      this.user = user;
    });
  }

  now;
  user;
  private firebase;

    /* Gets a node with a path made of the arguments to this method. */
    path(...data: string[]): WrappedNode {
      var ret = this.firebase.database().ref("/");
      var text = "/";
      for (var name of data) {
        text += name;
        text += "/";
        ret = ret.child(name);
      }
      firebase_log("#0F0", "Created node " + text);
      return new WrappedNode(ret, text);
    }

    /** Calls the callback when the auth state changes. */
    authUpdate(callback: (Object) => void):() => void {
      return this.firebase.auth().onAuthStateChanged(callback);
    }

    /** Called on the next auth change. */
    authOnce(callback) {
      var unsubscribe = this.firebase.auth().onAuthStateChanged((user) => {
        unsubscribe();
        callback(user);
      });
    }

    /** Google popup login. */
    googleLogin() {
      this.firebase.auth().signInWithPopup(new this.firebase.auth.GoogleAuthProvider());
    }

    /** GitHub popup login. */
    githubLogin() {
      this.firebase.auth().signInWithPopup(new this.firebase.auth.GithubAuthProvider());
    }
    /** Logout the current user. */
    logout() {
      firebase_log("#F00", "Logging out");
      this.firebase.auth().signOut();
    }
}

var fb = new FirebaseWrapper(firebase);
firebase = undefined;

$(() => {
  fb.authUpdate((user) => {
    if (user) {
      $("#login-status").html("Hello, " + user.displayName + ", <a href='/logout/'>Logout</a>");
      $(".mdl-layout__drawer-button").show();
      fb.path("users", user.uid).set({
        image: user.photoURL,
        name: user.displayName,
        uid: user.uid,
        email: user.email,
        provider: user.providerData[0].providerId
      });
    } else {
      $("#login-status").text("I don't know you");
      $(".mdl-layout__drawer-button").hide();
    }
  });
});