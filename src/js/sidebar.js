$(function () {
  $("#nav-challenges").click(function () {
    load_challenges();
    close_draw();
  });
  $("#nav-users").click(function () {
    load_users();
    close_draw()
  });
  $("#nav-logout").click(function () {
    load_logout();
    close_draw();
  });
});