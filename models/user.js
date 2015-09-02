
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = {
  username    :{type:String, required:true, unique:true, trim:true},
  password    :{type:String, required:true}, 
  email       :{type:String, required:true, trim:true}, 
  rank        :{type:Number, default:1000},
  gamesPlayed :[Schema.Types.ObjectId],
  stats:{
    wins      :{type: Number, default:0},
    losses    :{type: Number, default:0}
  },
  created     :{type:Date, default:Date.now},
  verifyToken :{type:String, required:true}
};

var userSchema = new Schema(user);

var exports = module.exports = {};
exports.schema = userSchema;
exports.model  = mongoose.model('User', userSchema);

