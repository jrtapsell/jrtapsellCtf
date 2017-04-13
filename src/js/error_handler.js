window.onerror = function (messageOrEvent, source, lineno, colno, error) {
  console.log("Error detected", messageOrEvent, source, lineno, colno, error);
};