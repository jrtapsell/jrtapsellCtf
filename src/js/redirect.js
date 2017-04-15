'use strict';
var previousUpdater = undefined;

function showProgress() {
  $("#statusBar").show();
}
function hideProgress() {
  $("#statusBar").hide();
}

function render_icons() {
  $(".user-icon").each(function(_, item) {
    firebase.database().ref("/users").child(item.dataset["id"]).child("image").once("value", function (data) {
      $(item).css("background-image", "url(" + data.val() + ")");
    });
  })
}
function load_failure(_, message) {
  $("#page-content").html("<h1>Page not found</h1>");
}

function redirect(page, contents, id) {
  if (previousUpdater) {
    console.log("Removing old register");
    previousUpdater();
    previousUpdater = undefined;
  } else {
    console.log("No old register");
  }
  console.log("Render started", page, contents);
  $("#page-content").html(CTF.pages[page](contents));
  console.log("Render completed ");
  hideProgress();
  var tail = !!id ? page + "/" + id : page;
  history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + tail + "/");
  componentHandler.upgradeDom();
}

function load_login() {
  console.log("Login navigation started");
  showProgress();
  redirect("login");
  var unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      unsubscribe();
      load_index();
    }
  });
  $("#google-login").click(function () {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  });

  $("#github-login").click(function () {
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
  });
}

function close_draw() {
  $('.mdl-layout')[0].MaterialLayout.toggleDrawer();
}

function load_index() {
  console.log("Index navigation started");
  showProgress();
  redirect("index", null);
}

function load_users() {
  console.log("Users navigation started");
  showProgress();
  var usersNode = firebase.database().ref('/users');
  var listener = function(snapshot) {
    const value = snapshot.val();
    if (value) {
      var users = Object.values(value);
      console.log("USERS", users);
      redirect("users", {"users": users});
      previousUpdater = function () {
        usersNode.off("value", listener);
      };
      $(".card-title").each(function (_, item) {
        var current = $(item);
        current.css("background", "url(" + current.attr("data-background") + ") center / cover")
      })
    } else {
      $("#page-content").html("<h2>No users</h2>");
    }
  };
  var after = usersNode.on('value', listener);
}

function load_challenges() {
  console.log("Challenges navigation started");
  showProgress();

  const database = firebase.database();

  function renderUI() {
    if (all_defined(challengesData, usersData)) {
      var temp = {};
      $.each(challengesData, function(key, value) {
        temp[key] = value;
        temp[key]["users"] = usersData[key];
      });
      redirect("challenges", {"challenges": temp});
      $(".challenge-row").click(function (event) {
        load_challenge(event.currentTarget.dataset["id"]);
      });
      render_icons();
    } else {
      $("#page-content").html("<h2>No challenges</h2>");
    }
  }

  var challengesData = undefined;
  var usersData = undefined;

  var challengesNode = database.ref('/challenges');
  var challengesListener = function (snapshot) {
    challengesData = snapshot.val();
    renderUI();
  };

  var usersNode = database.ref("/memberships");
  var usersListener = function (snapshot) {
    usersData = snapshot.val();
    renderUI();
  };

  previousUpdater = function () {
    challengesNode.off("value", challengesListener);
    usersNode.off("value", usersListener);
  };
  challengesNode.on('value', challengesListener);
  usersNode.on('value', usersListener);
}


function load_logout() {
  console.log("Logout navigation started");
  showProgress();
  var temp = firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      temp();
      load_login();
    }
  });
  firebase.auth().signOut();
}

function load_challenge(challenge_id) {
  console.log("Loading challenge");
  showProgress();

  const db = firebase.database();
  var challengeNode = db.ref('/challenges').child(challenge_id);
  var membersNode = db.ref('/memberships').child(challenge_id);
  var filesNode = db.ref('/files').child(challenge_id);
  var messagesNode = db.ref('/messages').child(challenge_id);

  var challengeData = undefined;
  var membersData = undefined;
  var filesData = undefined;
  var messagesData = undefined;

  function renderUI() {
    const currentUserId = firebase.auth().currentUser.uid;
    if (all_defined(challengeData, membersData, filesData, messagesData)) {
      redirect("challenge", {"challenge": challengeData, "users": membersData, "files": filesData, "messages": messagesData}, challenge_id);
      render_icons();
      var mi = $("#messageInput");
      $("#send").click(function () {
        var text = mi.val();
        messagesNode.push({"user": firebase.auth().currentUser.uid, "message": text, "created": firebase.database.ServerValue.TIMESTAMP});
        mi.val("");
      });
      const join = $("#join");
      const solved = $("#solve");
      join.click(function () {
        membersNode.child(currentUserId).set(true);
      });
      if (currentUserId in membersData) {
        join.attr("disabled", true);
      }
      if (challengeData["status"] === "solved") {
        solved.attr("disabled", true);
      }
      solved.click(function () {
        challengeData.child("status").set("solved");
      })
    }
  }

  var challengeListener = function (snapshot) {
    challengeData = snapshot.val();
    renderUI();
  };

  var membersListener = function (snapshot) {
    membersData = snapshot.val();
    renderUI();
  };

  var filesListener = function (snapshot) {
    filesData = snapshot.val();
    renderUI();
  };


  var messagesListener = function (snapshot) {
    messagesData = snapshot.val();
    renderUI();
  };

  challengeNode.on('value', challengeListener);
  membersNode.on('value', membersListener);
  filesNode.on('value', filesListener);
  messagesNode.on('value', messagesListener);

  previousUpdater = function () {
    challengeNode.off('value', challengeListener);
    membersNode.off('value', membersListener);
    filesNode.off('value', filesListener);
    messagesNode.off('value', messagesListener);
  }
}

function redirect_to_url(pathname) {
  pathname = !!pathname ? pathname : window.location.pathname;
  switch (pathname) {
    case "":
    case "/":
      load_index();
      return;
    case "/users":
    case "/users/":
      load_users();
      return;
    case "/challenges":
    case "/challenges/":
      load_challenges();
      return;
    case "/logout":
    case "/logout/":
      load_logout();
      return;
  }
  const match = pathname.match("\/([^/]*)\/([^/]+)/?");
  if (match) {
    var pageName = match[1];
    var id = match[2];
    switch (pageName) {
      case "challenge":
        load_challenge(id);
        return;
    }
  }
  load_failure(undefined, "404, Page not found");
}

window.onpopstate = function (event) {
  redirect_to_url(event.currentTarget.location.pathname);
};