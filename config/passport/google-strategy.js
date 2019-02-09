const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../../models/user-model');

passport.use(new GoogleStrategy({
  // clientID and clientSecret are given names from Google API
  // googleClientID is the name we gave to our variable in .env
  clientID: process.env.googleClientID,
  clientSecret: process.env.googleClientSecret,
  callbackURL: '/google/callback',
  // proxy: true // not important for now, but yes when in production
}, (accessToken, refreshToken, userInfo, cb) => {
  // console.log('Google account: ', userInfo);
  const { displayName, emails } = userInfo;
  User.findOne({ $or: [
    { email: emails[0].value },
    { googleID: userInfo.id }
  ] })
  .then( user => {
    if(user){
      cb(null, user); // log in the user if the user already exists
      return;
    }
    User.create({
      email: emails[0].value,
      fullName: displayName,
      googleID: userInfo.id
    })
    .then(newUser => {
      cb(null, newUser)
    })
    .catch( err => next(err) );
  })
  .catch( err => next(err) );
}))