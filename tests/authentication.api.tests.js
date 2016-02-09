var app = require('../server.js'),
    should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    api = request(app);
    
describe('testing user authentication endpoints', function () {

    // clear users out from the test database 
    // before each test is run 
    beforeEach(function (done) {
        User.remove({}, function() {
        });
        var newUser = new User()
            newUser.local.email = 'newuser'
            newUser.local.password = 'password'
            newUser.save(function (err) {
                if (err) {
                    return done(err);
                }
                done();
            })
    })


    it('successfully logs in with an existing user', function (done) {
        // post request to the /login route
        api.post('/login')
            // send a login email and password as part of the request body
            .send({
                email: 'newuser',
                password: 'password'
            })
            .expect(200) // use the expect method to assert that the status is 200 "OK"
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.eql({redirect: '/profile'});
                // call the done function to tell mocha that the test is done
                // so it can move on to the next test
                done();
            })
    })

    it('fails to log in a non existing user', function (done) {
        // post request to the '/login route'
        api.post('/login')
            // send a login email and password (this user email does not exist)
            .send({
                email: 'someuser',
                password: 'password'
            })
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.eql({error: 'No user found.'});
                // tell mocha the test is done
                done();
            })
    })

    it('successfully created a user', function (done) {
        // make a post reqeust to the /signup route 
        api.post('/signup')
            // send an email and password as part of the request body
            .send({
                email: 'foobar',
                password: 'password'
            })
            .expect(200) // check to see that the response status is the expected 200 status
            .end(function (err, res) {
                if (err) return done(err);
                // check to see that the response body returns the expected 
                // json object of {redirect: '/profile'}
                res.body.should.eql({redirect: '/profile'});
                // indicate that the test is done
                done();
            })
    })

    it('fails to create a user with a duplicate email', function (done) {
        api.post('/signup')
            .send({
                email: 'newuser',
                password: 'password'
            })
            .expect(400) // check for a response status to equal 400 bad request
            .end(function (err, res) {
                if (err) return done(err);
                // assert that the response body returns 
                // the expected error message
                res.body.should.eql({error: 'That email is already taken.'})
                done();
            })
    })

    it('fails login if no email or password is sent with the request', function (done) {
        api.post('/login')
            //sent nothin
            .send()
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);

                res.body.should.eql({error: 'Email and Password required.'})
                done();
            })
    })

    it('fails signup if no email or password is sent with the request', function (done) {
        api.post('/signup')
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);

                res.body.should.eql({error: 'Email and Password required.'})
                done();
            })
    })
});