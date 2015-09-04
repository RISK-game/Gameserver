
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameState = {
  id                    :{type:Number, required:true, unique:true},
  roomName              :{type:String, required:true},
  seed                  :{type:String, required:true},
  hostID                :{type:Number, required:true},
  
  roundLength           :{type:Number, default:30},
  extraTimePerAttack    :{type:Number, default:3},
  startTroopsPerPlayer  :{type:Number, default:10},
  maxPlayers            :{type:Number, default:8},
  createdAt             :{type:Date  , default:Date.now},
  nextTurnAt            :Date,
  worldState:{
    currentPlayer       :{type:Number, default:0},
    players:[{
      player            :Schema.Types.ObjectId,
      countries         :Schema.Types.Mixed,
      disabled          :Boolean,
      troopsToPlay      :{type:Number, default:10},
      gems              :{type:Number, default:0}
    }]
  },
  actions:[{
    actionName          :String,
    palyerIndex         :Number,
    time                :{type:Date, default:Date.now},
    data                :Schema.Types.Mixed
  }]
};

var gameSchema = new Schema(gameState);

var exports = module.exports = {};
exports.schema = gameSchema;
exports.model  = mongoose.model('Game', gameSchema);
