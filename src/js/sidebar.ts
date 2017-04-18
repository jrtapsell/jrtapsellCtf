/// <reference path="myTypes.ts" />

$(function () {
  var layout = <MaterialLayout>$('.mdl-layout')[0];
  var drawer = layout.MaterialLayout;
  
  $("#nav-challenges").click(function () {
    router.challenges();
    drawer.toggleDrawer();
  });
  $("#nav-users").click(function () {
    router.users();
    drawer.toggleDrawer();
  });
  $("#nav-logout").click(function () {
    router.logout();
    drawer.toggleDrawer();
  });
});