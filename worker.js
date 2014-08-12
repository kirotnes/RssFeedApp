var childProcess = require('child_process'),
    db = require('./db2'),
    request = require('request');

var FeedParser = require('feedparser');





var worker = function() {

 
    db.feeds.find({}, function(err, feeds) {

        if (err){
        	console.log(err);
        	
        }
        feeds = feeds||[];

        feeds.forEach(function(feed) {


        	console.log("fetching feed: " +feed.url);

            var inserter = function() {

                var stream = this,
                    meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
                    ,
                    item;

                while (item = stream.read()) {

                    var article = {
                        _id: item.guid,
                        link: item.link,                        
                        title: item.title,
                        feedid: feed._id,
                        pubdate: item.pubdate,
                        author: item.author,
                        image : item.image

                    };

                    if (!article.image || !article.image.url){
                    	article.image = item.meta.image;
                    }

                    db.articles.insert(article, function(err, doc) {

                        if (err) {
                            //  console.log(err);
                            feedparser.removeListener('readable', inserter);
                        }

                    });
                };
            };


            var req = request(feed.url),
                feedparser = new FeedParser({
                    addmeta: true
                });

            req.on('error', function(error) {
                console.log(error);
            });

            req.on('response', function(res) {
                var stream = this;
                if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
                stream.pipe(feedparser);
            });

            feedparser.on('error', function(error) {
                console.log(error);
            });

            feedparser.on('readable', inserter);

        });
    });



}

setInterval(worker, 1000 * 60*5);

module.exports = worker;
