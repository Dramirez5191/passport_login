module.exports = {
  /**
  this checks if the user is logged in, its to protect certain pages that
  can only be accessed by an authenticated users
  this will be passed to certain routes for example the /'dashboard' route ==>

  router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard")
);

 */

  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    //if user isn not Authenticated redirect to the home page so that they may log in
    res.redirect("/");
  },
};
