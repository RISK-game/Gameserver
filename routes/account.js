/*
 * This is the logic for handeling accounts.
 * This provides an API to login, register and 
 * check values.
*/

var Router = require('express').Router();
var config = require('./../config.js');
var user = require('./../models/user.js');
var bcrypt = require('bcrypt-nodejs');



module.exports = function(mongoose, log){
  var jwt = require('./../middleware/jwt.js')(config.secretToken, log);  
  Router.post('/register', function(req, res){
    var rb = req.body;
    var rm = {
      success:true,
      username:'',                //'Sorry, bill gates is already spoken for',
      email:'',                   //'joe@biden.ru',
      password:'',                //'"Password" is not a good password',
      server:'',                  //'Ain\'t no problem like a server problem'
    }
    log.info('The body is \n' + JSON.stringify(req.body, null, 2));
    if (!rb.username || rb.username.length < 4 || exists({username:rb.username})){
      rm.success = false;
      rm.username = 'Username is already in use';
    }

    if (!rb.email || exists({email:rb.email})){
      rm.success = false;
      rm.email = 'An account is already registerd to time email. Try resetting the password or call 911';
    }

    // Check password
    if (!rb.password || rb.password.length < 8 || rb.password.toLowerCase() === rb.password || rb.password.toUpperCase() === rb.password){
      rm.success = false;
      rm.password = 'Password did not follow the standards';
    }

    if (!rm.success){
      return res.json(rm);
    }

    // Well for now it's good enough to register now.
    var userToBe  = new user.model({
      username: rb.username,
      password: bcrypt.hashSync(rb.password),
      email: rb.email,
      verifyToken: genRandomToken()
    });

    userToBe.save(function(err){
      if (err){
        log.warn(err);
        rm.success = false;
        rm.server = 'Ain\'t no problem like a server problem';
      }
      res.json(rm);
    });
  });

  Router.post('/login', function(req, res){
    var rb = req.body;
    var rm = {
      jwt:'',
      message:''
    };

    if (!rb.email || !rb.password) {
      rm.message = 'You need to enter both email and password to login';
      return res.json(rm);
    }
    
    user.model.findOne({email:rb.email}, function(err, obj){
      if (err) {
        // We made a boo boo
        // Email probably does not exist, lets blaim it on  that
        rm.message = 'Email was incorrect';
        return res.json(rm);
      }
      if (bcrypt.compareSync(rb.password, obj.password)){
        // Create the JWT an send it back.
        rm.jwt = jwt.signUser(obj.email, Date.now() + 1000 * 60 * 60 * 24 * 30, {username:obj.username});
        rm.message = 'Success! You remembered your password!';
        return res.json(rm);
      } else {
        rm.message = 'Incorrect password';
        return res.json(rm);
      }
      
    });
    
    return false;
  });
  
  var exists = function(query){
    user.model.find(query, function(err, user){ return !(err || user.length == 0); });
  };

  var genRandomToken = function(){
    var text = '';
    for(var i = 0; i < 20; i++)
      text += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.random() * 62);
    return text;
  };

  return Router;
};
