function showProgress() {
  $("#statusBar").show();
}
function hideProgress() {
  $("#statusBar").hide();
}

function redirect(page, contents) {
  showProgress();
  $.get('static/templates/' + page + '.html', function (data) {
    var template = Handlebars.compile(data);
    $("#page-content").html(template(contents));
    hideProgress();
  }, 'html');
  history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + page)
  $("title").text(page);
  $("#title").text(page);
}

function redirect_to_login() {
  redirect("login");
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