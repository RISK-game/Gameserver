/*
 * This is the logic for handeling accounts.
 * This provides an API to login, register and 
 * check values.
*/

var Router = require('express').Router();
var config = require('./../config.js');
var user = require('./../models/user.js');

var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');



module.exports = function(mongoose, log){
  var jwt = require('./../middleware/jwt.js')(config.secretToken, log);  
  
  Router.post('/register', function(req, res){
    var rb = req.body;
    var response = {
      messages: [],
    };

    log.info('The body is \n' + JSON.stringify(req.body, null, 2));
    
    var userToBe  = new user.model({
      username: rb.username,
      password: rb.password,
      email: rb.email,
      verifyToken: genRandomToken()
    });
    
    // Validation is executed when calling .save()
    // Validation errors are catched by if(err)
    userToBe.save(function(err){
      if (err) {
        log.warn(err);
        res.status(400);
        response.messages = extractMongooseValidationMessages(err);
      }

      res.json(response);
    });
  });

  Router.post('/login', function(req, res){
    var rb = req.body;
    var response = {
      jwt: '',
      messages: []
    };

    if (typeof rb.username === 'undefined' || typeof rb.password === 'undefined') {
      response.messages.push('You need to enter both username and password to login');
      return res.status(400).json(response);
    }
    
    user.model.findOne({username: rb.username}, function(err, obj){
      if (err || !obj) {
        // We made a boo boo
        // Email probably does not exist, lets blame it on that
        response.messages.push('Username was incorrect');
        return res.status(400).json(response);
      }
      if (bcrypt.compareSync(rb.password, obj.password)){
        // Create the JWT an send it back.
        response.jwt = jwt.signUser(obj.email, Date.now() + 1000 * 60 * 60 * 24 * 30, {username:obj.username});
        response.messages.push('Success! You remembered your password!');
        return res.json(response);
      } else {
        response.messages.push('Incorrect password');
        return res.status(400).json(response);
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


  /**
   * Generates a crypto secure token. We can't use Math.random() as anyone can calculate what it will
   * generate.
   */
  var genRandomToken = function() {
    return crypto.randomBytes(64).toString('hex');
  };

  /**
   * extractMongooseValidationMessages
   */
  var extractMongooseValidationMessages = function(mongooseError) {
    var errorMessages = [];
    for(obj in mongooseError.errors) {
      errorMessages.push(mongooseError.errors[obj].message);
    }

    return errorMessages;
  }

  return Router;
};

