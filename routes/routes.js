const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// Requiring our Todo model
const db = require("../models");

// Create renderHbs function so as not to repeat code on Handlebar rendering on GET requests
const renderHbs = (articleRes, page, res) => {
    const hbsObject = {
        article: articleRes
    }

    res.render(page, hbsObject);
    console.log("hbsObject:", hbsObject);
}

// Create all our routes and set up logic within those routes where required.
router.get("/", (req, res) => {

    // Query database to see if there are already documents in the Article collection
    db.Article.find({})
        .then(dbArticles => {

            // If there are documents in the Article collection... 
            if (dbArticles.length > 0) {
                // ...render the results in the Handlebars.
                renderHbs(dbArticles, "index", res);

                // Otherwise, run Axios to provide entries for the Article collection.
            } else {
                // We grab the body of the html with axios
                axios.get("http://www.nytimes.com/").then(response => {

                    // Then, we load that into cheerio and save it to $ for a shorthand selector
                    const $ = cheerio.load(response.data);

                    // Now, we grab every h2 within a div (within an a) tag, and do the following:
                    $("a div h2").each((i, element) => {
                        // Save an empty result object
                        let result = {};

                        // Add the text and href of every link, and save them as properties of the result object
                        result.title = $(this)
                            .text();
                        result.subheading = $(this)
                            .parent()
                            .parent()
                            .find("p")
                            .text();
                        result.link = "https://nytimes.com/" + $(this)
                            .parent()
                            .parent()
                            .attr("href");
                        result.saved = false;

                        // Create a new Article using the `result` object built from scraping
                        db.Article
                            .create(result)
                            .then(dbArticle => {
                                // View the added result in the console
                                console.log(dbArticle);
                            })
                            .catch(err => {
                                // If an error occurred, log it
                                console.log(err);
                            });
                            
                        // Finally, retrieve all new entries...
                        db.Article
                            .find({})
                            .then(dbArticles => {
                                // ...and render the results in the Handlebars.
                                renderHbs(dbArticles, "index", res);
                            })
                    });
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

router.get("/saved", (req, res) => {
    db.Article.find({ saved: true })
        .then(dbArticles => {
            // Render the results to Handlebars
            renderHbs(dbArticles, "saved", res);
        })
        .catch(err => {
            console.log(err)
        })
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    db.Article
    .findOne({
        _id: id
    })
    .then(response => {
        if (response.saved) {
            db.Article
            .updateOne({ _id: id }, { $set: { saved: false } })
            .then(response => {
                res.json(response);
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            db.Article
            .updateOne({ _id: id }, { $set: { saved: true } })
            .then(response => {
                res.json(response);
            })
            .catch(err => {
                console.log(err);
            })
        }
    })
    .catch(err => {
        console.log(err);
    })


})

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.Article
        .updateOne({ _id: id })
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            console.log(err);
        })
})

router.delete("/reset", (req, res) => {
    db.Article
        .remove({})
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            console.log(err);
        })
})

// Export routes for server.js to use.
module.exports = router;