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
  picture : {type:String},
  owner   : {type:Schema.Types.ObjectId },
  created : {type:Date, default:Date.now},
});

var UserPicture = mongoose.model('UserPicture', userPictureScema);


/**
 * Validations
 */

 // Validate BASE64 string?
UserPicture.schema.path('picture').validate(function(value) {
  return (/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/).test(value);
}, 'Invalid picture');



module.exports.schema = userPictureScema;
module.exports.model  = UserPicture;
