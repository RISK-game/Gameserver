/*
 * Get information from config.json.
 * The file is sopose to be located 
 * in the folder above.
*/
var config        = require('./config.js');
var express       = require('express');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var winston       = require('winston');
var morgan        = require('morgan');
var mongoose      = require('mongoose');

var log = new (winston.Logger)({
  transports:[
    new (winston.transports.Console)({colorize:true}),
    new (winston.transports.File)({name:'Log File', filename:'logs/gameserver.log'})
  ]
});

var jwt = require('./middleware/jwt.js')(config.secretToken, log);


log.info('Connecting to mongodb...');
mongoose.connect(config.db);

var app = express();

app = addMiddlewares(app);
app = addRoutes(app);

log.info('Starting HTTP server...');
var server = app.listen(config.port, config.host, function () {
  var host = server.address().address
  var port = server.address().port;
  log.info('Example app listening at http://%s:%s', host, port);
});



/**
 * Add middlewares
 */
function addMiddlewares(app) {
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));
  

  // Allow other websites to make AJAX request to this REST service via AJAX
  // Source: http://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
  app.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
      // Pass to next layer of middleware
      next();
  });
  
  app.use(morgan('combined'));
  
  
  /*
   * Authenticate the users with the jwt 
   * passed along.
   * This will save the validated information in
   * the request object.
   */
  app.use(jwt.auth);

  return app;
}


/**
 * Add all routes to the app
 */
function addRoutes(app) {
  app.use('/acc', require('./routes/account.js')(mongoose, log));
  app.use('/picture', require('./routes/pictures.js')(mongoose, log));

  // Load index.html which will start the Angular.js app
  app.all('/', function (req, res, next) {
    if (req.jwt.isAuthed)
      return res.send('Authentiated');
    res.json({foo:'bar'});
  });

  return app;
}