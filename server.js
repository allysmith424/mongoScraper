var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public/'));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/fifaRankings");

app.get("/", function(req, res) {

  res.sendFile("index.html");

});

app.get("/scrapeRankings", function(req, res) {

	axios.get("http://www.fifa.com/fifa-world-ranking/ranking-table/men/index.html").then(function(response) {

		var $ = cheerio.load(response.data);

		$("tr.anchor").each(function(i, element) {

			var result = {};

			result.ranking = $(this).children(".tbl-rank").children(".text").text();
			result.flag = $(this).children(".tbl-teamname").children(".flag-wrap").children(".flag").attr("src").substring(2);
			result.team = $(this).children(".tbl-teamname").children("a").text();

      db.Team.create(result)
          .then(function(teamData) {
          })
          .catch(function(err) {
              return res.json(err);
          });

		});

	});

	res.send("Scraping done!");

});

app.get("/teams", function(req, res) {

  db.Team.find({}).sort({ranking: 1})
    .then(function(teamData) {
    	res.json(teamData);
    	console.log(teamData);
    })
    .catch(function(err) {
		res.json(err);
    });

});

app.get("/teams/:id", function(req, res) {

  db.Team.findOne({ _id: req.params.id })
    .populate("comments")
    .then(function(teamData) {
    	console.log(teamData);
      	res.json(teamData);
    })
    .catch(function(err) {
      res.json(err);
    });

});

app.post("/teams/:id", function(req, res) {

  db.Comment.create(req.body)
    .then(function(commentData) {
      return db.Team.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: commentData._id }}, { new: true });
    })
    .then(function(teamData) {
    	res.json(teamData);
    })
    .catch(function(err) {
    	res.json(err);
    });
});

app.post("/teams/:id", function(req, res) {

  db.Comment.create(req.body)
    .then(function(comment) {
      return db.Team.findOneAndUpdate({ _id: req.params.id }, { note: comment._id }, { new: true });
    })
    .then(function(teamData) {
      res.json(teamData);
    })
    .catch(function(err) {
      res.json(err);
    });

});

app.get("/teamwithcomments/:id", function(req, res) {

  db.Team.findOne({ _id: req.params.id })
    .populate("comments")
    .then(function(teamData) {
      res.json(teamData);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
