const express = require('express');
const router = express.Router();

// Requiring our Todo model
const db = require("../models");

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.nytimes.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("h2").each(function (i, element) {
            // Save an empty result object
            let result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("span")
                .text();
            result.link = $(this)
                .parent()
                .parent()
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client
        const hbsObject = {
            user: dbUser
        }

        res.render("index", hbsObject);
    });
});

// Export routes for server.js to use.
module.exports = router;