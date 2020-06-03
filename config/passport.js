const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Load User Model
const User = require("../models/User");

module.exports = function (passport) {
  //serialize to store inside session
  passport.serializeUser((user, done) => done(null, user.id));
  //does opposite of above
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  // =========================================================================
  // LOCAL ==================================================================
  // =========================================================================

  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //Match User
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }

          //Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================

  passport.use(
    new GoogleStrategy(
      {
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: "/users/google/redirect",
      },
      //accessToken lets us access user data
      //refreshToken lets us refresh the accessToken because the accessToken expires after some time
      (accessToken, refreshToken, profile, done) => {
        // passport callback function
        //check if user already exits in our DB
        User.findOne({ password: profile.id }).then((currentUser) => {
          if (currentUser) {
            //already have the user
            console.log(`user is ${currentUser}`);
            done(null, currentUser);
          } else {
            //if not, create user in our DB
            new User({
              email: profile.displayName,
              name: profile.displayName,
              password: profile.id,
            })
              //save it to the DB
              .save()
              //then print it out
              .then((newUser) => {
                console.log(`new user created ${newUser}`);
                done(null, newUser);
              });
          }
        });
      }
    )
  );
};
