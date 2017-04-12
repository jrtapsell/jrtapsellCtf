'use strict';
Handlebars.registerHelper( "setTitle", function ( title ){
  $("title").text(title);
  $("#title").text(title);
  $(".title").text(title);
});