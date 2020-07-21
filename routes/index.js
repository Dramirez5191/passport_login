const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Welcome Page
router.get("/", (req, res) => res.render("welcome"));

//Dashboard , only accessible to authenticated users
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user });
});

router.get("/timeline", (req, res) => {
  //here we will make a call to the database and send it ot the timeline page
  let data = [
    {
      eventYear: 2002,
      eventName: "ultrices",
      type: "book release",
    },
    {
      eventYear: 2003,
      eventName: "ultrices",
      type: "software release",
    },
    {
      eventYear: 2004,
      eventName: "ultrices",
      type: "software release",
    },
    {
      eventYear: 2005,
      eventName: "ultrices",
      type: "book release",
    },
    {
      eventYear: 2006,
      eventName: "ultrices",
      type: "software release",
    },
    {
      eventYear: 2007,
      eventName: "ultrices",
      type: "book release",
    },
    {
      eventYear: 2008,
      eventName: "ultrices",
      type: "software release",
    },
    {
      eventYear: 2009,
      eventName: "ultrices",
      type: "book release",
    },
    {
      eventYear: 2010,
      eventName: "ultrices",
      type: "software release",
    },
    {
      eventYear: 2011,
      eventName: "ultrices",
      type: "book release",
    },
    {
      eventYear: 2012,
      eventName: "ultrices",
      type: "software release",
    },
    {
      eventYear: 2012,
      eventName: "asdasd",
      type: "book release",
    },
    {
      eventYear: 2012,
      eventName: "numero cinco",
      type: "software release",
    },
    {
      eventYear: 2012,
      eventName: "numero seis",
      type: "book release",
    },
    {
      eventYear: 2012,
      eventName: "siete",
      type: "software release",
    },
    {
      eventYear: 2013,
      eventName: "ultrices",
      type: "book release",
    },
    {
      eventYear: 2014,
      eventName: "ultrices",
      type: "software release",
    },

    {
      eventYear: 2003,
      eventName: "telephone",
      type: "book release",
    },

    {
      eventYear: 2005,
      eventName: "ultrices",
      type: "software release",
    },
    {
      eventYear: 2006,
      eventName: "amazon",
      type: "movie release",
    },
    {
      eventYear: 2007,
      eventName: "android OS",
      type: "software release",
    },
    {
      eventYear: 2008,
      eventName: "iphone 3",
      type: "book release",
    },
    {
      eventYear: 2009,
      eventName: "LED",
      type: "software release",
    },
    {
      eventYear: 2010,
      eventName: "AI",
      type: "book release",
    },
    {
      eventYear: 2011,
      eventName: "React.js",
      type: "software release",
    },
    {
      eventYear: 2012,
      eventName: "Apple",
      type: "book release",
    },
    {
      eventYear: 2013,
      eventName: "DJ",
      type: "software release",
    },
    {
      eventYear: 2014,
      eventName: "asdsd",
      type: "book release",
    },

    {
      eventYear: 2005,
      eventName: "screen",
      type: "software release",
    },
    {
      eventYear: 2006,
      eventName: "roku",
      type: "software release",
    },
    {
      eventYear: 2008,
      eventName: "iphone 4",
      type: "book release",
    },
    {
      eventYear: 2009,
      eventName: "Girls Code",
      type: "software release",
    },
    {
      eventYear: 2010,
      eventName: "UX",
      type: "book release",
    },
    {
      eventYear: 2011,
      eventName: "Angular.js",
      type: "software release",
    },
    {
      eventYear: 2012,
      eventName: "Huaweii",
      type: "book release",
    },
    {
      eventYear: 2013,
      eventName: "asdasd",
      type: "software release",
    },
    {
      eventYear: 2014,
      eventName: "asads",
      type: "book release",
    },
  ];
  // res.render("timeLine", { user: req.user });
  // res.send(data);
  res.render("timeLine", { user: req.user, data });
});

module.exports = router;
