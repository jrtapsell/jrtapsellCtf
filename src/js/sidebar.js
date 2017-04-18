/// <reference path="myTypes.ts" />
$(function () {
    var drawer = $('.mdl-layout')[0].MaterialLayout;
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
//# sourceMappingURL=sidebar.js.map