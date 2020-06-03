module.exports = {
  //this verifies if the user is logged in, its to protect certain pages that
  //can only be accessed by authenticated users
  //this will be passed to certain routes for example ==>

  /**

  router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard")
);

 */

  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  },
};
