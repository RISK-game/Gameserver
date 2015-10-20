/*
 * 
 */

var Router = require('express').Router();

var config = require('./../config.js');
var userPictures = require('./../models/userPicture.js');
var helper = require('./../helper.js');

module.exports = function(mongoose, log){
  var jwt = require('./../middleware/jwt.js')(config.secretToken, log);  

  Router.post('/store', function(req, res){
    if (!req.jwt.isAuthed)
      return res.status(403).send('Unauthorized');
    
    var response = {};

    new userPictures.model({
      picture : req.body.picture,
      owner   : req.jwt.user.objectId
    }).save(function(err) {
      if (err) {
        log.warn(err);
        res.status(400);
        response.messages = helper.extractMongooseValidationMessages(err);
      }
      else {
        response.success = true;
      }

      res.json(response);
    });
  });

  return Router;
};

