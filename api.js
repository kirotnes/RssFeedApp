(function() {
    var router = require('express').Router();
    var db = require('./db2');
    var uuid = require('node-uuid');


    var config = require('./config');


    function getImageUrl(req, defaultImage){

        return req.protocol + '://' + req.get('host') + "/img/" + ((defaultImage) ? defaultImage : "rss.jpg");
l
    }

    router.post("/feeds", function(req, res) {


        var feed = req.body;

        feed.url = feed.url.toLowerCase();

        db.feeds.insert(feed, function(err, doc) {

            if (err) {
                res.status(401);
                res.send(err);
                return;
            }

            res.send(doc);
        });
    });

    router.get("/feeds", function(req, res) {

        db.feeds.find({}, function(err, docs) {
            res.send(docs);
        });
    });


    router.get("/articles", function(req, res) {

        db.articles.find({}, function(err, docs) {
            res.send(docs);
        });
    });


    router.get("/widgets", function(req, res) {

        db.widgets.find({}, function(err, docs) {
            res.send(docs);
        });
    });

    router.get("/widgetfeed", function(req, res) {

        var feed ={

                id: config.feedid,
                desc: config.desc,
                name: config.name,
                thumbnailurl: getImageUrl(req)
            };

        db.widgets.find({}, function(err, docs) {
            
            feed.widgets = docs.map(function(doc) {

                var widgetUrl = doc.url = req.protocol + '://' + req.get('host') + "/widgetmode/" + doc._id;
                var appmodeUrl = doc.url = req.protocol + '://' + req.get('host') + "/appmode/" + doc._id;

                var widget = {widgetmode:{sizes:[{rows:5, cols:3, default:true}],url:widgetUrl}};

                widget.appmode = {url: appmodeUrl, maxwidth:800, minwidth:400};
                widget.version = "1.0";
                widget.widgetId = doc._id;
                widget.title = doc.title;
                widget.tags = doc.tags;
                widget.desc = doc.desc;
                widget.thumbnailurl =getImageUrl(req, doc.image);

                return widget;
            });

            res.send(feed);

        });

    });

    router.get("/widgets/:widgetid/data", function(req, res) {

        db.widgets.findOne({
            _id: req.params.widgetid
        }, function(err, widget) {

            if (err||!widget){
                res.status(401);
                res.send(err);
                return;
            }

            var data = [];

            db.articles.find({feedid: {$in: widget.feeds}}).sort({pubdate:-1,}).limit(50).toArray().then(function(docs){
               
                    docs.forEach(function(doc){

                       if (!doc.image || !doc.image.url){

                          doc.image = {url: getImageUrl(req,widget.image) }
                       }

                    });


                    res.send(docs);

                });

        });
    });




    module.exports = router;
})();
