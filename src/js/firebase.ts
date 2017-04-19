/// <reference path="myTypes.ts" />

function firebase_log(color, messageContents, data?) {
    console.colourLog("#F00", color, messageContents, data);
}

class WrappedNode {
    private node;
    private text;

    constructor(node, text: string) {
        this.node = node;
        this.text = text;
    }

    child(name:string):WrappedNode {
        return new WrappedNode(this.node.child(name), this.text + name + "/")
    }

    on(type: callbackTypes, callback: (any) => void) {
        firebase_log("#FF0", "Requested callback on " + this.text);
        return this.node.on(type, callback);
    }

    off(type: callbackTypes, callback: (any) => void) {
        firebase_log("#0FF", "Disconnecting callback on " + this.text);
        return this.node.off(type, callback);
    }

    once(type: callbackTypes, callback: (any) => void) {
        firebase_log("#F0F", "Single use callback on " + this.text);
        return this.node.once(type, callback);
    }

    push(data?: any) {
        firebase_log("#FFF", "Pushing data on " + this.text, data);
        return this.node.push(data);
    }

    set(data: any) {
        firebase_log("#00F", "Setting data on " + this.text, data);
        return this.node.set(data).catch((error) => {
            console.error("Set failed for node", this.text, {
                "nodeName":this.text,
                "data":data,
                "user":fb.user,
                "error": error});
        });
    }
}

class FirebaseWrapper {
    constructor() {
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
        this.authUpdate((user) => {
            this.user = user;
        });
    }

    now;
    user : FirebaseUser;

    /* Gets a node with a path made of the arguments to this method. */
    path(...data:string[]):WrappedNode {
        var ret = firebase.database().ref("/");
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
    authUpdate(callback:(FirebaseUser) => void):() => void {
        return firebase.auth().onAuthStateChanged(callback);
    }

    /** Called on the next auth change. */
    authOnce(callback: (FirebaseUser) => void) {
        var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            unsubscribe();
            callback(user);
        });
    }

    /** Google popup login. */
    googleLogin(): void {
        firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    /** GitHub popup login. */
    githubLogin(): void {
        firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
    }

    /** Logout the current user. */
    logout(): void {
        firebase_log("#F00", "Logging out");
        firebase.auth().signOut();
    }
}

var fb = new FirebaseWrapper();

$(() => {
    fb.authUpdate((user: FirebaseUser) => {
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