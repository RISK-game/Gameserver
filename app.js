/*
 * Get information from config.json.
 * The file is sopose to be located 
 * in the folder above.
*/
var config = require('./config.js');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var ew = require('express-winston');
var winston = require('winston');

var log = new (winston.Logger)({
  transports:[
    new (winston.transports.Console)({
      colorize:true
    }),
    new (winston.transports.File)({ 
      name: 'Log File',
      filename:'logs/gameserver.log'
    })
  ]
});

var app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(ew.logger({
  transports:[
    new (winston.transports.Console)({
      colorize:true
    }),
    new (winston.transports.File)({ 
      name: 'Request Log',
      filename:'logs/httpReq.log'
    })
  ]
}));

// Load index.html which will start the Angular.js app
app.get('/', function (req, res, next) {
  res.json({foo:'bar'});
});



var server = app.listen(3000, function () {
  var host = 'localhost';
  var port = server.address().port;
  log.info('Example app listening at http://%s:%s', host, port);
});
