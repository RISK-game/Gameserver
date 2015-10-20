/*
 * Helpers functions
 */

module.exports = function() {
  return {

    /**
     * extractMongooseValidationMessages
     */
    extractMongooseValidationMessages : function(mongooseError) {
      var errorMessages = [];
      for(obj in mongooseError.errors) {
       errorMessages.push(mongooseError.errors[obj].message);
      }

      return errorMessages;
    }
  }
}