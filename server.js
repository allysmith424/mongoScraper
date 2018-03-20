var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/fifaRankings");

app.get("/scrapeRankings", function(req, res) {

	axios.get("http://www.fifa.com/fifa-world-ranking/ranking-table/men/index.html").then(function(response) {

		var $ = cheerio.load(response.data);

		$("tr.anchor").each(function(i, element) {

			var result = {};

			result.rank = $(this).children(".tbl-rank").children(".text").text();
			result.team = $(this).children(".tbl-teamname").children("a").text();

			console.log(result);

		});

	});

	res.send("done");

});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});