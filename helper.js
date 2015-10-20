/*
 * Helpers functions
 */
helper = {};

/**
 * extractMongooseValidationMessages
 */
helper.extractMongooseValidationMessages = function(mongooseError) {
  var errorMessages = [];
  for(obj in mongooseError.errors) {
   errorMessages.push(mongooseError.errors[obj].message);
  }
  return errorMessages;
}




module.exports = helper;