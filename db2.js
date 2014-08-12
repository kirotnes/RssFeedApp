(function() {

    var mongojs = require("promised-mongo");

    var db = mongojs('feeddb', ['articles',
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
