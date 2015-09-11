var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');



/**
 * Database structure
 */
var userSchema = new Schema({
  username    :{type:String, required:true, unique:true, trim:true},
  password    :{type:String, required:true}, 
  email       :{type:String, required:true, unique:true, trim:true}, 
  rank        :{type:Number, default:1000},
  gamesPlayed :[Schema.Types.ObjectId],
  stats:{
    wins      :{type: Number, default:0},
    losses    :{type: Number, default:0}
  },
  created     :{type:Date, default:Date.now},
  verifyToken :{type:String, required:true}
});

var User = mongoose.model('User', userSchema);


/**
 * Validations
 */
User.schema.path('email').validate(function(value) {
  return (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(value);
}, 'Invalid email');

User.schema.path('email').validate(function(value, done) {
    return doesExist('email', value, done);
}, 'Email is alread used by another user');

User.schema.path('password').validate(function(value) {
  console.log("password Validation =", value, "!!");
  return (value.length >= 4);
}, 'Password need to be >=4 chars');

User.schema.path('username').validate(function(value, done) {
    return doesExist('username', value, done);
}, 'User alread exists');




/**
 * Post hooks
 */

// After validation, do stuff
// like hashing the password
User.schema.post('validate', function(doc) {
  doc.password = bcrypt.hashSync(doc.password);

  return doc;
});


/**
 * Helpers
 */
var doesExist = function(field, value, done) {
  var obj = {};
  obj[field] = value;

  User.count(obj, function(err, count) {
    if (err) {
        return done(err);
    } 
    // If `count` is greater than zero, "invalidate"
    done(!count);
  });
}



/**
 * Export
 */
module.exports.schema = userSchema;
module.exports.model  = User;
