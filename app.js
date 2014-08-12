var FeedParser = require('feedparser'),
    request = require('request'),
    uuid = require('node-uuid');

var path = require("path");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var apiRouter = require('./api');
var worker = require('./worker');


var config = require("./config");
var setup = require("./setup");

var db = require('./db2');

setup();


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

worker();

app.use(bodyParser.json())
app.use("/api", apiRouter);
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

app.get("/widgetmode/:widgetid", function(req, res) {

    console.log(req.params.widgetid);


    db.widgets.findOne({
        _id: req.params.widgetid
    }, function(err, doc) {

        if (err || !doc) {
            res.status(401);
            return;
        }

        res.render("widgetmode", doc)

    });

});

app.get("/appmode/:widgetid", function(req, res) {

    console.log(req.params.widgetid);


    db.widgets.findOne({
        _id: req.params.widgetid
    }, function(err, doc) {

        if (err || !doc) {
            res.status(401);
            return;
        }

        res.render("appmode", doc)

    });

});

app.get("/getGuid", function(req, res){

  res.send(uuid.v4());
})



var server = app.listen(process.env.port||3000, function() {
    console.log('Listening on port %d', server.address().port);
});
