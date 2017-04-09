var previousUpdater = undefined;

function showProgress() {
  $("#statusBar").show();
}
function hideProgress() {
  $("#statusBar").hide();
}

function redirect(page, contents) {
  if (previousUpdater) {
    previousUpdater();
    previousUpdater = undefined;
  }
  var url = 'static/templates/' + page + '.html';
  console.log("Starting render", url, page, contents);
  $.get(url, function (data) {
    if (data.startsWith("<!--TEMPLATE-->")) {
      console.log("Page found");
      var template = Handlebars.compile(data);
      console.log("Compilation complete");
      $("#page-content").html(template(contents));
    } else {
      console.log("Page not template");
      $("#page-content").html("<h1>404 Page Not Found</h1>");
    }
    hideProgress();
    history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + page);
    $("title").text(page);
    $("#title").text(page);
    $(".mdl-layout-title").text(page);
  }, 'html');
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
  var after = usersNode.on('value', function(snapshot) {
    var users = Object.values(snapshot.val());
    console.log("USERS", users);
    redirect("users", {"users": users});
    previousUpdater = after;
  });
}

function load_challenges() {
  console.log("Challenges navigation started");
  showProgress();
  var teamName = "342de321-645a-4024-a376-8ee2d2e5cab8";
  var challengesNode = firebase.database().ref('/challenges').child(teamName);
  var after = challengesNode.on('value', function (snapshot) {
    var data = Object.values(snapshot.val());
    redirect("challenges", {"challenges":data});
    previousUpdater =  after;
  });
}


function load_logout() {
  console.log("Logout navigation started");
  showProgress();
  redirect("logout", null);
}

function redirect_to_url() {
  switch (window.location.pathname) {
    case "":
    case "/":
      load_index();
      break;
    case "/users":
      load_users();
      break;
    case "/challenges":
      load_challenges();
      break;
  }
}