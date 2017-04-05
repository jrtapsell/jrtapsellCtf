function showProgress() {
  $("#statusBar").show();
}
function hideProgress() {
  $("#statusBar").hide();
}

function redirect(page, contents) {
  $.get('static/templates/' + page + '.html', function (data) {
    var template = Handlebars.compile(data);
    if (contents != null) {
      contents = contents();
    }
    $("#page-content").html(template(contents));
    hideProgress();
  }, 'html');
  history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + page)
  $("title").text(page);
  $("#title").text(page);
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
    redirect("users", {"users":JSON.stringify(snapshot)});
  });
}

function load_challenges() {
  showProgress();
  redirect("challenges", null);
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