function redirect(page, contents) {
  $("#statusBar").show();
  $.get('static/templates/' + page + '.html', function (data) {
    var template = Handlebars.compile(data);
    $("#page-content").html(template(contents));
  }, 'html');
  history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + page)
  $("title").text(page);
  $("#title").text(page);
  $("#statusBar").hide();
}

function redirect_to_login() {
  redirect("login");
}

function needs_login() {
  firebase.getAuth()
}
function close_draw() {
  $('.mdl-layout')[0].MaterialLayout.toggleDrawer();
}

function redirect_to_url() {
  switch (window.location.pathname) {
    case "":
    case "/":
      redirect("index", null);
      break;
    case "/users":
      redirect("users", null);
      break;
    case "/challenges":
      redirect("challenges", null);
      break;
  }
}