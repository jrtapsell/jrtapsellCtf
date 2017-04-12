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

function render_closure(contents, page) {
  function render(data) {
    if (data.startsWith("<!--TEMPLATE-->")) {
      var template = Handlebars.compile(data);
      $("#page-content").html(template(contents));
    } else {
      load_failure(_, "Page is not a known page");
    }
    hideProgress();
    history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + page);
  }
  return render;
}

function redirect(page, contents) {
  if (previousUpdater) {
    console.log("Removing old register");
    previousUpdater();
    previousUpdater = undefined;
  } else {
    console.log("No old register");
  }
  var url = '/static/templates/' + page + '.html';
  console.log("Starting render", url, page, contents);
  $.ajax({
      "url":url,
      "success": render_closure(contents, page),
      "error": load_failure,
      "dataType": 'html'
  });
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
  };
  var after = challengesNode.on('value', listener);
}


function load_logout() {
  console.log("Logout navigation started");
  showProgress();
  redirect("logout", null);
}

function load_challenge(challenge_id) {
  console.log("Loading challenge");
  showProgress();
  var challengeNode = firebase.database().ref('/challenges').child(challenge_id);
  var listener = function (snapshot) {
    var data = snapshot.val();;
    redirect("challenge", data);
    previousUpdater =  function() {
      challengeNode.off("value", listener);
    };
  };
  var after = challengeNode.on('value', listener);
}

function redirect_to_url() {
  var pathname = window.location.pathname;
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
    default:
      load_failure(undefined, "404, Page not found");
  }
}