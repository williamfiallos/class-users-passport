const passport = require('passport');
// deleted local-strategy and bcrypt
// change User's folder with ../ since I moved the file to another folder
const User = require('../../models/user-model');

// require connect-flash for flash messages
const flash = require('connect-flash');
// then go to line 32 to activate flash


////////////////////////////
require('./local-strategy');
require('./slack-strategy');
require('./google-strategy');
////////////////////////////

// serializeUser => what to be saved in the session
                              // "cb" stands for callback! aka "done"
passport.serializeUser((user, cb) => {
  // null === no errors, all good
  cb(null, user._id); // <== save user ID into session
}) 

// deserializeUser => retrieve user's data from the database
// this function gets called everytime we request for a user (every time when we need req.user)
passport.deserializeUser((userId, cb) => {
  User.findById(userId)
  .then(user => {
    cb(null, user);
  })
  .catch( err => cb(err));
})

function passportBasicSetup(anyName){
    // passport super power is here:
    anyName.use(passport.initialize()); // <== 'fires' the passport package
    anyName.use(passport.session()); // <== connects passport to the session
    // to activate flash messages
    anyName.use(flash());
    
    anyName.use((req, res, next) => {
      res.locals.messages = req.flash();
      if(req.user){
        res.locals.currentUser = req.user; // <== make currentUser variable available in all hbs whenever we have user in the session
      }
      next();
    })
  }

  module.exports = passportBasicSetup;