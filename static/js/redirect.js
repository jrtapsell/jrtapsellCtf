function showProgress() {
  $("#statusBar").show();
}
function hideProgress() {
  $("#statusBar").hide();
}

function redirect(page, contents) {
  var url = 'static/templates/' + page + '.html';
  console.log("Redirect", url, page, contents);
  $.get(url, function (data) {
    if (data.startsWith("<!--TEMPLATE-->")) {
      console.log("Page found");
      var template = Handlebars.compile(data);
      $("#page-content").html(template(contents));
    } else {
      console.log("Page not found");
      $("#page-content").html("<h1>404 Page Not Found</h1>");
    }
    hideProgress();
    history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + page);
    $("title").text(page);
    $("#title").text(page);
  }, 'html');
}

function load_login() {
  showProgress();
  redirect("login");
}

function close_draw() {
  $('.mdl-layout')[0].MaterialLayout.toggleDrawer();
}

function load_index() {
  showProgress();
  redirect("index", null);
}

function load_users() {
  showProgress();
  var starCountRef = firebase.database().ref('/users');
  starCountRef.on('value', function(snapshot) {
    var users = Object.values(snapshot.val());
    console.log("USERS", users);
    redirect("users", {"users": users});
  });
}

function load_challenges() {
  showProgress();
  var teamName = "342de321-645a-4024-a376-8ee2d2e5cab8";
  var starCountRef = firebase.database().ref('/challenges').child(teamName);
  starCountRef.on('value', function (snapshot) {
    var data = Object.values(snapshot.val());
    console.log("Challenges", data);
    redirect("challenges", {"challenges":data});
  });
}


function load_logout() {
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