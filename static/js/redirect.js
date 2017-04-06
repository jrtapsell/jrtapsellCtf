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
      hideProgress();
      history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + page);
      $("title").text(page);
      $("#title").text(page);
    } else {
      console.log("Page not found");
    }
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
  redirect("challenges", null);
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