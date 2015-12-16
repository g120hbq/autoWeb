require('coffee-script/register');
var http = require('./server');
require('pm').createWorker().ready(function (socket, port) {
  http.emit('connection', socket);
});
