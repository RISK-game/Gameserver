/*
 * This is the logic for handeling accounts.
 * This provides an API to login, register and 
 * check values.
*/

var Router = require('express').Router();
var user = require('./../models/user.js');
var bc = require('bcrypt-nodejs');
var crypto = require('crypto');

module.exports = function(mongose){
  
  Router.post('/register', function(req, res){
    var rb = req.body;
    var rm = {
      success:true,
      username:'',                //'Sorry, bill gates is already spoken for',
      email:'',                   //'joe@biden.ru',
      password:'',                //'"Password" is not a good password',
      server:'',                  //'Ain\'t no problem like a server problem'
    }

    if (exists({username:rb.username})){
      rm.success = false;
      rm.username = 'Username is already in use';
    }

    if (exists({email:rb.email})){
      rm.success = false;
      rm.email = 'An account is already registerd to time email. Try resetting the password or call 911';
    }

    // Check password
    if (rb.password.length < 8 || rb.password.toLowerCase() === rb.password || rb.password.toUpperCase() === rb.password){
      rm.success = false;
      rm.password = 'Password did not follow the standards';
    }

    if (!rm.success){
      return res.json(rm);
    }

    // Well for now it's good enough to register now.
    var userToBe  = new user.model({
      username: rb.username,
      password: bqrypt.hashSync(rb.password),
      email: rb.email,
      secretCode: genRandomToken(),
    });

    userToBe.save(function(err){
      if (err){
        rm.success = false;        
        rm.server = 'Ain\'t no problem like a server problem';
      }
      res.json(rm);
    });
  });
  
  var exists = function(query){
    user.model.find(query, function(err, user){ return (user.length !== 0); });
  };

  /**
   * Generates a crypto secure token. We can't use Math.random() as anyone can calculate what it will
   * generate.
   */
  var genRandomToken = function(){
    return crypto.randomBytes(64).toString('hex');
  };
};
