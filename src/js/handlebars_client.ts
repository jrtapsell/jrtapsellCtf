/// <reference path="myTypes.ts" />

Handlebars.registerHelper("setTitle", function (title) {
  $("title").text(title);
  $("#title").text(title);
  $(".title").text(title);
});

Handlebars.registerHelper("userIcon", function (userId) {
  var escaped_id = Handlebars.Utils.escapeExpression(userId);
  return new Handlebars.SafeString("<div class='user-icon square-icon' data-id='" + escaped_id + "'></div>");
});

Handlebars.registerHelper("reverseEach", function (context) {
  var options = arguments[arguments.length - 1];
  var ret = '';
  $.each(context, function (_, value) {
    ret = options.fn(value) + ret;
  });
  return ret;
});

Handlebars.registerHelper("timeOf", function (time) {
  var date = new Date(time);
  return date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes();
});