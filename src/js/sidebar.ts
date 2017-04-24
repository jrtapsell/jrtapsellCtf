/// <reference path="myTypes.ts" />

$(function () {
  function toggleDraw(){(
    <MaterialLayout>$('.mdl-layout')[0]).MaterialLayout.toggleDrawer();
  }

  $("#nav-challenges").click(function () {
    router.challenges();
    toggleDraw();
  });
  $("#nav-users").click(function () {
    router.users();
    toggleDraw();
  });
  $("#nav-logout").click(function () {
    router.logout();
    toggleDraw();
  });
  $("#nav-link").click(function () {
    router.link();
    toggleDraw();
  });
});