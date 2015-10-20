var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User Pictures
 *
 * All pictures are saved here.
 */
var userPicturesScema = new Schema({
  /**
   * Hex encoded string of the image
   */
  picture : {type:String}
  owner   : {type:Schema.Types.ObjectId }
  created : {type:Date, default:Date.now},
});

var UserPictures = mongoose.model('UserPictures', userPicturesScema);

module.exports.schema = userPicturesScema;
module.exports.model  = UserPictures;
