const express = require('express');
const router = express.Router();

// Requiring our Todo model
const db = require("../models");

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
    db.User
    .find({})
    .populate("articles")
    .then(dbUser => {
        const hbsObject = {
            user: dbUser
        }

        res.render("index", hbsObject);

        console.log(hbsUser);
    })
});

// Export routes for server.js to use.
module.exports = router;