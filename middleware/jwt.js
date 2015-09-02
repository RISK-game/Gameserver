
var jwt = require('jsonwebtoken');

module.exports = function(secret, log){
  var expo = {};

  expo.auth = function(req, res, next) {
    // Is there a JWT passed alng??
    // Check cookies
    req.jwt = req.jwt || {};
    req.jwt.isAuthed = false;
    req.jwt.userdata = null;
    var jwtCookie = req.cookies.jwt;
    if (jwtCookie === undefined){
      return next();
    }
    //Soppouse we have the token now..
    // Have we signed it??
    jwt.verify(jwtCookie, secret, function(err, user){
      if (err){
        // Opsie, an error ocured
        log.info('A JWT was passed, but it was not signed by us. ' +
            'better keep a look out!');
        return next();
      }
      // Way we get the user, lets check if the time ran out
      if (Math.floor(Date.now()/1000) < user.expires){
        // JWT has expired
        return next();
      }

      req.jwt.userdata = user.email;
      req.jwt.isAuthed = true;
      log.info('User with email ' + user.email + ' was authenticated using JWT!');
      next();
    });
  };

  expo.signData = function(data){
    return jwt.sign(data, secret);
  }

  expo.signUser = function(email, expires, data){
    if (typeof data !== "object") data = {};
    data.email = email;
    data.expires = expires;
    return this.signData(data);
  }

  return expo;
};
