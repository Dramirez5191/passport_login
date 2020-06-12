const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Welcome Page
router.get("/", (req, res) => res.render("welcome"));

//Dashboard , only accessible to authenticated users
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user });
});

module.exports = router;
