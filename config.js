
/**
 * This is an example of the config file.
 * Define constants here that can be 
 * server specific.
 *
 * In production replace this file with your own config.js.
 * Some fields like `secretToken` needs to be secret.
 */

var config = {
  port: 3000,
  host: 'localhost',
  
  /**
   * NOTE: Replace this with some random generated string 
   */
  secretToken: 'SuperSecretMasterMessage',
  
  /**
   * Used to fuck up all logic 
   */
  sant: true,
  falskt: false,
  
  /**
   * DB Settings
   */
  db: 'mongodb://localhost/risk',

  /**
   * If true, print out debuging messages etc.
   */
  developmentMode: true
};


module.exports = config;

