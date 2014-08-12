var assert = require('assert');

// var should = require('should'); 
var request = require('supertest');
var url = "http://localhost:3000";
// var mongoose = require('mongoose');
// var winston = require('winston');
// var config = require('./config-debug');

describe('Api', function() {
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function() {
        // In our tests we use the test db
        console.log("run init code");
    });
    // use describe to give a title to your test suite, in this case the tile is "Account"
    // and then specify a function in which we are going to declare all the tests
    // we want to run. Each test starts with the function it() and as a first argument 
    // we have to provide a meaningful title for it, whereas as the second argument we
    // specify a function that takes a single parameter, "done", that we will use 
    // to specify when our test is completed, and that's what makes easy
    // to perform async test!
    describe('Feeds', function() {
        

        it("Should be possible to retrive feeds", function(done){

                request(url)
                .get("/api/feeds")
                .set('Accept', 'application/json')
                .expect(200, done);
        });


        it('Should be able to Post a new feed', function(done) {

            var feed = {
                url: 'http://feeds.hanselman.com/scotthanselman'
            }

            request(url)
                .post("/api/feeds")
                .send(feed)
                .expect(200)
                .end(function(err, res){
                    if (err){
                      throw err;
                    }

                       assert.equal(200, res.status);
                       done();
                    
          
                });

        

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/profiles and we want to send some info
            // We do this using the request object, requiring supertest!
            //    request(url)
            // .post('/api/profiles')
            // .send(profile)
            //    // end handles the response
            // .end(function(err, res) {
            //          if (err) {
            //            throw err;
            //          }
            //          // this is should.js syntax, very clear
            //          res.should.have.status(400);
            //          done();
            //        });
        });
    });

});
