Handlebars.registerHelper( "setTitle", function ( title ){
  $("title").text(title);
  $("#title").text(title);
  $(".title").text(title);
});

Handlebars.registerHelper("userIcon", function (userId) {
  const escaped_id = Handlebars.Utils.escapeExpression(userId);
  return new Handlebars.SafeString("<div class='user-icon' data-id='" + userId + "'></div>");
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
  return date.getDay() + "/"  + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes();
});