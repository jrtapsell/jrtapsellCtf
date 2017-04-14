Handlebars.registerHelper( "setTitle", function ( title ){
  $("title").text(title);
  $("#title").text(title);
  $(".title").text(title);
});

Handlebars.registerHelper("userIcon", function (userId) {
  const escaped_id = Handlebars.Utils.escapeExpression(userId);
  return new Handlebars.SafeString("<div class='user-icon' data-id='" + userId + "'></div>");
});