Handlebars.registerHelper( "setTitle", function ( title ){
  $("title").text(title);
  $("#title").text(title);
  $(".title").text(title);
});

Handlebars.registerHelper("userIcon", function (userId) {
  return new Handlebars.SafeString("<div>" + Handlebars.Utils.escapeExpression(userId) + "</div>");
});