describe('ImmutableObserver', function() {
  beforeEach(function(done) {
    cleanupContext = {
      stoppables: [],
    };
    done();
  });

  afterEach(function(done) {
    cleanupContext.stoppables.forEach(function(stoppable) {
      stoppable.stop();
    });
    done();
  });

  function stopAfter(stoppable) {
    cleanupContext.stoppables.push(stoppable);
    return stoppable;
  }

  function observePhases(observer, done, _) {
    var phases = Array.prototype.slice.call(arguments, 2);

    var phase = 0;

    function phaseDone() {
      phase++;
    }

    stopAfter(Tracker.autorun(function() {
      var documents = observer.documents();
      if (phases[phase]) {
        phases[phase](documents, phaseDone);
      }
      if (phase >= phases.length) {
        return done();
      }
    }));
  }

  describe('ImmutableObserver.List', function() {
    beforeEach(function(done) {
      Meteor.call('clearPlayers', function() {
        stopAfter(Meteor.subscribe('players', {onReady: function() {
          done(); 
       }}));
      });
    });

    it('throws if called within a reactive compuation', function(done) {
      stopAfter(Tracker.autorun(function() {
        expect(function() {
          ImmutableObserver.List(Players.find())
        }).toThrowError();
        done();
      }));
    });

    it('gets inital document', function(done) {
      Players.insert({name: 'Andy', score: 1000000}, function(error, id) {
        if (error) done.fail(error);
        var observer = ImmutableObserver.List(Players.find());
        stopAfter(observer);

        var documents = observer.documents();
        expect(documents.size).toBe(1);
        expect(documents.getIn([0, '_id'])).toBe(id);
        expect(documents.getIn([0, 'name'])).toBe('Andy');
        expect(documents.getIn([0, 'score'])).toBe(1000000);
        done();
      });
    });

    it('handles single insertion', function(done) {
      var observer = ImmutableObserver.List(Players.find());
      stopAfter(observer);
      
      observePhases(observer, done,
        function(documents, phaseDone) {
          if (!documents.size) {
            Players.insert({name: 'Andy', score: 1000000});
            phaseDone();
          }
        },
        function(documents, phaseDone) {
          if (documents.size === 1) {
            var player = documents.get(0);
            expect(player.get('name')).toBe('Andy');
            expect(player.get('score')).toBe(1000000);
            done();
          }
        }
      );
    });

    it('handles single removal', function(done) {
      var observer = ImmutableObserver.List(Players.find());
      stopAfter(observer);

      var phase = 0;

      Players.insert({name: 'Andy', score: 1000000}, function(error, id) {
        if (error) done.fail(error);
        observePhases(observer, done, 
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.getIn([0, '_id']) === id) {
              Players.remove({_id: id});
              phaseDone();
            }
          },
          function(documents, phaseDone) {
            if (!documents.size) {
              phaseDone();
            }
          }
        );
      });
    });

    it('handles single update', function(done) {
      var observer = ImmutableObserver.List(Players.find());
      stopAfter(observer);

      Players.insert({name: 'Andy', score: 1000000}, function(error, id) {
        if (error) done.fail(error);
        observePhases(observer, done, 
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.getIn([0, '_id']) === id) {
              Players.update({_id: id}, {$inc: {score: 5}});
              phaseDone();
            }
          },
          function(documents, phaseDone) {
            if (documents.getIn([0, 'score']) === 1000005) {
              phaseDone();
            }
          }
        );
      });
    });

    it('handles single reordering', function(done) {
      var observer = ImmutableObserver.List(Players.find({}, {sort: {score: 1}}));
      stopAfter(observer);

      Players.insert({name: 'Andy', score: 1000000});
      Players.insert({name: 'Jim', score: 30516});
      Players.insert({name: 'John', score: 178982});
      Players.insert({name: 'Kate', score: 999999});
      Players.insert({name: 'Carla', score: 97817});

      observePhases(observer, done,
        function(documents, phaseDone) {
          if (documents.size === 5) {
            var index = documents.findIndex(function(player) { return player.get('name') === 'Andy'; });
            if (index === 4) {
              Players.update({_id: documents.getIn([index, '_id'])}, {$set: {score: 0}});
              phaseDone();
            }
          }
        },
        function(documents, phaseDone) {
          var index = documents.findIndex(function(player) { return player.get('name') === 'Andy'; });
          if (index === 0) {
            phaseDone();
          }
        }
      );
    });

    it('handles in-order insertion', function(done) {
      var observer = ImmutableObserver.List(Players.find({}, {sort: {score: 1}}));
      stopAfter(observer);

      stopAfter(Tracker.autorun(function() {
        var list = observer.documents();
        var prev;
        list.forEach(function(next) {
          if (prev) {
            expect(next.get('score')).not.toBeLessThan(prev.get('score'));
          }
          prev = next;
        });
        if (list.size === 5) {
          done();
        }
      }));

      Players.insert({name: 'Andy', score: 1000000});
      Players.insert({name: 'Jim', score: 30516});
      Players.insert({name: 'John', score: 178982});
      Players.insert({name: 'Kate', score: 999999});
      Players.insert({name: 'Carla', score: 97817});
    });

    it('merges updated fields correctly', function(done) {
      var observer = ImmutableObserver.List(Players.find());
      stopAfter(observer);

      Players.insert({name: 'Andy', test: {a: [{b: [{c: 1}, {d: 2}]}], e: [{f: 1}]}}, function(error, id) {
        if (error) done.fail(error);

        var initPlayer;
        var newTest = {test: {a: [{b: [{c: 1}, {d: 2, g: 3, h: 4}, {i: 5}]}], e: [{f: 1}]}};

        observePhases(observer, done,
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.getIn([0, '_id']) === id) {
              initPlayer = documents.get(0);
              Players.update({_id: id}, {$set: newTest, $unset: {name: ""}});
              phaseDone();
            }
          },
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.get(0) !== initPlayer) {
              var newPlayer = documents.get(0);
              var unchangedPaths = [['test', 'a', 0, 'b', 0], ['test', 'e', 0]];
              var changedPaths = [['name'], ['test', 'a', 0, 'b', 1], ['test', 'a', 0, 'b', 2]];
              unchangedPaths.forEach(function(path) {
                expect(newPlayer.getIn(path)).toBe(initPlayer.getIn(path));
              });
              changedPaths.forEach(function(path) {
                expect(newPlayer.getIn(path)).not.toBe(initPlayer.getIn(path));
              });
              expect(newPlayer.mergeDeep(newTest)).toBe(newPlayer);
              expect(newPlayer.get('name')).toBeUndefined();
              done();
            }
          }
        );
      });
    });
  });

  describe('ImmutableObserver.Map', function() {
    beforeEach(function(done) {
      Meteor.call('clearPlayers', function() {
        stopAfter(Meteor.subscribe('players', {onReady: function() {
          done(); 
       }}));
      });
    });

    it('throws if called within a reactive compuation', function(done) {
      stopAfter(Tracker.autorun(function() {
        expect(function() {
          ImmutableObserver.Map(Players.find())
        }).toThrowError();
        done();
      }));
    });

    it('gets inital document', function(done) {
      Players.insert({name: 'Andy', score: 1000000}, function(error, id) {
        if (error) done.fail(error);
        var observer = ImmutableObserver.Map(Players.find());
        stopAfter(observer);

        var documents = observer.documents();
        expect(documents.size).toBe(1);
        expect(documents.getIn([id, 'name'])).toBe('Andy');
        expect(documents.getIn([id, 'score'])).toBe(1000000);
        done();
      });
    });

    it('handles single insertion', function(done) {
      var observer = ImmutableObserver.Map(Players.find());
      stopAfter(observer);
      
      observePhases(observer, done,
        function(documents, phaseDone) {
          if (!documents.size) {
            Players.insert({name: 'Andy', score: 1000000});
            phaseDone();
          }
        },
        function(documents, phaseDone) {
          if (documents.size === 1) {
            documents.forEach(function(player) {
              expect(player.get('name')).toBe('Andy');
              expect(player.get('score')).toBe(1000000);
              done();
            });
          }
        }
      );
    });

    it('handles single removal', function(done) {
      var observer = ImmutableObserver.Map(Players.find());
      stopAfter(observer);

      Players.insert({name: 'Andy', score: 1000000}, function(error, id) {
        if (error) done.fail(error);
        observePhases(observer, done, 
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.has(id)) {
              Players.remove({_id: id});
              phaseDone();
            }
          },
          function(documents, phaseDone) {
            if (!documents.size) {
              phaseDone();
            }
          }
        );
      });
    });

    it('handles single update', function(done) {
      var observer = ImmutableObserver.Map(Players.find());
      stopAfter(observer);

      Players.insert({name: 'Andy', score: 1000000}, function(error, id) {
        if (error) done.fail(error);
        observePhases(observer, done, 
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.has(id)) {
              Players.update({_id: id}, {$inc: {score: 5}});
              phaseDone();
            }
          },
          function(documents, phaseDone) {
            if (documents.getIn([id, 'score']) === 1000005) {
              phaseDone();
            }
          }
        );
      });
    });

    it('merges updated fields correctly', function(done) {
      var observer = ImmutableObserver.Map(Players.find());
      stopAfter(observer);

      Players.insert({name: 'Andy', test: {a: [{b: [{c: 1}, {d: 2}]}], e: [{f: 1}]}}, function(error, id) {
        if (error) done.fail(error);

        var initPlayer;
        var newTest = {test: {a: [{b: [{c: 1}, {d: 2, g: 3, h: 4}, {i: 5}]}], e: [{f: 1}]}};

        observePhases(observer, done,
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.has(id)) {
              initPlayer = documents.get(id);
              Players.update({_id: id}, {$set: newTest, $unset: {name: ""}});
              phaseDone();
            }
          },
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.get(id) !== initPlayer) {
              var newPlayer = documents.get(id);
              var unchangedPaths = [['test', 'a', 0, 'b', 0], ['test', 'e', 0]];
              var changedPaths = [['name'], ['test', 'a', 0, 'b', 1], ['test', 'a', 0, 'b', 2]];
              unchangedPaths.forEach(function(path) {
                expect(newPlayer.getIn(path)).toBe(initPlayer.getIn(path));
              });
              changedPaths.forEach(function(path) {
                expect(newPlayer.getIn(path)).not.toBe(initPlayer.getIn(path));
              });
              expect(newPlayer.mergeDeep(newTest)).toBe(newPlayer);
              expect(newPlayer.get('name')).toBeUndefined();
              done();
            }
          }
        );
      });
    });
  });

  describe('ImmutableObserver.IndexBy', function() {
    beforeEach(function(done) {
      Meteor.call('clearUserNotifications', function() {
        stopAfter(Meteor.subscribe('userNotifications', {onReady: function() {
          done(); 
       }}));
      });
    });

    function observe(cursor) {
      return stopAfter(ImmutableObserver.IndexBy(cursor, function(document) {
        return document.get('podId') + '^' + document.get('channelId');
      }));
    }

    it('throws if called within a reactive compuation', function(done) {
      stopAfter(Tracker.autorun(function() {
        expect(function() { observe(UserNotifications.find()); }).toThrowError();
        done();
      }));
    });

    it('gets inital document', function(done) {
      UserNotifications.insert({podId: 'pod1', channelId: 'rop', 
        userId: 'andy', alarmIds: ['high alarm']}, function(error, id) {

        var observer = observe(UserNotifications.find());

        var documents = observer.documents();
        expect(documents.size).toBe(1);
        expect(documents.getIn(['pod1^rop', 'userId'])).toBe('andy');
        expect(documents.getIn(['pod1^rop', 'alarmIds'])).toEqual(['high alarm']);
        done();
      });
    });

    it('handles single insertion', function(done) {
      var observer = observe(UserNotifications.find());
      
      observePhases(observer, done,
        function(documents, phaseDone) {
          if (!documents.size) {
            UserNotifications.insert({podId: 'pod1', channelId: 'rop', 
              userId: 'andy', alarmIds: ['high alarm']}, function(error, id) {
            phaseDone();
          }
        },
        function(documents, phaseDone) {
          if (documents.size === 1) {
            expect(documents.getIn(['pod1^rop', 'userId'])).toBe('andy');
            expect(documents.getIn(['pod1^rop', 'alarmIds'])).toEqual(['high alarm']);
            done();
          }
        }
      );
    });

    it('handles single removal', function(done) {
      var observer = observe(UserNotifications.find());

      UserNotifications.insert({podId: 'pod1', channelId: 'rop', 
              userId: 'andy', alarmIds: ['high alarm']}, function(error, id) {
        if (error) done.fail(error);
        observePhases(observer, done, 
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.has('pod1^rop')) {
              UserNotifications.remove({_id: id});
              phaseDone();
            }
          },
          function(documents, phaseDone) {
            if (!documents.size) {
              phaseDone();
            }
          }
        );
      });
    });

    it('handles single update', function(done) {
      var observer = observe(UserNotifications.find());

      UserNotifications.insert({podId: 'pod1', channelId: 'rop', 
              userId: 'andy', alarmIds: ['high alarm']}, function(error, id) {
        if (error) done.fail(error);
        observePhases(observer, done, 
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.has('pod1^rop')) {
              UserNotifications.update({_id: id}, {$push: {alarmIds: 'low alarm'}});
              phaseDone();
            }
          },
          function(documents, phaseDone) {
            if (documents.getIn(['pod1^rop1', 'alarmIds', 1]) === 'low alarm') {
              phaseDone();
            }
          }
        );
      });
    });

    it('merges updated fields correctly', function(done) {
      var observer = observe(UserNotifications.find());

      UserNotifications.insert({name: 'Andy', test: {a: [{b: [{c: 1}, {d: 2}]}], e: [{f: 1}]}}, function(error, id) {
        if (error) done.fail(error);

        var initPlayer;
        var newTest = {test: {a: [{b: [{c: 1}, {d: 2, g: 3, h: 4}, {i: 5}]}], e: [{f: 1}]}};

        observePhases(observer, done,
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.has(id)) {
              initPlayer = documents.get(id);
              UserNotifications.update({_id: id}, {$set: newTest, $unset: {name: ""}});
              phaseDone();
            }
          },
          function(documents, phaseDone) {
            if (documents.size === 1 && documents.get(id) !== initPlayer) {
              var newPlayer = documents.get(id);
              var unchangedPaths = [['test', 'a', 0, 'b', 0], ['test', 'e', 0]];
              var changedPaths = [['name'], ['test', 'a', 0, 'b', 1], ['test', 'a', 0, 'b', 2]];
              unchangedPaths.forEach(function(path) {
                expect(newPlayer.getIn(path)).toBe(initPlayer.getIn(path));
              });
              changedPaths.forEach(function(path) {
                expect(newPlayer.getIn(path)).not.toBe(initPlayer.getIn(path));
              });
              expect(newPlayer.mergeDeep(newTest)).toBe(newPlayer);
              expect(newPlayer.get('name')).toBeUndefined();
              done();
            }
          }
        );
      });
    });
  });

});