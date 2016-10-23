'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Character = mongoose.model('Character'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  character;

/**
 * Character routes tests
 */
describe('Character CRUD tests', function () {

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

    // Save a user to the test db and create new Character
    user.save(function () {
      character = {
        name: 'Character name'
      };

      done();
    });
  });

  it('should be able to save a Character if logged in', function (done) {
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

        // Save a new Character
        agent.post('/api/characters')
          .send(character)
          .expect(200)
          .end(function (characterSaveErr, characterSaveRes) {
            // Handle Character save error
            if (characterSaveErr) {
              return done(characterSaveErr);
            }

            // Get a list of Characters
            agent.get('/api/characters')
              .end(function (charactersGetErr, charactersGetRes) {
                // Handle Characters save error
                if (charactersGetErr) {
                  return done(charactersGetErr);
                }

                // Get Characters list
                var characters = charactersGetRes.body;

                // Set assertions
                (characters[0].user._id).should.equal(userId);
                (characters[0].name).should.match('Character name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Character if not logged in', function (done) {
    agent.post('/api/characters')
      .send(character)
      .expect(403)
      .end(function (characterSaveErr, characterSaveRes) {
        // Call the assertion callback
        done(characterSaveErr);
      });
  });

  it('should not be able to save an Character if no name is provided', function (done) {
    // Invalidate name field
    character.name = '';

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

        // Save a new Character
        agent.post('/api/characters')
          .send(character)
          .expect(400)
          .end(function (characterSaveErr, characterSaveRes) {
            // Set message assertion
            (characterSaveRes.body.message).should.match('Please fill Character name');

            // Handle Character save error
            done(characterSaveErr);
          });
      });
  });

  it('should be able to update an Character if signed in', function (done) {
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

        // Save a new Character
        agent.post('/api/characters')
          .send(character)
          .expect(200)
          .end(function (characterSaveErr, characterSaveRes) {
            // Handle Character save error
            if (characterSaveErr) {
              return done(characterSaveErr);
            }

            // Update Character name
            character.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Character
            agent.put('/api/characters/' + characterSaveRes.body._id)
              .send(character)
              .expect(200)
              .end(function (characterUpdateErr, characterUpdateRes) {
                // Handle Character update error
                if (characterUpdateErr) {
                  return done(characterUpdateErr);
                }

                // Set assertions
                (characterUpdateRes.body._id).should.equal(characterSaveRes.body._id);
                (characterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Characters if not signed in', function (done) {
    // Create new Character model instance
    var characterObj = new Character(character);

    // Save the character
    characterObj.save(function () {
      // Request Characters
      request(app).get('/api/characters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Character if not signed in', function (done) {
    // Create new Character model instance
    var characterObj = new Character(character);

    // Save the Character
    characterObj.save(function () {
      request(app).get('/api/characters/' + characterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', character.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Character with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/characters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Character is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Character which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Character
    request(app).get('/api/characters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Character with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Character if signed in', function (done) {
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

        // Save a new Character
        agent.post('/api/characters')
          .send(character)
          .expect(200)
          .end(function (characterSaveErr, characterSaveRes) {
            // Handle Character save error
            if (characterSaveErr) {
              return done(characterSaveErr);
            }

            // Delete an existing Character
            agent.delete('/api/characters/' + characterSaveRes.body._id)
              .send(character)
              .expect(200)
              .end(function (characterDeleteErr, characterDeleteRes) {
                // Handle character error error
                if (characterDeleteErr) {
                  return done(characterDeleteErr);
                }

                // Set assertions
                (characterDeleteRes.body._id).should.equal(characterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Character if not signed in', function (done) {
    // Set Character user
    character.user = user;

    // Create new Character model instance
    var characterObj = new Character(character);

    // Save the Character
    characterObj.save(function () {
      // Try deleting Character
      request(app).delete('/api/characters/' + characterObj._id)
        .expect(403)
        .end(function (characterDeleteErr, characterDeleteRes) {
          // Set message assertion
          (characterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Character error error
          done(characterDeleteErr);
        });

    });
  });

  it('should be able to get a single Character that has an orphaned user reference', function (done) {
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

          // Save a new Character
          agent.post('/api/characters')
            .send(character)
            .expect(200)
            .end(function (characterSaveErr, characterSaveRes) {
              // Handle Character save error
              if (characterSaveErr) {
                return done(characterSaveErr);
              }

              // Set assertions on new Character
              (characterSaveRes.body.name).should.equal(character.name);
              should.exist(characterSaveRes.body.user);
              should.equal(characterSaveRes.body.user._id, orphanId);

              // force the Character to have an orphaned user reference
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

                    // Get the Character
                    agent.get('/api/characters/' + characterSaveRes.body._id)
                      .expect(200)
                      .end(function (characterInfoErr, characterInfoRes) {
                        // Handle Character error
                        if (characterInfoErr) {
                          return done(characterInfoErr);
                        }

                        // Set assertions
                        (characterInfoRes.body._id).should.equal(characterSaveRes.body._id);
                        (characterInfoRes.body.name).should.equal(character.name);
                        should.equal(characterInfoRes.body.user, undefined);

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
      Character.remove().exec(done);
    });
  });
});
