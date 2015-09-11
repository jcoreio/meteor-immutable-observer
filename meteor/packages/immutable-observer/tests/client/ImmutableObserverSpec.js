describe('ImmutableObserver', function() {
  beforeEach(function(done) {
    cleanupContext = {
      stoppables: [],
    };
    Meteor.call('clearPlayers', function() {
      stopAfter(Meteor.subscribe('players', {onReady: function() {
        done(); 
     }}));
    });
  });

  afterEach(function(done) {
    cleanupContext.stoppables.forEach(function(stoppable) {
      stoppable.stop();
    });
    done();
  });

  function stopAfter(stoppable) {
    cleanupContext.stoppables.push(stoppable);
  }

  describe('ImmutableObserver.List', function() {
    it('gets multiple items in correct sorted order', function(done) {
      var observer = ImmutableObserver.List(Players.find({}, {sort: {score: 1}}));
      stopAfter(observer);

      stopAfter(Tracker.autorun(function() {
        var list = observer.documents();
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
      }));

      Players.insert({name: 'Andy', score: 1000000});
      Players.insert({name: 'Jim', score: 30516});
      Players.insert({name: 'John', score: 178982});
      Players.insert({name: 'Kate', score: 999999});
      Players.insert({name: 'Carla', score: 97817});
    });
  });

  describe('ImmutableObserver.Map', function() {
    it('basic test', function(done) {
      var observer = ImmutableObserver.Map(Players.find({name: 'Andy', score: {$gt: 1000000}})); 
      stopAfter(observer);

      stopAfter(Tracker.autorun(function() {
        var documents = observer.documents();
        console.log(JSON.stringify(documents.toJS(), null, "  "));
        if (documents.size) {
          done();
        }
      }));
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

    it('updates fields correctly', function(done) {
      var observer = ImmutableObserver.Map(Players.find());
      stopAfter(observer);

      var _id;

      Players.insert({name: 'Andy', test: {a: [{b: [{c: 1}, {d: 2}]}], e: [{f: 1}]}}, function(error, id) {
        if (error) done.fail(error);
        _id = id;
        phase1();
      });

      var initPlayer;

      function phase1() {
        var comp = Tracker.autorun(function(comp) {
          var documents = observer.documents();
          console.log(JSON.stringify(documents.toJS(), null, "  "));
          if (documents.size === 1 && documents.has(_id)) {
            initPlayer = documents.get(_id);
            comp.stop();
            phase2();
          }
        });
        stopAfter(comp);
      }

      function phase2() {
        var updated = false;
        var newTest = {test: {a: [{b: [{c: 1}, {d: 2, g: 3, h: 4}, {i: 5}]}], e: [{f: 1}]}};
        Players.update({_id: _id}, {$set: newTest, $unset: {name: ""}});

        var comp = Tracker.autorun(function() {
          Meteor.subscribe('players');
          var documents = observer.documents();
          console.log(JSON.stringify(documents.toJS(), null, "  "));
          if (documents.size === 1 && documents.get(_id) !== initPlayer) {
            var newPlayer = documents.get(_id);
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
        stopAfter(comp);
      }
    });
  });

});