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

  if (context && context.length > 0) {
    for (var i = context.length - 1; i >= 0; i--) {
      ret += options.fn(context[i]);
    }
  } else {
    ret = options.inverse(this);
  }

  return ret;
});