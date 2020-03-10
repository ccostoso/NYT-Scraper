const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// Requiring our Todo model
const db = require("../models");

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
    // First, we grab the body of the html with axios
    // axios.get("http://www.nytimes.com/").then(function (response) {
    //     // Then, we load that into cheerio and save it to $ for a shorthand selector
    //     const $ = cheerio.load(response.data);

    //     // Now, we grab every h2 within a div (within an a) tag, and do the following:
    //     $("a div h2").each(function (i, element) {
    //         // Save an empty result object
    //         let result = {};

    //         // Add the text and href of every link, and save them as properties of the result object
    //         result.title = $(this)
    //             .text();
    //         result.subheading = $(this)
    //             .parent()
    //             .parent()
    //             .find("p")
    //             .text();
    //         result.link = $(this)
    //             .parent()
    //             .parent()
    //             .attr("href");
    //         result.saved = false;

            // // Create a new Article using the `result` object built from scraping
            // db.Article.create(result)
            //     .then(function (dbArticle) {
            //         // View the added result in the console
            //         console.log(dbArticle);
            //     })
            //     .catch(function (err) {
            //         // If an error occurred, log it
            //         console.log(err);
            //     });

            db.Article.find({})
                .then(function(dbArticles) {
                    // Render the results to Handlebars
                    const hbsObject = {
                        article: dbArticles
                    }

                    res.render("index", hbsObject);
                    console.log("hbsObject:", hbsObject)
                })
                .catch(function(err) {
                    console.log(err)
                })
        // });
    // });
});

router.get("/saved", function (req, res) {
    db.Article.find({saved: true})
        .then(function(dbArticles) {
            // Render the results to Handlebars
            const hbsObject = {
                article: dbArticles
            }

            res.render("saved", hbsObject);
            console.log("hbsObject:", hbsObject)
        })
        .catch(function(err) {
            console.log(err)
        })
});

// Export routes for server.js to use.
module.exports = router;