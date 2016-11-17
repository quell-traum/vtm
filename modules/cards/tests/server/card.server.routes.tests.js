'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Card = mongoose.model('Card'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  card;

/**
 * Card routes tests
 */
describe('Card CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Card
    user.save(function () {
      card = {
        name: 'Card name'
      };

      done();
    });
  });

  it('should be able to save a Card if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle Card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Get a list of Cards
            agent.get('/api/cards')
              .end(function (cardsGetErr, cardsGetRes) {
                // Handle Cards save error
                if (cardsGetErr) {
                  return done(cardsGetErr);
                }

                // Get Cards list
                var cards = cardsGetRes.body;

                // Set assertions
                (cards[0].user._id).should.equal(userId);
                (cards[0].name).should.match('Card name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Card if not logged in', function (done) {
    agent.post('/api/cards')
      .send(card)
      .expect(403)
      .end(function (cardSaveErr, cardSaveRes) {
        // Call the assertion callback
        done(cardSaveErr);
      });
  });

  it('should not be able to save an Card if no name is provided', function (done) {
    // Invalidate name field
    card.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Card
        agent.post('/api/cards')
          .send(card)
          .expect(400)
          .end(function (cardSaveErr, cardSaveRes) {
            // Set message assertion
            (cardSaveRes.body.message).should.match('Please fill Card name');

            // Handle Card save error
            done(cardSaveErr);
          });
      });
  });

  it('should be able to update an Card if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle Card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Update Card name
            card.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Card
            agent.put('/api/cards/' + cardSaveRes.body._id)
              .send(card)
              .expect(200)
              .end(function (cardUpdateErr, cardUpdateRes) {
                // Handle Card update error
                if (cardUpdateErr) {
                  return done(cardUpdateErr);
                }

                // Set assertions
                (cardUpdateRes.body._id).should.equal(cardSaveRes.body._id);
                (cardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Cards if not signed in', function (done) {
    // Create new Card model instance
    var cardObj = new Card(card);

    // Save the card
    cardObj.save(function () {
      // Request Cards
      request(app).get('/api/cards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Card if not signed in', function (done) {
    // Create new Card model instance
    var cardObj = new Card(card);

    // Save the Card
    cardObj.save(function () {
      request(app).get('/api/cards/' + cardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', card.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Card with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Card is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Card which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Card
    request(app).get('/api/cards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Card with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Card if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle Card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Delete an existing Card
            agent.delete('/api/cards/' + cardSaveRes.body._id)
              .send(card)
              .expect(200)
              .end(function (cardDeleteErr, cardDeleteRes) {
                // Handle card error error
                if (cardDeleteErr) {
                  return done(cardDeleteErr);
                }

                // Set assertions
                (cardDeleteRes.body._id).should.equal(cardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Card if not signed in', function (done) {
    // Set Card user
    card.user = user;

    // Create new Card model instance
    var cardObj = new Card(card);

    // Save the Card
    cardObj.save(function () {
      // Try deleting Card
      request(app).delete('/api/cards/' + cardObj._id)
        .expect(403)
        .end(function (cardDeleteErr, cardDeleteRes) {
          // Set message assertion
          (cardDeleteRes.body.message).should.match('User is not authorized');

          // Handle Card error error
          done(cardDeleteErr);
        });

    });
  });

  it('should be able to get a single Card that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Card
          agent.post('/api/cards')
            .send(card)
            .expect(200)
            .end(function (cardSaveErr, cardSaveRes) {
              // Handle Card save error
              if (cardSaveErr) {
                return done(cardSaveErr);
              }

              // Set assertions on new Card
              (cardSaveRes.body.name).should.equal(card.name);
              should.exist(cardSaveRes.body.user);
              should.equal(cardSaveRes.body.user._id, orphanId);

              // force the Card to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Card
                    agent.get('/api/cards/' + cardSaveRes.body._id)
                      .expect(200)
                      .end(function (cardInfoErr, cardInfoRes) {
                        // Handle Card error
                        if (cardInfoErr) {
                          return done(cardInfoErr);
                        }

                        // Set assertions
                        (cardInfoRes.body._id).should.equal(cardSaveRes.body._id);
                        (cardInfoRes.body.name).should.equal(card.name);
                        should.equal(cardInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Card.remove().exec(done);
    });
  });
});
