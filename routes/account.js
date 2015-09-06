/*
 * This is the logic for handeling accounts.
 * This provides an API to login, register and 
 * check values.
*/

var Router = require('express').Router();
var config = require('./../config.js');
var user = require('./../models/user.js');

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');


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
    
    if (!isValidData('username', rb.username)){
      rm.username = 'Username did not follow our requirements';
      rm.success = false;
    }

    if (!isValidData('email', rb.email)){
      rm.username = 'Please enter a valid email.';
      rm.success = false;
    }

    if (!isValidData('password', rb.password)){
      rm.username = 'Password was not secure enough! Please try again.';
      rm.success = false;
    }

    if (!rm.success) return res.status(400).json(rm);

    if (exists({username:rb.username})){
      rm.success = false;
      rm.username = 'Username is already in use';
    }

    if (exists({email:rb.email})){
      rm.success = false;
      rm.email = 'An account is already registerd to time email.' + 
        ' Try resetting the password or call 911';
    }
    
    if (!rm.success) return res.status(416).json(rm); // Im a teapot

    // Well for now it's good enough to register now.
    // Lets create the user.
    var userToBe  = new user.model({
      username: rb.username,
      password: bcrypt.hashSync(rb.password),
      email: rb.email,
      verifyToken: genRandomToken()
    });
    
    // And then save hen.
    userToBe.save(function(err){
      if (err){
        log.warn(err);
        res.status(500);
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

    if (!isValidData('email', rb.email) || !isValidData('password', rb.password)) {
      rm.message = 'You need to enter both email and password to login';
      return res.status(400).json(rm);
    }
    
    user.model.findOne({email:rb.email}, function(err, obj){
      if (err) {
        // We made a boo boo
        // Email probably does not exist, lets blaim it on  that
        rm.message = 'Email was incorrect';
        return res.status(400).json(rm);
      }
      if (bcrypt.compareSync(rb.password, obj.password)){
        // Create the JWT an send it back.
        rm.jwt = jwt.signUser(obj.email, Date.now() + 1000 * 60 * 60 * 24 * 30, {username:obj.username});
        rm.message = 'Success! You remembered your password!';
        return res.json(rm);
      } else {
        rm.message = 'Incorrect password';
        return res.status(400).json(rm);
      }
    });
  });
  
  Router.post('/edit', function(req, res){
    // What they want to edit on the user.
    
    if (!req.jwt.isAuthed) return res.status(401).send('You need to be authorized for this action.');

    var action = req.body.action;
    var value = req.body.value;
    // Validate action and value.
    log.info('Change ' + action + ' to ' + value);
    if (['username', 'password'].indexOf(action) === -1)
      return res.status(403).send('Action not allowed');
    
    if (!isValidData(action, value))
      return res.status(400).send('Bad data sent');
    
    var data = {};
    data[action] = value;
    user.model.update({email:req.jwt.email}, data, function(err, data){
      if (err){
        // User was not updated.
        // Internal servere error. Could be user
        return res.status(500).send('Failed to update user');
      }
      // If its an email that was updated, you need to generate a new jwt
      return res.send('User updated');
    });
  });

  Router.post('/get', function(req, res){
    if (!req.jwt.isAuthed)
      return res.status(403).send('Unauthorized');
    // What data you want to get
    var action = req.body.action;
    if (['username', 'email', 'rank', 'wins', 'losses'].indexOf(action) === -1)
      return res.status(401).send('Action not allowed');
    
    user.model.findOne({email:req.jwt.email}, action, function(err, ac){
      if (err) {
        return res.status(500).send('We made an opsy..');
      }
      return res.send(''+ac[action]);
    });
  });

  var isValidData = function(type, value){
    switch (type){
      case 'email':
        return (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(value);
        break;
      case 'username':
        return (typeof value === 'string' && value.length >= 4);
        break;
      case 'password':
        return (typeof value === 'string' && value.length >= 8 &&
                value.toLowerCase() !== value && 
                value.toUpperCase() !== value &&
                !!value.match(/\d+/g));
      default:
        return false;
    }
  };

  var exists = function(query){
    user.model.find(query, function(err, user){ return !(err || user.length == 0); });
  };

  /**
   * Generates a crypto secure token. We can't use Math.random() as anyone can calculate what it will
   * generate.
   */
  var genRandomToken = function(){
    return crypto.randomBytes(64).toString('hex');
  };

  return Router;
};

