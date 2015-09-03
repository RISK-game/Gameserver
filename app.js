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

mongoose.connect(config.db);

var app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(morgan('combined'));

/*
 * Authenticate the users with the jwt 
 * passed along.
 * This will save the validated information in
 * the request object.
 */

app.use(jwt.auth);

app.use('/acc', require('./routes/account.js')(mongoose, log));

// Load index.html which will start the Angular.js app
app.all('/', function (req, res, next) {
  if (req.jwt.isAuthed)
    return res.send('Authentiated');
  res.json({foo:'bar'});
});

var server = app.listen(config.port, config.host, function () {
  var host = server.address().address
  var port = server.address().port;
  log.info('Example app listening at http://%s:%s', host, port);
});
