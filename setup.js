var db = require("./db2");
var uuid = require('node-uuid');
var config = require("./config.js");


module.exports = function() {

    if (!config.widgets || config.widgets.length == 0) {
        console.log("No widgets defined.");
        return;
    }

    config.widgets.forEach(function(widget) {

        var feeds = widget.feedUrls.map(function(url) {
            return {
                url: url
            }
        });

        db.feeds.insert(feeds, function(err, docs) {

            if (err){
            	return;
            }

            widget.feeds = docs.map(function(feed) {
                return feed._id
            });

            delete widget.feedUrls;

            widget._id = widget.id;
            delete widget.id;

            db.widgets.insert(widget, function(err, widget) {});

        });
    });
};
