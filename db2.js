(function() {

    var mongojs = require("promised-mongo");

    var db = mongojs(process.env.MONGODB_URI||'feeddb', ['articles',
        'feeds',
        'widgets'
    ]);


    db.feeds.ensureIndex({
        'url': 1,
        unique: true
    }, function(err) {});


    db.widgets.ensureIndex({
        'title': 1,
        unique: true
    }, function(err) {});


    module.exports = db;



})();
