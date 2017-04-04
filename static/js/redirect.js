function redirect(page, contents) {
  $.get('static/templates/' + page + '.html', function (data) {
    var template = Handlebars.compile(data);
    $("#page-content").html(template(contents));
  }, 'html');
  history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + page)
  $("title").text(page);
  $("#title").text(page);
}

function redirect_to_login() {
  redirect("login");
}

function needs_login() {
  firebase.getAuth()
}
function close_draw() {
  $('.mdl-layout').MaterialLayout.toggleDrawer();
}