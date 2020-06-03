const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// const passportSetup = require("../config/google-auth");

//User model
const User = require("../models/User");
//Login Page
router.get("/login", (req, res) => res.render("Login"));

//Register Page
router.get("/register", (req, res) => res.render("Register"));

//Register Handle
//users gets prepended to these routes ex: users/register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //errors
  //pushes errors into the errors array that will be displayed if true
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  //if there is an error, rerender the register page and pass in the information that
  //was added before so that the previous fields arent erase, probably shouldnt pass
  //the previous password
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
    //if there arent any errors, proceed with the registration
  } else {
    //check if the user already exist
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //if they exist, rerender the register page with he appropriate error message
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      }
      //if there arent any errors create a new user
      else {
        const newUser = new User({
          name,
          email,
          password,
        });
        //Hash the password

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    //pass in the appropriate page for success and failure
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

// G O O G L E   R O U T E S

//login with google
router.get(
  "/google/login",
  //uses the google strategy that was passed into passport in the pass-port-setup
  //our google strategy is called Google Strategy. So by default when we use
  //google down here, it maps to a default 'GoogleStrategy'
  passport.authenticate("google", {
    //HERE SPECIFY WHAT WE WANT with the scope
    scope: ["profile"],
  })
);

//add the passport.authenticate('google') middleware so that we have access to the query params
//before we get to do everything else
//triggers the call back function in passport-setup.js where the strategy was created

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  //when this route is hit, we receive a code in the
  //query params which has users info

  res.redirect("/dashboard");
  // res.render("/dashboard");
});

// router.get(
//   "/google/redirect",
//   passport.authenticate("google", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/",
//   })
// );

module.exports = router;
