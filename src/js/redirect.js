'use strict';


function redirect_log(color, messageContents, data) {
  console.colourLog("#00F", color, messageContents, data);
}

var deregister = undefined;
function showProgress() {
  if (deregister) {
    deregister();
    deregister = null;
  }
  $("#statusBar").show();
}
function hideProgress(on_move) {
  deregister = on_move;
  $("#statusBar").hide();
}

function render_icons() {
  fb.path("users").once("value", function (data) {
    var users = data.val();
    $(".user-icon").each(function(_, item) {
      var id = item.dataset["id"];
      const jq_item = $(item);
      const user_data = users[id];
      jq_item.css("background-image", "url(" + user_data["image"] + ")");
      jq_item.attr("title", user_data["name"])
    });
    $(".username-auto").each(function (_, item) {
      var id = item.dataset["id"];
      const jq_item = $(item);
      const user_data = users[id];
      jq_item.text(user_data["name"]);
    })
  });
}
function load_error(_, message) {
  $("#page-content").html("<h1>" + message + "</h1>");
  hideProgress();
}

function redirect(page, contents, id) {
  redirect_log("#F00","Render started", [page, contents]);
  $("#page-content").html(CTF.pages[page](contents));
  redirect_log("#F00","Render completed ");
  var tail = !!id ? page + "/" + id : page;
  history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + tail + "/");
  componentHandler.upgradeDom();
}

function load_login() {
  redirect_log("#0F0","Login navigation started");
  showProgress();
  redirect("login");
  var unsubscribe = fb.authUpdate(function (user) {
    if (user) {
      unsubscribe();
      load_index();
    }
  });
  $("#google-login").click(fb.googleLogin);
  $("#github-login").click(fb.githubLogin);
  hideProgress();
}

function close_draw() {
  $('.mdl-layout')[0].MaterialLayout.toggleDrawer();
}

function load_index() {
  redirect_log("#0F0","Index navigation started");
  showProgress();
  redirect("index", null);
  hideProgress();
}

function load_users() {
  redirect_log("#0F0","Users navigation started");
  showProgress();
  var usersNode = fb.path('users');
  var listener = function(snapshot) {
    const value = snapshot.val();
    if (value) {
      var users = Object.values(value);
      redirect("users", {"users": users});
      $(".card-title").each(function (_, item) {
        var current = $(item);
        current.css("background", "url(" + current.attr("data-background") + ") center / cover")
      })
    } else {
      $("#page-content").html("<h2>No users</h2>");
    }
  };
  $(".user-card").each(function(_, item) {
    var id = item.dataset["id"];
    const jq_item = $(item);
    jq_item.click(function () {
      load_user(id);
    })
  });
  var after = usersNode.on('value', listener);
  hideProgress(function () {
    usersNode.off("value", listener);
  });
}

function load_user(user_id) {
  redirect_log("#0F0","User navigation started");
  showProgress();
  var usersNode = fb.path('users', user_id);
  var listener = function(snapshot) {
    const value = snapshot.val();
    if (value) {
      redirect("user", {"user": value});
    } else {
      $("#page-content").html("<h2>No such user</h2>");
    }
  };
  var after = usersNode.on('value', listener);
  hideProgress(function () {
    usersNode.off("value", listener);
  });
}

function load_challenges() {
  redirect_log("#0F0","Challenges navigation started");
  showProgress();

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

  var challengesNode = fb.path('challenges');
  var challengesListener = function (snapshot) {
    challengesData = snapshot.val();
    renderUI();
  };

  var usersNode = fb.path("memberships");
  var usersListener = function (snapshot) {
    usersData = snapshot.val();
    renderUI();
  };

  challengesNode.on('value', challengesListener);
  usersNode.on('value', usersListener);
  hideProgress(function () {
    challengesNode.off("value", challengesListener);
    usersNode.off("value", usersListener);
  });
}


function load_logout() {
  redirect_log("#0F0","Logout navigation started");
  showProgress();
  var temp = fb.authUpdate(function (user) {
    if (!user) {
      temp();
      load_login();
    }
  });
  fb.logout();
  hideProgress();
}

function load_challenge(challenge_id) {
  redirect_log("#0F0","Loading challenge");
  showProgress();

  var challengeNode = fb.path('challenges', challenge_id);
  var membersNode = fb.path('memberships', challenge_id);
  var filesNode = fb.path('files', challenge_id);
  var messagesNode = fb.path('messages', challenge_id);

  var challengeData = undefined;
  var membersData = undefined;
  var filesData = undefined;
  var messagesData = undefined;

  function renderUI() {
    const currentUserId = fb.user.uid;
    if (all_defined(challengeData, membersData, filesData, messagesData)) {
      redirect("challenge", {"challenge": challengeData, "users": membersData, "files": filesData, "messages": messagesData}, challenge_id);
      render_icons();
      var mi = $("#messageInput");
      $("#send").click(function () {
        var text = mi.val();
        messagesNode.push({"user": currentUserId, "message": text, "created": fb.now});
        mi.val("");
      });
      var join = $("#join");
      join.click(function () {
        membersNode.child(currentUserId).set(true);
      });
      if (currentUserId in membersData) {
        join.attr("disabled", true);
      }
      var solved = $("#solve");
      if (challengeData["status"] === "solved") {
        solved.attr("disabled", true);
      }
      solved.click(function () {
        challengeNode.child("status").set("solved");
      });
      var dialogue = $("#dialog")[0];
      $("#upload").click(function () {
        dialogue.showModal();
      });
      $("#upload_close").click(function () {
        dialogue.close()
      });
      $("#upload_upload").click(function () {
        var file = $("#file-input")[0].files[0];
        var challengeDataNode = firebase.storage().ref().child(challenge_id).child(file.name);
        var task = challengeDataNode.put(file);
        task.on('state_changed', console.log);
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

  hideProgress(function () {
    challengeNode.off('value', challengeListener);
    membersNode.off('value', membersListener);
    filesNode.off('value', filesListener);
    messagesNode.off('value', messagesListener);
  });
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
      case "user":
        load_user(id);
        return;
    }
  }
  load_error(undefined, "Page not found");
}

window.onpopstate = function (event) {
  redirect_to_url(event.currentTarget.location.pathname);
};

$(function () {
  var unsubscribe = fb.authUpdate(function (user) {
    unsubscribe();
    if (user) {
      redirect_to_url();
    } else {
      load_login();
    }
  });
});
