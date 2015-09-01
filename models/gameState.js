
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameState = {
  id:Number,
  roomName:String,
  seed:String,
  hostID:Number,
  
  roundLength:{type:Number, default:30},
  extraTimePerAttack:{type:Number, default:3},
  startTroopsPerPlayer:{type:Number, default:10},
  maxPlayers:{type:Number, default:8},
  createdAt: {type:Date, default:Date.now},
  nextTurnAt: Date,
  worldState:{
    currentPlayer:{type:Number, default:0},
    players:[{
      playerID:Number,
      playerName:String,
      disabled:Boolean,
      troopsToPlay:{type:Number, default:10},
      countries:Schema.Types.Mixed,
      gems:{type:Number, default:0}
    }]
  },
  actions:[{
    actionName:String,
    time:Date,
    data:Schema.Types.Mixed
  }]
};

var gameSchema = new Schema(gameState);

var exports = module.exports = {};
exports.schema = gameSchema;
exports.model  = mongoose.model('Game', gameSchema);
