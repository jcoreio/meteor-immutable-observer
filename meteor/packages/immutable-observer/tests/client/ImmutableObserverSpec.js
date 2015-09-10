describe('ImmutableObserver', function() {
  it('basic test', function(done) {
    var failTimeout = setTimeout(done.fail, 5000);
    var observer = ImmutableObserver(Players.find({name: 'Andy', score: {$gt: 1000000}})); 

    var origDone = done;
    done = function() {
      observer.stop();
      clearTimeout(failTimeout);
      origDone();
    }
    done.fail = function(msg) {
      observer.stop();
      clearTimeout(failTimeout);
      origDone.fail(msg);
    }

    Meteor.call('clearPlayers');
    var comp = Tracker.autorun(function() {
      Meteor.subscribe('players');
      console.log(JSON.stringify(observer.documentMap().toJS(), null, "  "));
      if (observer.documentMap().size) {
        done();
      }
    });
    Players.insert({name: 'Andy', score: 1000000}, function(error, _id) {
      if (error) {
        done.fail(error);
      }
      Players.update({_id: _id}, {$inc: {score: 5}}, function(error) {
        if (error) {
          done.fail(error);
        }
      });
    });
  });
  it('gets multiple items in correct sorted order', function(done) {
    var failTimeout = setTimeout(done.fail, 5000);
    var observer = ImmutableObserver(Players.find({}, {sort: {score: 1}}));

    var origDone = done;
    done = function() {
      observer.stop();
      clearTimeout(failTimeout);
      origDone();
    }
    done.fail = function(msg) {
      observer.stop();
      clearTimeout(failTimeout);
      origDone.fail(msg);
    }

    Meteor.call('clearPlayers');
    var comp = Tracker.autorun(function() {
      Meteor.subscribe('players');
      var list = observer.documentList();
      console.log(JSON.stringify(list.toJS(), null, "  "));
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
    });

    Players.insert({name: 'Andy', score: 1000000});
    Players.insert({name: 'Jim', score: 30516});
    Players.insert({name: 'John', score: 178982});
    Players.insert({name: 'Kate', score: 999999});
    Players.insert({name: 'Carla', score: 97817});
  });
  it('updates fields correctly', function(done) {
    var failTimeout = setTimeout(done.fail, 5000);
    var observer = ImmutableObserver(Players.find());

    var origDone = done;
    done = function() {
      if (Tracker.currentComputation) {
        Tracker.currentComputation.stop();
      }
      observer.stop();
      clearTimeout(failTimeout);
      origDone();
    }
    done.fail = function(msg) {
      if (Tracker.currentComputation) {
        Tracker.currentComputation.stop();
      }
      observer.stop();
      clearTimeout(failTimeout);
      origDone.fail(msg);
    }

    Meteor.call('clearPlayers');

    var _id;

    Players.insert({name: 'Andy', test: {a: [{b: [{c: 1}, {d: 2}]}], e: [{f: 1}]}}, function(error, id) {
      if (error) done.fail(error);
      _id = id;
    });

    var initPlayer;

    function phase1() {
      var comp = Tracker.autorun(function() {
        Meteor.subscribe('players');
        console.log(JSON.stringify(observer.documentList().toJS(), null, "  "));
        if (observer.count() === 1 && observer.documentList().getIn([0, '_id']) === _id) {
          initPlayer = observer.documentList().get(0);
          comp.stop();
          phase2();
        }
      });    
    }

    function phase2() {
      var updated = false;
      var newTest = {test: {a: [{b: [{c: 1}, {d: 2, g: 3, h: 4}, {i: 5}]}], e: [{f: 1}]}};
      Players.update({_id: _id}, {$set: newTest, $unset: {name: ""}});

      var comp = Tracker.autorun(function() {
        Meteor.subscribe('players');
        console.log(JSON.stringify(observer.documentList().toJS(), null, "  "));
        if (observer.count() === 1 && observer.documentList().get(0) !== initPlayer) {
          var newPlayer = observer.documentList().get(0);
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
      });
    }

    phase1();
  });
});