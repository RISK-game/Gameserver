
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = {
  id:Number,
  username:String,
  password:String, // Do not forget to bcrypt
  email:String, 
  rank:Number,
  gamesPlayed:[Number],
  stats:{
    wins:Number,
    losses:Number
  },
  //lastActivity: {type:Date, default: Date.now},
  created: {type:Date, default:Date.now},
  verifyToken:String
};

var userSchema = new Schema(user);

var exports = module.exports = {};
exports.schema = userSchema;
exports.model  = mongoose.model('User', userSchema);

