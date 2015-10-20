var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User Pictures
 *
 * All pictures are saved here.
 */
var userPictureScema = new Schema({
  /**
   * Hex encoded string of the image
   */
  picture : {type:String}
  owner   : {type:Schema.Types.ObjectId }
  created : {type:Date, default:Date.now},
});

var UserPicture = mongoose.model('UserPicture', userPictureScema);

module.exports.schema = userPictureScema;
module.exports.model  = UserPicture;
