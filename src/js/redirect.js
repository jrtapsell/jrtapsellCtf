'use strict';
var previousUpdater = undefined;

function showProgress() {
  $("#statusBar").show();
}
function hideProgress() {
  $("#statusBar").hide();
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
  console.log("Render started");
  $("#page-content").html(CTF.pages[page](contents));
  console.log("Render completed ");
  hideProgress();
  var tail = !!id ? page + "/" + id : page;
  history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + tail + "/");
}

function load_login() {
  console.log("Login navigation started");
  showProgress();
  redirect("login");
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
    var users = Object.values(snapshot.val());
    console.log("USERS", users);
    redirect("users", {"users": users});
    previousUpdater = function() {
      usersNode.off("value", listener);
    };
    $(".card-title").each(function(_,item) {
      var current = $(item);
      current.css("background", "url(" + current.attr("data-background") + ") center / cover")
    })
  };
  var after = usersNode.on('value', listener);
}

function load_challenges() {
  console.log("Challenges navigation started");
  showProgress();
  var challengesNode = firebase.database().ref('/challenges');
  var listener = function (snapshot) {
    var data = Object.values(snapshot.val());
    redirect("challenges", {"challenges":data});
    previousUpdater =  function() {
      challengesNode.off("value", listener);
    };
    $(".challenge-row").click(function(event) {
      load_challenge(event.currentTarget.dataset["id"]);
    })
  };
  var after = challengesNode.on('value', listener);
}


function load_logout() {
  console.log("Logout navigation started");
  showProgress();
  firebase.auth().signOut();
  var temp = firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      temp();
      redirect("login");
    }
  });
  redirect('login');
}

function load_challenge(challenge_id) {
  console.log("Loading challenge");
  showProgress();
  var challengeNode = firebase.database().ref('/challenges').child(challenge_id);
  var listener = function (snapshot) {
    var data = snapshot.val();
    redirect("challenge", data, challenge_id);
    previousUpdater =  function() {
      challengeNode.off("value", listener);
    };
  };
  var after = challengeNode.on('value', listener);
}

function redirect_to_url(pathname) {
  pathname = !!pathname ? pageName : window.location.pathname;
  switch (pathname) {
    case "":
    case "/":
      load_index();
      return;
    case "/users":
      load_users();
      return;
    case "/challenges":
      load_challenges();
      return;
    case "/logout":
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