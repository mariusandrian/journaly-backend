const usersRepository = require('../repositories/usersRepository');
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(async (username, password, done) => {
        usersRepository.findOne(username, password, done);
    })
);

  passport.serializeUser(function(user, done) {
        console.log('serializing user ', user)
        done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    console.log(`deserial with ${id}`);
    try {
        const user = usersRepository.findById(id)
        console.log('success deserial');
        done(null, user);
    } catch (err) {
        done(err, false);
    }
  });

};